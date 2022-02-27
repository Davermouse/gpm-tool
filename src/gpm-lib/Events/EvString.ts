import { BaseCommand } from "./BaseCommand";
import { ParamInfo } from "./ParamInfo";
const shiftjis = require("shiftjis");

const charsToEmoji: { b: number; e: string }[] = [
  { b: 0, e: "0️⃣" },
  { b: 1, e: "1️⃣" },
  { b: 2, e: "2️⃣" },
  { b: 3, e: "3️⃣" },
];

export class EvString extends BaseCommand {
  public text: string;
  public paramInfo: ParamInfo[] = [];

  constructor(offset: number, private data: Uint8Array) {
    super(offset);

    let t = "";
    for (let i = 0; i < data.length; i++) {
      let b = data[i];

      let ce = charsToEmoji.find((c) => c.b === b);

      if (ce) {
        t += ce.e;
      }

      if (b < 0x75) {
        t += shiftjis.decode([b]);
      } else {
        t += shiftjis.decode([b, data[i + 1]]);

        i++;
      }
    }

    this.text = t;
  }

  public serialize(): number[] {
    const chars = [...this.text];
    const bytes: number[] = [];

    for (let t of chars) {
      let e = charsToEmoji.find((c) => c.e === t);

      if (e) {
        bytes.push(e.b);
      } else {
        bytes.push(...shiftjis.encode(t));
      }
    }

    bytes.push(0);

    return bytes;
  }
}
