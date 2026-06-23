import { makeAutoObservable, makeObservable } from "mobx";
import { IsoFile } from "../IsoReader";
import shiftjis from 'shiftjis';

const DiscOneExecutable = "SLPS_018.40;1";

const DiscOneTBLFiles = [
    "/EVENT/EVENT.TBL"
];

interface ITBLEntry {
    name: string;
    pos: number;
}

class TBLFile {
    entries: ITBLEntry[];

    constructor(data: Buffer) {
        this.entries = [];

        const count = data.length / 16;

        for (let i = 0 ; i < count ; i++) {
            const start = i * 16;

            let name = '';
            for (let t = 0 ; t < 0xc ; t++) {
                const char = data.readInt8(start + t);

                if (char === 0) {
                    break;
                }

                name = name.concat(shiftjis.decode([char]));
            }

            const pos = data.readInt32LE(start + 0xc) * 0x800;

            this.entries.push({
                name,
                pos
            });
        }
    }
}

type RLOperatorFn = (engine: RLEventEngine) => void;

export class RLOperator {
    constructor(public name: string, private fn: RLOperatorFn) {}

    process(engine: RLEventEngine) {
        this.fn(engine);
    }
}

const nop = (_: RLEventEngine) => {
    console.info(`NOP`);
    debugger;
};

const logic_or = (engine: RLEventEngine) => {
    const a = engine.pop_and_map();
    const b = engine.pop_and_map();

    if (a || b) {
        engine.push(0x4000001);
    } else {
        engine.push(0x4000000);
    }

    console.debug(`${print_hex(a)} || ${print_hex(b)}`);
}

const set = (engine: RLEventEngine) => {
    const val = engine.pop_and_map();
    const loc = engine.pop();

    if (val === undefined) {
        console.error(`Attempt to set ${print_hex(loc)} to ${val}`)
        throw new Error(`Attempt to set undefined`);
    }

    if ((loc & 0x20000000) == 0) {
        console.debug(`SET Stack[${loc & 0xffff}] = ${val.toString(16)}`);

        engine.stack[loc & 0xffff] = val;
    } else {
        console.debug(`SET Global[${loc & 0xffff}] = ${val.toString(16)}`);
        
        engine.globals[loc & 0xffff] = val;
    }
}

const cmd_shift_right = (engine: RLEventEngine) => {
    const bits = engine.pop_and_map() & 0x1f;
    const val = engine.pop_and_map();

    const result = (val >> bits) & 0xffff | 0x4000000;

    engine.push(result);
}

const eql = (engine: RLEventEngine) => {
    const a = engine.pop_and_map();
    const b = engine.pop_and_map();

    if (a === b) {
        engine.push(0x4000001);
    } else {
        engine.push(0x4000000);
    }

    console.debug(`${print_hex(a)} == ${print_hex(b)}`);
}

const neql = (engine: RLEventEngine) => {
    const a = engine.pop_and_map();
    const b = engine.pop_and_map();

    if (a !== b) {
        engine.push(0x4000001);
    } else {
        engine.push(0x4000000);
    }

    console.debug(`${print_hex(a)} != ${print_hex(b)}`);
}

const lt = (engine: RLEventEngine) => {
    const a = engine.pop_and_map();
    const b = engine.pop_and_map();

    if (b < a) {
        engine.push(0x4000001);
    } else {
        engine.push(0x4000000);
    }

    console.debug(`${print_hex(a)} < ${print_hex(b)}`);
}

const gt = (engine: RLEventEngine) => {
    const a = engine.pop_and_map();
    const b = engine.pop_and_map();

    if (b > a) {
        engine.push(0x4000001);
    } else {
        engine.push(0x4000000);
    }

    console.debug(`${print_hex(a)} > ${print_hex(b)}`);
}

const add = (engine: RLEventEngine) => {
    const a = engine.pop_and_map();
    const b = engine.pop_and_map();

    engine.push(0x4000000 | (a + b));
    
    console.debug(`${print_hex(a)} + ${print_hex(b)}`);
}

const bit_and = (engine: RLEventEngine) => {
    const a = engine.pop_and_map();
    const b = engine.pop_and_map();

    engine.push(0x4000000 | (a & b & 0xffff));
    
    console.debug(`${print_hex(a)} & ${print_hex(b)}`);
}

