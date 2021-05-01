import { read_short } from "./helpers";

import { Evdatabin } from "./Evdatabin";
const shiftjis = require("shiftjis");
const KaitaiStream = require("kaitai-struct/KaitaiStream");

//const parsedEVData = new Evdatabin(new KaitaiStream(fileContent));

export function cmd_to_string(cmd: number): { title: string; params: number } {
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
    case 0x28:
      return {
        title: "thrust",
        params: 0,
      };
    case 0x2a:
      return {
        title: "bgon",
        params: 0,
      };
    case 0x2d:
      return {
        title: "flagon",
        params: 1,
      };
    case 44:
      return {
        title: "bgm",
        params: 1,
      };
    case 0x35:
      return {
        title: "mapchange",
        params: 3,
      };
    case 0x37:
      return {
        title: "strcolor",
        params: 2,
      };
    case 0x3e:
      return {
        title: "getitem",
        params: 3,
      };
    case 0x55:
      return {
        title: "charwarp",
        params: 2,
      };
    case 102:
      return {
        title: "strsuper",
        params: 2,
      };
    case 0x74:
      return {
        title: "super",
        params: 1,
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
    case 0x9c:
      return {
        title: "battle",
        params: 1,
      };
    case 0xa0:
      return {
        title: "shadepg",
        params: 3,
      };
    case 0xa6:
      return {
        title: "idokinsi",
        params: 2,
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
    case 0xcf:
      return {
        title: "gosub",
        params: 1,
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
    case 0xe4:
      return {
        title: "motion",
        params: 4,
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
    case 0xff:
      return {
        title: "jingle",
        params: 0,
      };
    default:
      return {
        title: "unknown",
        params: 0,
      };
      throw new Error(
        `Unknown code: ${cmd.toString()} = 0x${cmd.toString(16)}`
      );
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
function take_cmd(data: Uint8Array, idx: number) {
  //  const label = data[idx];
  const cmd = data[idx];

  idx++;

  const cmdData = cmd_to_string(cmd);

  let desc = `${idx} ${cmdData.title}`;

  for (let p = 0; p < cmdData.params; p++) {
    desc += ` ${read_short(data, idx)}`;

    idx += 2;
  }

  console.log(desc);

  return idx;
}
/*

const first_cmd = read_short(data, 4);

console.log(`First cmd: ${first_cmd}`)

let i = first_cmd;

do {
    i = take_cmd(data, i);
    console.log(i)
} while (i < data.length)*/
