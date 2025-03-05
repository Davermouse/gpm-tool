import { ParamInfo } from "./ParamInfo";

export abstract class BaseCommand {
  public label: number | null = null;
  public abstract paramInfo: ParamInfo[];

  constructor(public cmd: number, public params: number[]) {}

  public abstract serialize(): number[];
}