const je = (engine: RLEventEngine) => {
    const dest = engine.pop_and_map();
    const val = engine.pop_and_map();

    if (val === 0) {
        engine.pc = (dest - 1) & 0xffff;
    }

    console.debug(`JZ: ${print_hex(val)} => ${print_hex(dest & 0xffff)}`);
}

const jn = (engine: RLEventEngine) => {
    const dest = engine.pop_and_map();
    const val = engine.pop_and_map();

    if (val !== 0) {
        engine.pc = (dest - 1) & 0xffff ;
    }

    console.debug(`JN: ${print_hex(val)} => ${print_hex(dest & 0xffff)}`);
}

const jp = (engine: RLEventEngine) => {
    const dest = engine.pop_and_map();

    engine.pc = (dest - 1) & 0xffff;

    console.debug(`JP: ${print_hex(dest & 0xffff)}`);
}

const jsr = (engine: RLEventEngine) => {
    const dest = engine.pop_and_map();

    console.debug(`JSR: ${print_hex(dest & 0xffff)}`);

    engine.push(engine.pc);
    engine.push(engine.stack_min);
    engine.stack_min = engine.stack_p;
    engine.pc = (dest & 0xffff) - 1
}

const ret = (engine: RLEventEngine) => {
    engine.stack_p = engine.stack_min;
    engine.stack_min = engine.pop();
    engine.pc = engine.pop();

    console.debug(`RET: ${engine.pc}`);
}

const call = (engine: RLEventEngine) => {
    const param = engine.pop_and_map();

    const cmd = RLCommands[param];

    if (!cmd) {
        throw new Error(`Unknown cmd ${param.toString(16)}`);
    }

    console.debug(`CALL ${cmd.name}`);

    cmd.process(engine);
}

const offset = (engine: RLEventEngine) => {
    console.debug(`OFFSET`);

    const param_count = engine.pop_and_map();

    console.debug(`Params: ${param_count}`);

    let total = 0;

    for (let i = 0; i < param_count ; i++) {
        total += engine.pop_and_map();
    }

    const low = engine.pop();
    total += (low & 0xffff);

    const result = low & 0x7f000000 | total;

    console.debug(`Result: ${result.toString(16)}`);

    engine.push(result);
}

const RLOperators = [
 //   new RLOperator("unk", nop),
    new RLOperator("||", logic_or), // 0
    new RLOperator("&&", nop), // 1
    new RLOperator("==", eql), // 2
    new RLOperator("!=", neql), // 3
    new RLOperator(">=", nop), // 4
    new RLOperator("<=", nop), // 5
    new RLOperator("<<", nop), // 6
    new RLOperator(">>", cmd_shift_right), // 7
    new RLOperator("=", set), // 8
    new RLOperator("|", nop), // 9
    new RLOperator("^", nop), // a
    new RLOperator("&", bit_and), // b
    new RLOperator(">", gt), // c
    new RLOperator("<", lt), // d
    new RLOperator("/", nop), // e
    new RLOperator("*", nop), // f
    new RLOperator("+", add), // 10
    new RLOperator("-", nop), // 11
    new RLOperator("!", nop), // 12
    new RLOperator("%", nop), // 13
    new RLOperator("neg", nop), // 14
    new RLOperator("JE", je), // 15
    new RLOperator("JN", jn), // 16
    new RLOperator("JP", jp), // 17
    new RLOperator("JSR", jsr), // 18
    new RLOperator("RET", ret), // 19
    new RLOperator("CALL", call), // 1a
    new RLOperator("OFFSET", offset), // 1b
    new RLOperator("NOP", nop),
    new RLOperator("NOP", nop),
    new RLOperator("NOP", nop),
];

const select = (engine: RLEventEngine) => {
    let param_count = engine.pop_and_map();

    let options: number[] = [];
    for (let i = 0 ; i < param_count ; i++) {
        options[i] = engine.pop_and_map();
    }

    const select_id = options[1];

    switch(select_id) {
        case 0x5:
            console.info('Start/load select');
            engine.push_const(1);
            break;
        default:
            console.error(`Unknown select: ${select_id.toString(16)}`);
            engine.push_const(0);
            break;
    }
};

