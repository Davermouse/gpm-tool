import { makeAutoObservable, runInAction } from "mobx";
import { Buffer } from "buffer";
import request from "superagent";
import { BinModule, Texture } from "../gpm-lib/BinModule";

import { EvFile } from "../gpm-lib/EvFile";
import { GPMISO, OVERLAY_FILES } from "../gpm-lib/GpmIso";
import { IsoFile } from "../gpm-lib/IsoReader";
import { Executable } from "../gpm-lib/Executable";
import { MapDataFile } from "../gpm-lib/MapData";
import { FuurakiImage } from "../gpm-lib/FuurakiImage";
import { RefrainLoveImage, RLEventEngine, RLOperator } from "../gpm-lib/refrainlove/RefrainLoveImage";

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
  public moduleFiles: GPMFile[] = [];
  public overlayFiles: { [name:string]: Uint8Array } = {};
  public evFile: EvFile | null = null;
  public iso: IsoFile | null = null;

  public executable: Executable | null = null;
  public mapData: MapDataFile | null = null;

  public refrainLoveImage: RefrainLoveImage | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  public async loadIso(filename: string) {
    const data = await request.get(filename).responseType("arraybuffer");

    if (filename.toLowerCase().indexOf("iso") !== -1) {
      this.loadIsoData(data.xhr.response);
    } else if (filename.toLowerCase().indexOf("bin") !== -1) {
      this.loadBinData(data.xhr.response);
    }
  }

  public async loadIsoData(buffer: Buffer) {
    const iso = new GPMISO(Buffer.from(buffer));

    runInAction(() => {
      console.log("Setting evFile");

      this.evFile = iso.evData;
      this.moduleFiles = iso.moduleFiles.sort(
        (a, b) => a.module.module_num - b.module.module_num
      );
    });
  }

  public async loadBinData(buffer: Buffer) {
    const file = new IsoFile(Buffer.from(buffer));

    if (file.header?.volumeId === "GUNPARADEMARCH") {
      const iso = new GPMISO(Buffer.from(buffer));

      runInAction(() => {
        console.log("Setting evFile");
  
        this.iso = iso.iso;
        this.evFile = iso.evData;
        this.moduleFiles = iso.moduleFiles.sort(
          (a, b) => a.module.module_num - b.module.module_num
        );
  
        this.executable = new Executable(iso);
        this.mapData = new MapDataFile(iso, this.executable);

            //  this.overlayFiles["CODE"] = iso.iso.getFile()
        for (let overlayId in OVERLAY_FILES) {
          const file = iso.iso.getFile(OVERLAY_FILES[overlayId]);

          this.overlayFiles[overlayId] = file;
        }
      });
    } else if (file.header?.volumeId === 'SLPS-03094') {
      console.info("Loading Fuuraki")

      const image = new FuurakiImage(file);
    } else if (file.header?.header?.id === 'CD001') {
      console.info('Loading Refrain Love Disc 1');

      this.iso = file;
      this.refrainLoveImage = new RefrainLoveImage(file);
    } else {
      console.info(file.header?.volumeId)
    }
  }

  public publishIso(): string {
    if (this.iso) {
      const url = URL.createObjectURL(new Blob([this.iso.image]));
      return url;
    }

    return "";
  }

  public getModule(id: number): BinModule | undefined {
    return this.moduleFiles.find((f) => f.module && f.module.module_num === id)
      ?.module;
  }

  public findTexture(id: number): Texture | null {
    const moduleId = id >>> 8;

    const module = this.getModule(moduleId);

    if (!module) return null;

    return module.findTexture(id);
  }
}
