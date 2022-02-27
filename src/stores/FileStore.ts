import { makeAutoObservable, runInAction } from "mobx";
import { Buffer } from "buffer";
import request from "superagent";
import { BinModule, Texture } from "../gpm-lib/BinModule";

import { EvFile } from "../gpm-lib/EvFile";
import { GPMISO } from "../gpm-lib/GpmIso";

class GPMFile {
  constructor(
    public name: string,
    public data: Uint8Array,
    public module: BinModule
  ) {
    makeAutoObservable(this);
  }
}

export class FileStore {
  public files: GPMFile[] = [];
  public evFile: EvFile | null = null;

  private rawIso: Buffer | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  public async loadIso(filename: string) {
    const data = await request.get(filename).responseType("arraybuffer");

    this.loadIsoData(data.xhr.response);
  }

  public async loadIsoData(buffer: Buffer) {
    this.rawIso = buffer;

    const iso = new GPMISO(Buffer.from(buffer));

    runInAction(() => {
      console.log("Setting evFile");

      this.evFile = iso.evData;
      this.files = iso.files.sort(
        (a, b) => a.module.module_num - b.module.module_num
      );
    });
  }

  public publishIso(): string {
    if (this.rawIso) {
      const url = URL.createObjectURL(new Blob([this.rawIso]));
      return url;
    }

    return "";
  }

  public getModule(id: number): BinModule | undefined {
    return this.files.find((f) => f.module && f.module.module_num === id)
      ?.module;
  }

  public findTexture(id: number): Texture | null {
    const moduleId = id >>> 8;

    const module = this.getModule(moduleId);

    if (!module) return null;

    return module.findTexture(id);
  }
}