const bgm = (engine: RLEventEngine) => {
    let param_count = engine.pop_and_map();

    let bgm_name = [];

    if (param_count !== 0) {
        for (let i = 0 ; i < param_count ; i++) {
            bgm_name[i] = engine.pop_and_map();
        }
    }

    console.log(`BGM: ${bgm_name.map(n => String.fromCharCode(n)).join('')}`);

  //  console.log(`Increasing stack_p by ${2 + param_count}`);
  //  engine.stack_p += 2 + param_count;
}

const clear_parameters = (engine: RLEventEngine) => {
    let param_count = engine.pop_and_map();

    while (param_count > 0) {
        engine.pop();
        param_count--;
    }
}

const effect = (engine: RLEventEngine) => {
    let param_count = engine.pop_and_map();
    const effect_id = engine.pop_and_map();

    while (param_count > 1) {
        engine.pop();
        param_count--;
    }

    console.debug(`EFFECT ID: ${effect_id.toString(16)}`);
}

const disp_mode = (engine: RLEventEngine) => {
    let param_count = engine.pop_and_map();
    const mode = engine.pop_and_map();

    while (param_count > 1) {
        engine.pop();
        param_count--;
    }

    console.debug(`DISP_MODE: ${mode.toString(16)}`);
}

const bg2 = (engine: RLEventEngine) => {
    let param_count = engine.pop_and_map();
    const option = engine.pop_and_map();

    while (param_count > 1) {
        engine.pop();
        param_count--;
    }

    console.debug(`BG2 ${option.toString(16)}`);

   // engine.push(0);
}

const get_stats_sram = (engine: RLEventEngine) => {
    console.debug(`GET STATS SRAM`);

    let param_count = engine.pop_and_map();
    const option = engine.pop_and_map();

    while (param_count > 1) {
        engine.pop();
        param_count--;
    }

    engine.push(0x4000000);
}

const name_entry = (engine: RLEventEngine) => {
    clear_parameters(engine);
}

const show = (engine: RLEventEngine) => {
    engine.is_show = true;

    clear_parameters(engine);

    console.debug(`SHOW`);
}

const movie = (engine: RLEventEngine) => {
    console.debug('MOVIE');

    let param_count = engine.pop_and_map();
    const movie_id = engine.pop_and_map();

    while (param_count > 1) {
        engine.pop();
        param_count--;
    }

    console.debug(`Movie ID: ${movie_id}`);
}

const msg_close = (engine: RLEventEngine) => {
    console.debug('MSG_CLOSE');

    clear_parameters(engine);
}

const clear_global_data = (engine: RLEventEngine) => {
    let param_count = engine.pop_and_map();

    /* This seems wrong?
    while (param_count) {
        engine.pop();
        param_count--;
    }
*/
    for (let i = 0 ; i < engine.globals.length ; i++) {
        engine.globals[i] = 0;
    }

    console.debug(`CLEAR_GLOBAL_DATA`);
}

const get_disc_id = (engine: RLEventEngine) => {
    clear_parameters(engine);

    engine.push(1 | 0x4000000);

    console.debug(`GET_DISC_ID`);
}

const disc_stop = (engine: RLEventEngine) => {
    console.debug(`DISC STOP`);

    let param_count = engine.pop_and_map();
    let option = engine.pop_and_map();

    while (param_count > 1) {
        engine.pop();
        param_count--;
    }
}

