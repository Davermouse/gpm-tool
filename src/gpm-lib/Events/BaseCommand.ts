import { ParamInfo, ParamType } from "./ParamInfo";

export abstract class BaseCommand {
  public offset: number;
  public abstract paramInfo: ParamInfo[];

  constructor(offset: number) {
    this.offset = offset;
  }
}
