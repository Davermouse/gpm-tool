export enum ParamType {
  Unknown,
  Character,
  EvSlot,
  Label,
}

export class ParamInfo {
  public type: ParamType;

  constructor(type: ParamType) {
    this.type = type;
  }
}