const RLCommands = [
    new RLOperator("MSGOPEN", nop), // 0
    new RLOperator("PRINTF", nop),  // 1
    new RLOperator("SELECT", select),  // 2
    new RLOperator("BG", nop),      // 3
    new RLOperator("SE", nop),      // 4
    new RLOperator("BGM", bgm),     // 5
    new RLOperator("STILL", nop),   // 6
    new RLOperator("PERSON", nop),  // 7
    new RLOperator("EFFECT", effect), // 8
    new RLOperator("EVENT", effect), // 9
    new RLOperator("DISPMODE", disp_mode), // a
    new RLOperator("NAMEENTRY", name_entry), // b
    new RLOperator("HIROKAN", nop), // c
    new RLOperator("REVDIRECT", nop), // d
    new RLOperator("CHECK32BITFLAG", nop), // e
    new RLOperator("CHECKPERSONFLAG", nop), // f
    new RLOperator("RAND", nop), // 10
    new RLOperator("JDGALLGALLOVE", nop), // 11
    new RLOperator("JDG3GALLOVE", nop),   // 12
    new RLOperator("JDGALLGALFRIEND", nop), // 13
    new RLOperator("JDG3GALFRIEND", nop), // 14
    new RLOperator("SHOW", show), // 15
    new RLOperator("CHECK_DATA_FLAG_0", nop), // 16
    new RLOperator("CHECK_DATA_FLAG_1", nop), // 17
    new RLOperator("CHECK_DATA_FLAG_2", nop), // 18
    new RLOperator("MOVIE", movie), // 19
    new RLOperator("ANIMATION", nop), // 1a
    new RLOperator("PAD", nop), // 1b
    new RLOperator("BG2", bg2), // 1c
    new RLOperator("GETSTATSSRAM", get_stats_sram), // 1d
    new RLOperator("SAVESTATSSRAM", nop), // 1e
    new RLOperator("GETDATEDATA", nop), // 1f
    new RLOperator("SYSSE", nop), // 20
    new RLOperator("WAIT", nop), // 21
    new RLOperator("SEEK", nop), // 22
    new RLOperator("JDGRANKING", nop), // 23
    new RLOperator("PERSONDOUBLE", nop), // 24
    new RLOperator("GETSTATSSRAM", nop), // 25
    new RLOperator("GAMESPEED", nop), // 26
    new RLOperator("MSGCLOSE", msg_close), // 27
    new RLOperator("CLEARGLOBALDATA", clear_global_data), // 28
    new RLOperator("GETDISCID", get_disc_id), // 29
    new RLOperator("DISCSTOP", disc_stop),
    new RLOperator("DISCCHANGE", nop),
    new RLOperator("JDGSUBGALLOVE", nop),
    new RLOperator("JDGSUBGALFRIEND", nop),
    new RLOperator("DISCCOVERCHECK", nop),
    new RLOperator("DISCINIT", nop),
]

export type EventStep = number | RLOperator;

export class RLEvent {
    steps: EventStep[];

    dataOffset: number;

    constructor(data: Buffer) {
        this.steps = [];

        if (data[0] !== 0x46 || data[1] !== 0x4c) {
            throw new Error("Unexpected event data");
        }

        this.dataOffset = data.readInt32LE(4);
        console.log(`Event data base: ${this.dataOffset}`);


        for (let i = 24 ; i < data.length ; i += 4) {
            let step = data.readInt32LE(i);

            if (step === -1) {
                break;
            }

            if ((step & 0x7f000000) == 0x10000000) {
                this.steps.push(RLOperators[step & 0xffff]);
            } else {
                this.steps.push(step);
            }
        }
    }
}

export class RLEventEngine {
    stack: number[] = new Array(0x4000);
    stack_p: number = 0;
    stack_min: number = 0;
    globals: number[] = new Array(0x4000);
    pc: number = 0;
    global_sp: number = 0;

    is_show: boolean = false;

    constructor(public e: RLEvent) {
        makeAutoObservable(this);

        for (let i = 0 ; i < this.stack.length ; i++) {
            this.stack[i] = 0;
        }

        for (let i = 0 ; i < this.globals.length ; i++) {
            this.globals[i] = 0;
        }

        this.push(0x8019A7C4);
        this.push(0x8019A7C4);
        this.push(0x8019A7C4);
        this.push(0x8019A7C4);
        this.push(0x8019A7C4);
        this.push(0);
        this.push(0);
        this.push(0);
        this.push(0);

        this.globals[0] = 0xe58e;
        this.globals[1] = 0x6c90;
        this.globals[2] = 0xf68c;
        this.globals[3] = 0;
        this.globals[4] = 0xe58e;
        this.globals[5] = 0x6c90;
        this.globals[6] = 0xf68c;
        this.globals[7] = 0;
    }

    run() {
        let steps = 0;

        while (this.pc >= 0 && this.pc <= this.e.steps.length) {
            console.debug(`PC: ${this.pc}`);

            this.step();

            steps++;

            if (steps > 2000)
                break;
        }

        console.info(`Event stopped`);
    }

    step() {
        const step = this.e.steps[this.pc];

        if (step instanceof RLOperator) {
            console.debug(`Op: ${step.name}`);
            
            step.process(this);
        } else {
            this.push(step);
        }

        this.pc += 1;
    }

