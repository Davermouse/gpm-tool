import { BinModule } from "./BinModule";
import { EvFile } from "./EvFile";
import { ISO } from "./Iso";

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
  private iso: ISO;
  public evData: EvFile;
  public files: GPMFile[] = [];

  constructor(data: Buffer) {
    this.iso = new ISO(data);

    if (this.iso.volumeDesciptor.volumeIdentifier !== "GUNPARADEMARCH") {
      throw new Error(
        `Unexpected volume title: '${this.iso.volumeDesciptor.volumeIdentifier}'`
      );
    }

    const evDataEntry = this.iso.findEntry("/evdata.bin;1");

    this.evData = new EvFile(
      data.slice(
        evDataEntry.dataStart,
        evDataEntry.dataStart + evDataEntry.size
      )
    );

    for (let filename of MODULE_FILES) {
      const file = this.iso.findEntry(filename);
      const fileData = data.slice(file.dataStart, file.dataStart + file.size);

      this.files.push(
        new GPMFile(filename, fileData, new BinModule(filename, fileData))
      );
    }
  }
}
