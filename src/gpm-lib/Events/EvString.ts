import { BaseCommand } from "./BaseCommand";
import { ParamInfo } from "./ParamInfo";
const shiftjis = require("shiftjis");

export class EvString extends BaseCommand {
  public text: string;
  public paramInfo: ParamInfo[] = [];

  constructor(offset: number, data: Uint8Array) {
    super(offset);

    this.text = shiftjis.decode(data);
  }
}