    pop() {
        if (this.stack_p == 0) {
            console.error(`POP empty stack`);

            throw new Error(`POP empty stack`);
        }

        this.stack_p--;
        const i = this.stack[this.stack_p];

        if (i === undefined) {
            throw new Error(`Popped undefined`);
        }

        console.debug(`POP: Stack[${this.stack_p + 1}] = ${print_hex(i)}`);

        return i || 0;
    }

    map_temp: number = -1;

    pop_and_map(): number {
        const i = this.pop();

        /*
          if ((cmd_param & 0x20000000) == 0) {
            if ((cmd_param & 0x40000000) == 0) {
                if (((cmd_param & 0x7f000000) == 0x4000000) || ((cmd_param & 0x7f000000) == 0x8000000)) {
                    DAT_8007b67c = (short)cmd_param;
                    iVar1 = (int)DAT_8007b67c;
                    _DAT_8007b67c = cmd_param;
                    return iVar1;
                }
                msg = "命令の実行ができません。（命令に渡すパラメータがない）";
            }
            else {
            psVar2 = local_stack_start;
            if ((cmd_param & 0xffff) < local_stack_size) goto LAB_80012de8;
            msg = "ローカル変数範囲外をアクセスした。";
            }
        } else {
            psVar2 = global_stack_start;
            if ((cmd_param & 0xffff) < global_stack_size) {
        LAB_80012de8:
            return (int)psVar2[cmd_param & 0xffff];
            }
            msg = "グローバル変数範囲外をアクセスした。";
        }*/
        if ((i & 0x20000000) == 0) {
            if ((i & 0x40000000) == 0) {
                if (((i & 0x7f000000) == 0x4000000) || 
                    ((i & 0x7f000000) == 0x8000000)) {
                    this.map_temp = i & 0xffff;

                    console.debug(`POP_MAP Short: ${this.map_temp.toString(16)}`);

                    return this.map_temp;
                }
            } else {
                const s = this.stack[i & 0xffff];
                console.debug(`POP_MAP Stack idx: ${(i & 0xffff).toString(16)} val: ${s ? s.toString(16) : 0}`);

                if (s === undefined) {
                    throw new Error(`Attempted to map from unknown stack ${i & 0xffff} size ${this.stack.length}`);
                }

                return s;
            }
        } else {
            const g = this.globals[i & 0xffff];

            console.debug(`POP_MAP Global idx: ${i & 0xffff} val: ${g ? g.toString(16) : 0}`);

            if (g === undefined) {
                throw new Error(`Attempted to map from unknown global ${i & 0xffff}`);
            }

            return g;
        }

        throw new Error(`Unknown state mapping val: 0x${i.toString(16)}`);
    }

    push(n: number) {
        console.debug(`PUSH: ${print_hex(n)}`);

        if (n === undefined) {
            console.error(`Attempt to push undefined`);
            throw new Error(`Attempt to push undefined`);
        }

        if (n === 0) {
            console.error('Attempt to push 0');
        }

        this.stack[this.stack_p] = n;
        console.debug(`STACK[${this.stack_p}] = ${print_hex(n)}`);

        this.stack_p++;
    }

    push_const(n: number) {
        this.push(0x4000000 | n);
    }
}

export class RefrainLoveImage {
    public items: { [name: string]: Uint8Array } = {};
    public tbls: { [name: string]: TBLFile } = {};

    constructor(private image: IsoFile) {
        for (const tblFilename of DiscOneTBLFiles) {
            const tblContent = image.getFile(tblFilename);

            this.tbls[tblFilename] = new TBLFile(tblContent);
        }
    }

    loadEvent(name: string) {
        for (let tblFile of Object.keys(this.tbls)) {
            const tbl = this.tbls[tblFile];

            for (let i = 0 ; i < tbl.entries.length ; i++) {
                if (tbl.entries[i].name === name) {
                    const datFileName = tblFile.replace(".TBL", ".DAT");
                    const datFile = this.image.getFile(datFileName);

                    const start = tbl.entries[i].pos;
                    const end = i < tbl.entries.length ?
                        tbl.entries[i + 1].pos :
                        datFile.length;

                    return new RLEvent(
                        datFile.subarray(start, end)
                    );
                }
            }
        }

        return null;
    }
}

const print_hex = (n: number) => `0x${n.toString(16)}`;