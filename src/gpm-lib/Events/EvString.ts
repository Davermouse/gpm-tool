import { BaseCommand } from "./BaseCommand";
import { ParamInfo } from "./ParamInfo";
const shiftjis = require("shiftjis");

// Mode \4 is single width
export class EvString extends BaseCommand {
  public text: string;
  public paramInfo: ParamInfo[] = [];

  constructor(offset: number, private data: Uint8Array) {
    super(offset);

    let t = "";
    for (let i = 0; i < data.length; i++) {
      let b = data[i];

      if (b < 10) {
        t += "\\" + b.toString();
      } else if (b < 0x75) {
        t += shiftjis.decode([b]);
      } else {
        t += shiftjis.decode([b, data[i + 1]]);

        i++;
      }
    }

    this.text = t;
  }

  public serialize(): number[] {
    const bytes: number[] = [];

    for (let i = 0; i < this.text.length; i++) {
      if (this.text[i] === "\\") {
        bytes.push(parseInt(this.text[i + 1]));

        i++;
      } else {
        bytes.push(...shiftjis.encode(this.text[i]));
      }
    }

    bytes.push(0);

    return bytes;
  }
}
