import { read_short } from "./helpers";

const OFFSETS_START = 0x01c000;

export enum EvModuleType {
  Event = 0,
  Unknown_1 = 1,
  Texture = 2,
}

export class EvModule {
  public type: EvModuleType;
  public unk2: number;
  public start: number;
  public data: Uint8Array;

  constructor(public id: number, private rawData: Uint8Array) {
    this.type = read_short(rawData, 0);
    this.unk2 = read_short(rawData, 2);
    this.start = read_short(rawData, 4);
    this.data = rawData.slice(2);
  }

  get friendlyType() {
    switch (this.type) {
      case EvModuleType.Event:
        return "Event";
      case EvModuleType.Texture:
        return "Texture";
      default:
        return `Unknown type:${this.type}`;
    }
  }
}

export class EvFile {
  constructor(private data: Uint8Array) {}

  getModule(id: number) {
    const start = read_short(this.data, OFFSETS_START + 2 * (id + 1)) * 0x800;
    const end = read_short(this.data, OFFSETS_START + 2 * (id + 2)) * 0x800;

    if (start !== end) {
      return new EvModule(id, this.data.slice(start, end));
    }

    return null;
  }
}
