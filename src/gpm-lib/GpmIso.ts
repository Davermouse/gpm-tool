import { BinModule } from "./BinModule";
import { EvFile } from "./EvFile";
import { IsoFile } from "./IsoReader";

const MODULE_FILES = [
  "/OTHER/TITLEV.BIN;1",
  "/DATA/TEXTURE.BIN;1",
  "/DATA/AROUND.BIN;1",
  "/FACE/FACES.BIN;1",
  "/FACE/FACEM.BIN;1",
  "/DATA/STWINDOW.BIN;1",
  "/DATA/MAINT.BIN;1",
  "/FONT/FONTDATA.BIN;1",
  "/DATA/MMAP.BIN;1",
  "/DATA/GP_EFF.BIN;1",
  "/MAP/MAPDATA.BIN;1",
  "/DATA/MENU.BIN;1",
  "/DATA/MENU_DRI.BIN;1",
  "/DATA/MENU_JOB.BIN;1",
  "/DATA/MENU_TSR.BIN;1",
  "/DATA/CALENDAR.BIN;1",
  "/DATA/ETCETERA.BIN;1",
  "/DATA/FREEALL.BIN;1",
  "/DATA/FZDATAS.BIN;1",
  "/DATA/FZLIGHT.BIN;1",
  "/DATA/TIMEFONT.BIN;1",
];

class GPMFile {
  constructor(
    public name: string,
    public data: Uint8Array,
    public module: BinModule
  ) {}
}

export class GPMISO {
  public iso: IsoFile;
  public evData: EvFile;
  public files: GPMFile[] = [];

  constructor(data: Buffer) {
    this.iso = new IsoFile(data);

    if (this.iso.header?.volumeId !== "GUNPARADEMARCH") {
      throw new Error(
        `Unexpected volume title: '${this.iso.header?.volumeId}'`
      );
    }

    this.evData = new EvFile(this);

    for (let filename of MODULE_FILES) {
      const file = this.iso.getFile(filename);

      this.files.push(
        new GPMFile(filename, file, new BinModule(filename, file))
      );
    }
  }
}
