import { BaseCommand } from "../BaseCommand";
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
}
