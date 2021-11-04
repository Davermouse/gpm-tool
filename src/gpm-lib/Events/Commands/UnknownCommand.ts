import { write_short } from "../../helpers";
import { BaseCommand } from "../BaseCommand";
import { COMMAND_START } from "../GPEvent";
import { ParamInfo, ParamType } from "../ParamInfo";

export class UnknownCommand extends BaseCommand {
  public cmd: number;
  public params: number[];
  public paramInfo: ParamInfo[];

  constructor(offset: number, cmd: number, params: number[]) {
    super(offset);

    this.cmd = cmd;
    this.params = params;

    this.paramInfo = params.map((_) => new ParamInfo(ParamType.Unknown));
  }

  public serialize(): number[] {
    const array = [COMMAND_START];
    array.push(this.cmd);

    for (const param of this.params) {
      write_short(param, array);
    }

    return array;
  }
}
