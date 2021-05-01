import { makeAutoObservable, runInAction } from "mobx";
import request from "superagent";
import { BinModule } from "../gpm-lib/BinModule";

import { EvFile } from "../gpm-lib/EvFile";

class GPMFile {
  public name: string;
  public data?: Uint8Array;
  public module?: BinModule;

  constructor(name: string) {
    makeAutoObservable(this);

    this.name = name;
  }
}

export class FileStore {
  public files: GPMFile[] = [];
  public evFile: EvFile | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  public async loadFile(filename: string) {
    if (this.files.find((f) => f.name === filename)) return;

    const file = new GPMFile(filename);

    this.files.push(file);

    const data = await request.get(filename).responseType("arraybuffer");

    runInAction(() => {
      file.data = new Uint8Array(data.xhr.response);

      if (filename.toUpperCase().indexOf("EVDATA") !== -1) {
        this.evFile = new EvFile(file.data);
      } else {
        file.module = new BinModule(filename, file.data);
      }
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
