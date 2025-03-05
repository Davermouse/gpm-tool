export interface CommandDefinition {
  commandId: number,
  title: string,
  params?: number
}

const commands: CommandDefinition[] = 
[ {
  commandId:
  0,
     title: "null",
     params: 0,
   },{commandId:
  1,
     title: "exit",
     params: 1,
   },{commandId:
  2,
     title: "goto",
     params: 1,
   },{commandId:
  3,
     title: "wait",
     params: 1,
   },{commandId:
  4,
     title: "winopen",
     params: 1,
   },{commandId:
  0x05,
     title: "winclose",
     params: 0,
   },{commandId:
  0x06,
     title: "pause",
     params: 0,
   },{commandId:
  0x07,
     title: "faceload",
   },{commandId:
  0x0a,
     title: "facefree",
   },{commandId:
  0x0d,
     title: "pgclose",
     params: 2,
   },{commandId:
  0x0f,
     title: "talk",
     params: 2,
   },{commandId:
  16,
     title: "voice",
     params: 1,
   },{commandId:
  0x11,
     title: "addtime",
     params: 1,
   },{commandId:
  0x12,
     title: "add_friend",
     params: 3,
   },{commandId:
  0x13,
     title: "add_love",
     params: 3,
   },{commandId:
  0x14,
     title: "pgon",
     params: 2,
   },{commandId:
  0x15,
     title: "pgoff",
     params: 2,
   },{commandId:
  0x16,
     title: "talk_end",
     params: 0,
   },{commandId:
  23,
     title: "select",
     params: 4,
   },{commandId:
  0x18,
     title: "stance",
     params: 3,
   },{commandId:
  0x19,
     title: "feeling",
     params: 3,
   },{commandId:
  26,
     title: "faceon",
     params: 2,
   },{commandId:
  27,
     title: "faceoff",
     params: 2,
   },{commandId:
  0x1c,
     title: "scenset",
   },{commandId:
  0x1e,
     title: "rise",
     params: 0,
   },{commandId:
  0x1f,
     title: "charfree",
     params: 1,
   },{commandId:
  0x20,
     title: "charon",
     params: 4,
   },{commandId:
  0x22,
     title: "fadein",
     params: 0,
   },{commandId:
  0x23,
     title: "fadeout",
     params: 0,
   },{commandId:
  0x26,
     title: "add_param",
   },{commandId:
  0x27,
     title: "status",
   },{commandId:
  0x28,
     title: "thrust",
     params: 0,
   },{commandId:
  0x29,
     title: "strname",
   },{commandId:
  0x2a,
     title: "bgon",
     params: 0,
   },{commandId:
  0x2b,
     title: "bgoff",
     params: 0,
   },{commandId:
  0x2d,
     title: "flagon",
     params: 1,
   },{commandId:
  0x2e,
     title: "flagoff",
     params: 1,
   },{commandId:
  0x30,
     title: "mojiopen",
   },{commandId:
  0x31,
     title: "mojiclose",
   },{commandId:
  44,
     title: "bgm",
     params: 1,
   },{commandId:
  0x32,
     title: "mojicloseall",
   },{commandId:
  0x33,
     title: "wakuopen",
   },{commandId:
  0x34,
     title: "finish",
   },{commandId:
  0x35,
     title: "mapchange",
     params: 3,
   },{commandId:
  0x36,
     title: "ifchar",
     params: 4,
   },{commandId:
  0x37,
     title: "strcolor",
     params: 2,
   },{commandId:
  0x39,
     title: "keywait",
     params: 1,
   },{commandId:
  0x3a,
     title: "strspeed",
   },{commandId:
  0x3b,
     title: "ifdeath",
     params: 3,
   },{commandId:
  0x3c,
     title: "ifflag",
     params: 3,
   },{commandId:
  0x3d,
     title: "title",
   },{commandId:
  0x3e,
     title: "getitem",
     params: 3,
   },{commandId:
  0x3f,
     title: "submoney",
   },{commandId:
  0x40,
     title: "penniless",
   },{commandId:
  0x45,
     title: "ifsex",
     params: 4,
   },{commandId:
  0x48,
     title: "addparamall",
   },{commandId:
  0x4e,
     title: "addlifeall100",
   },{commandId:
  0x4f,
     title: "se",
     params: 1,
   },{commandId:
  0x55,
     title: "charwarp",
     params: 2,
   },{commandId:
  0x56,
     title: "charmove",
   },{commandId:
  0x57,
     title: "flash",
   },{commandId:
  0x58,
     title: "mojiopenfade",
     params: 3,
   },{commandId:
  0x59,
     title: "mojiclosefade",
     params: 1,
   },{commandId:
  0x5d,
     title: "ifcharmap",
   },{commandId:
  0x62,
     title: "mapclean",
   },{commandId:
  0x64,
     title: "ifjob",
     params: 4,
   },{commandId:
  0x65,
     title: "fuzzy",
   },{commandId:
  102,
     title: "strsuper",
     params: 2,
   },{commandId:
  0x6b,
     title: "switchtype",
   },{commandId:
  0x6d,
     title: "ifentry",
   },{commandId:
  0x74,
     title: "super",
     params: 1,
   },{commandId:
  0x75,
     title: "feelingall",
   },{commandId:
  0x76,
     title: "addlifeenv",
   },{commandId:
  0x7a,
     title: "strname2",
     params: 3,
   },{commandId:
  0x7b,
     title: "remove",
   },{commandId:
  0x7f,
     title: "chengen",
     params: 1,
   },{commandId:
  0x80,
     title: "randwarp",
   },{commandId:
  0x81,
     title: "strmostlove",
     params: 2,
   },{commandId:
  0x82,
     title: "strwait",
     params: 2,
   },{commandId:
  0x83,
     title: "var_args",
     params: 2,
   },{commandId:
  132,
     title: "punishment",
     params: 1,
   },{commandId:
  0x86,
     title: "faceopenslow",
   },{commandId:
  0x87,
     title: "facecloseslow",
   },{commandId:
  0x8a,
     title: "ifvsr",
     params: 4,
   },{commandId:
  0x8b,
     title: "mojisound",
     params: 1,
   },{commandId:
  0x8c,
     title: "ifparam200over",
     params: 4,
   },{commandId:
  0x8e,
     title: "facecloseall",
     params: 0,
   },{commandId:
  0x8f,
     title: "ifclass",
   },{commandId:
  0x90,
     title: "ifgroup",
     params: 4,
   },{commandId:
  0x91,
     title: "selectex",
     params: 8,
   },{commandId:
  0x98,
     title: "whiteon",
   },{commandId:
  0x99,
     title: "whitefree",
   },{commandId:
  0x9c,
     title: "battle",
     params: 1,
   },{commandId:
  0x9d,
     title: "set_time",
     params: 4,
   },{commandId:
  0xa0,
     title: "shadepg",
     params: 3,
   },{commandId:
  0xa5,
     title: "charasibari",
     params: 2,
   },{commandId:
  0xa6,
     title: "idokinsi",
     params: 2,
   },{commandId:
 /* 0xab,
     title: "charset",
     params: 1,
   },{commandId:*/
  0xad,
     title: "feelingreset",
     params: 3,
   },{commandId:
  0xb1,
     title: "setlesson",
   },{commandId:
  0xb4,
     title: "trgturn",
     params: 1,
   },{commandId:
  0xb9,
     title: "ending",
   },{commandId:
  0xba,
     title: "se_ex",
   },{commandId:
  0xc0,
     title: "equiphpocket",
   },{commandId:
  0xc1,
     title: "setevmapexid",
     params: 7,
   },{commandId:
  0xc7,
     title: "lesson",
     params: 1,
   },{commandId:
  0xc8,
     title: "bgmstop",
     params: 0,
   },{commandId:
  0xcd,
     title: "endofturn",
     params: 0,
   },{commandId:
  0xcf,
     title: "gosub",
     params: 1,
   },{commandId:
  0xd0,
     title: "",
     params: 0,
   },{commandId:
  0xd1,
     title: "comeon",
     params: 2,
   },{commandId:
  0xd4,
     title: "pausew",
   },{commandId:
  214,
     title: "nawait",
     params: 0,
   },{commandId:
  215,
     title: "charpos",
     params: 5,
   },{commandId:
  0xdd,
     title: "pausew",
   },{commandId:

  0xde,
     title: "charwalk",
     params: 5,
   },{commandId:
  0xdf,
     title: "charwait",
     params: 1,
   },{commandId:
  0xe0,
     title: "charsync",
     params: 1,
   },{commandId:
  0xe1,
     title: "charrot",
     params: 2,
   },{commandId:
  0xe2,
     title: "charrun",
     params: 5,
   },{commandId:
  0xe3,
     title: "noresumes",
     params: 0,
   },{commandId:
  0xe4,
     title: "motion",
     params: 4,
   },{commandId:
  0xe5,
     title: "delete_se",
   },{commandId:
  0xe6,
     title: "get_sex_hndl",
   },{commandId:
  0xe7,
     title: "stop_se_ex",
   },{commandId:
  0xe8,
     title: "drawsync",
   },{commandId:
  0xe9,
     title: "reloadchar",
   },{commandId:
  0xea,
     title: "withwalkmai",
   },{commandId:
  0xeb,
     title: "charset",
     params: 1,
   },{commandId:
  0xec,
     title: "goto_char_class",
   },{commandId:
  0xed,
     title: "flameingofglamein",
   },{commandId:
  0xee,
     title: "fuzzy1st",
     params: 1,
   },{commandId:
  0xef,
     title: "setbus",
     params: 1,
   },{commandId:
  0xf0,
     title: "winname",
   },{commandId:
  0xf1,
     title: "ifgrade",
   },{commandId:
  0xf2,
     title: "deathstack",
   },{commandId:
  0xf3,
     title: "resetrelations",
   },{commandId:
  0xfd,
     title: "ifdate",
   },{commandId:
  0xfe,
     title: "startmap",
   },{commandId:
  0xff,
     title: "jingle",
     params: 0,
   },
  ];


export function cmd_to_string(cmd: number): CommandDefinition | null {
  const command = commands.find(c => c.commandId === cmd);

  if (!command) {
    return null;
  }

  return command;
}

export function string_to_cmd(title: string): CommandDefinition | null {
  for (const id in Object.entries(commands)) {
    const idNum = parseInt(id, 10);
    const command = commands[idNum];

    // We're breaking things by using an object as an array
    if (!command) continue;

    if (command.title === title) {
      return command;
    }
  }

  return null;
}
/*
const simpleConv = parsedEVData.evoffsets.entries[1062];
console.log(simpleConv.data.content);

const str = shiftjis.decode(simpleConv.data.content);
//console.log(str);

const data = simpleConv.data.content;
const VAR_PREFIX = 24;
*/

/*

const first_cmd = read_short(data, 4);

console.log(`First cmd,first_cmd}`)

let i = first_cmd;

do {
    i = take_cmd(data, i);
    console.log(i)
} while (i < data.length)*/
