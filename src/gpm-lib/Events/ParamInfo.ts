export enum ParamType {
  Unknown,
  Character,
  EvSlot,
}

export class ParamInfo {
  public type: ParamType;

  constructor(type: ParamType) {
    this.type = type;
  }
}
