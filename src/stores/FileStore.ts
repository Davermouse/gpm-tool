import { makeAutoObservable, runInAction } from "mobx";
import request from "superagent";
import { BinModule } from "../gpm-lib/BinModule";

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

  constructor() {
    makeAutoObservable(this);
  }

  public async loadIso(filename: string) {
    const data = await request.get(filename).responseType("arraybuffer");

    const iso = new GPMISO(Buffer.from(data.xhr.response));

    runInAction(() => {
      console.log("Setting evFile");

      this.evFile = iso.evData;
      this.files = iso.files;
    });
  }

  public getModule(id: number): BinModule | undefined {
    return this.files.find((f) => f.module && f.module.module_num === id)
      ?.module;
  }

  public findTexture(id: number): Uint8Array | null {
    const moduleId = id >>> 8;

    const module = this.getModule(moduleId);

    if (!module) return null;

    return module.findTexture(id);
  }
}
