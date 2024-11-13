import { ParamInfo, ParamType } from "./ParamInfo";

export abstract class BaseCommand {
  public label: number | null = null;
  public abstract paramInfo: ParamInfo[];

  constructor(public offset: number, public cmd: number, public params: number[]) {}

  public abstract serialize(): number[];
}
