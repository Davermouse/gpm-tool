import { read_short } from "./helpers";

import { Evdatabin } from "./Evdatabin";
const shiftjis = require("shiftjis");
//const KaitaiStream = require("kaitai-struct/KaitaiStream");

//const parsedEVData = new Evdatabin(new KaitaiStream(fileContent));

export function cmd_to_string(cmd: number): { title: string; params?: number } {
  switch (cmd) {
    case 0:
      return {
        title: "null",
        params: 0,
      };
    case 1:
      return {
        title: "exit",
        params: 1,
      };
    case 2:
      return {
        title: "goto",
        params: 1,
      };
    case 3:
      return {
        title: "wait",
        params: 1,
      };
    case 4:
      return {
        title: "winopen",
        params: 1,
      };
    case 0x05:
      return {
        title: "winclose",
        params: 0,
      };
    case 0x06:
      return {
        title: "pause",
        params: 0,
      };
    case 0x07:
      return {
        title: "faceload",
      };
    case 0x0a:
      return {
        title: "facefree",
      };
    case 0x0d:
      return {
        title: "pgclose",
        params: 2,
      };
    case 0x0f:
      return {
        title: "talk",
        params: 2,
      };
    case 16:
      return {
        title: "voice",
        params: 1,
      };
    case 0x11:
      return {
        title: "addtime",
        params: 1,
      };
    case 0x12:
      return {
        title: "add_friend",
        params: 3,
      };
    case 0x13:
      return {
        title: "add_love",
        params: 3,
      };
    case 0x14:
      return {
        title: "pgon",
        params: 2,
      };
    case 0x15:
      return {
        title: "pgoff",
        params: 2,
      };
    case 0x16:
      return {
        title: "talk_end",
        params: 0,
      };
    case 23:
      return {
        title: "select",
        params: 4,
      };
    case 0x18:
      return {
        title: "stance",
        params: 3,
      };
    case 0x19:
      return {
        title: "feeling",
        params: 3,
      };
    case 26:
      return {
        title: "faceon",
        params: 2,
      };
    case 27:
      return {
        title: "faceoff",
        params: 2,
      };
    case 0x1c:
      return {
        title: "scenset",
      };
    case 0x1e:
      return {
        title: "rise",
        params: 0,
      };
    case 0x1f:
      return {
        title: "charfree",
        params: 1,
      };
    case 0x20:
      return {
        title: "charon",
        params: 4,
      };
    case 0x22:
      return {
        title: "fadein",
        params: 0,
      };
    case 0x23:
      return {
        title: "fadeout",
        params: 0,
      };
    case 0x26:
      return {
        title: "add_param",
      };
    case 0x27:
      return {
        title: "status",
      };
    case 0x28:
      return {
        title: "thrust",
        params: 0,
      };
    case 0x29:
      return {
        title: "strname",
      };
    case 0x2a:
      return {
        title: "bgon",
        params: 0,
      };
    case 0x2b:
      return {
        title: "bgoff",
        params: 0,
      };
    case 0x2d:
      return {
        title: "flagon",
        params: 1,
      };
    case 0x2e:
      return {
        title: "flagoff",
        params: 1,
      };
    case 0x30:
      return {
        title: "mojiopen",
      };
    case 0x31:
      return {
        title: "mojiclose",
      };
    case 44:
      return {
        title: "bgm",
        params: 1,
      };
    case 0x32:
      return {
        title: "mojicloseall",
      };
    case 0x33:
      return {
        title: "wakuopen",
      };
    case 0x34:
      return {
        title: "finish",
      };
    case 0x35:
      return {
        title: "mapchange",
        params: 3,
      };
    case 0x36:
      return {
        title: "ifchar",
        params: 4,
      };
    case 0x37:
      return {
        title: "strcolor",
        params: 2,
      };
    case 0x39:
      return {
        title: "keywait",
        params: 1,
      };
    case 0x3a:
      return {
        title: "strspeed",
      };
    case 0x3b:
      return {
        title: "ifdeath",
        params: 3,
      };
    case 0x3c:
      return {
        title: "ifflag",
        params: 3,
      };
    case 0x3d:
      return {
        title: "title",
      };
    case 0x3e:
      return {
        title: "getitem",
        params: 3,
      };
    case 0x3f:
      return {
        title: "submoney",
      };
    case 0x40:
      return {
        title: "penniless",
      };
    case 0x45:
      return {
        title: "ifsex",
        params: 4,
      };
    case 0x48:
      return {
        title: "addparamall",
      };
    case 0x4e:
      return {
        title: "addlifeall100",
      };
    case 0x4f:
      return {
        title: "se",
        params: 1,
      };
    case 0x55:
      return {
        title: "charwarp",
        params: 2,
      };
    case 0x56:
      return {
        title: "charmove",
      };
    case 0x57:
      return {
        title: "flash",
      };
    case 0x58:
      return {
        title: "mojiopenfade",
        params: 3,
      };
    case 0x59:
      return {
        title: "mojiclosefade",
        params: 1,
      };
    case 0x5d:
      return {
        title: "ifcharmap",
      };
    case 0x62:
      return {
        title: "mapclean",
      };
    case 0x64:
      return {
        title: "ifjob",
        params: 4,
      };
    case 0x65:
      return {
        title: "fuzzy",
      };
    case 102:
      return {
        title: "strsuper",
        params: 2,
      };
    case 0x6b:
      return {
        title: "switchtype",
      };
    case 0x6d:
      return {
        title: "ifentry",
      };
    case 0x74:
      return {
        title: "super",
        params: 1,
      };
    case 0x75:
      return {
        title: "feelingall",
      };
    case 0x76:
      return {
        title: "addlifeenv",
      };
    case 0x7a:
      return {
        title: "strname2",
        params: 3,
      };
    case 0x7b:
      return {
        title: "remove",
      };
    case 0x7f:
      return {
        title: "chengen",
        params: 1,
      };
    case 0x80:
      return {
        title: "randwarp",
      };
    case 0x81:
      return {
        title: "strmostlove",
        params: 2,
      };
    case 0x82:
      return {
        title: "strwait",
        params: 2,
      };
    case 0x83:
      return {
        title: "var_args",
        params: 2,
      };
    case 132:
      return {
        title: "punishment",
        params: 1,
      };
    case 0x86:
      return {
        title: "faceopenslow",
      };
    case 0x87:
      return {
        title: "facecloseslow",
      };
    case 0x8a:
      return {
        title: "ifvsr",
        params: 4,
      };
    case 0x8b:
      return {
        title: "mojisound",
        params: 1,
      };
    case 0x8c:
      return {
        title: "ifparam200over",
        params: 4,
      };
    case 0x8e:
      return {
        title: "facecloseall",
        params: 0,
      };
    case 0x8f:
      return {
        title: "ifclass",
      };
    case 0x90:
      return {
        title: "ifgroup",
        params: 4,
      };
    case 0x91:
      return {
        title: "selectex",
        params: 8,
      };
    case 0x98:
      return {
        title: "whiteon",
      };
    case 0x99:
      return {
        title: "whitefree",
      };
    case 0x9c:
      return {
        title: "battle",
        params: 1,
      };
    case 0x9d:
      return {
        title: "set_time",
        params: 4,
      };
    case 0xa0:
      return {
        title: "shadepg",
        params: 3,
      };
    case 0xa5:
      return {
        title: "charasibari",
        params: 2,
      };
    case 0xa6:
      return {
        title: "idokinsi",
        params: 2,
      };
    /*case 0xab:
      return {
        title: "charset",
        params: 1,
      };*/
    case 0xad:
      return {
        title: "feelingreset",
        params: 3,
      };
    case 0xb1:
      return {
        title: "setlesson",
      };
    case 0xb4:
      return {
        title: "trgturn",
        params: 1,
      };
    case 0xb9:
      return {
        title: "ending",
      };
    case 0xba:
      return {
        title: "se_ex",
      };
    case 0xc0:
      return {
        title: "equiphpocket",
      };
    case 0xc1:
      return {
        title: "setevmapexid",
        params: 7,
      };
    case 0xc7:
      return {
        title: "lesson",
        params: 1,
      };
    case 0xc8:
      return {
        title: "bgmstop",
        params: 0,
      };
    case 0xcd:
      return {
        title: "endofturn",
        params: 0,
      };
    case 0xcf:
      return {
        title: "gosub",
        params: 1,
      };
    case 0xd0:
      return {
        title: "return",
        params: 0,
      };
    case 0xd1:
      return {
        title: "comeon",
        params: 2,
      };
    case 0xd4:
      return {
        title: "pausew",
      };
    case 214:
      return {
        title: "nawait",
        params: 0,
      };
    case 215:
      return {
        title: "charpos",
        params: 5,
      };
    case 0xdd:
      return {
        title: "pausew",
      };

    case 0xde:
      return {
        title: "charwalk",
        params: 5,
      };
    case 0xdf:
      return {
        title: "charwait",
        params: 1,
      };
    case 0xe0:
      return {
        title: "charsync",
        params: 1,
      };
    case 0xe1:
      return {
        title: "charrot",
        params: 2,
      };
    case 0xe2:
      return {
        title: "charrun",
        params: 5,
      };
    case 0xe3:
      return {
        title: "noresumes",
        params: 0,
      };
    case 0xe4:
      return {
        title: "motion",
        params: 4,
      };
    case 0xe5:
      return {
        title: "delete_se",
      };
    case 0xe6:
      return {
        title: "get_sex_hndl",
      };
    case 0xe7:
      return {
        title: "stop_se_ex",
      };
    case 0xe8:
      return {
        title: "drawsync",
      };
    case 0xe9:
      return {
        title: "reloadchar",
      };
    case 0xea:
      return {
        title: "withwalkmai",
      };
    case 0xeb:
      return {
        title: "charset",
        params: 1,
      };
    case 0xec:
      return {
        title: "goto_char_class",
      };
    case 0xed:
      return {
        title: "flameingofglamein",
      };
    case 0xee:
      return {
        title: "fuzzy1st",
        params: 1,
      };
    case 0xef:
      return {
        title: "setbus",
        params: 1,
      };
    case 0xf0:
      return {
        title: "winname",
      };
    case 0xf1:
      return {
        title: "ifgrade",
      };
    case 0xf2:
      return {
        title: "deathstack",
      };
    case 0xf3:
      return {
        title: "resetrelations",
      };
    case 0xfd:
      return {
        title: "ifdate",
      };
    case 0xfe:
      return {
        title: "startmap",
      };
    case 0xff:
      return {
        title: "jingle",
        params: 0,
      };
    default:
      return {
        title: `unknown (${cmd.toString(16)} - ${cmd})`,
        params: 0,
      };
  }
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

console.log(`First cmd: ${first_cmd}`)

let i = first_cmd;

do {
    i = take_cmd(data, i);
    console.log(i)
} while (i < data.length)*/
