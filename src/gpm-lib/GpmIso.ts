import { BinModule } from "./BinModule";
import { EVFILE, EvFile } from "./EvFile";
import { IsoFile } from "./IsoReader";

export const MODULE_FILES = [
  //"/CTDATA/TIMEJOB.BIN",
  "/OTHER/GAMEOVER.BIN",
  "/OTHER/TITLEV.BIN",
  //"/OTHER/ICONDATA.BIN",
  "/OTHER/MAPPOS.BIN",
  "/OTHER/OPENING.BIN",
  "/OTHER/TURN.BIN",
  "/OTHER/TURNS.BIN",
  "/DATA/TEXTURE.BIN",
  "/DATA/AROUND.BIN",
  "/FACE/FACES.BIN",
  "/FACE/FACEM.BIN",
  "/FACE/DATACM.BIN",
  "/DATA/STWINDOW.BIN",
  "/DATA/MAINT.BIN",
  "/FONT/FONTDATA.BIN",
  "/DATA/MMAP.BIN",
  "/DATA/GP_EFF.BIN",
  "/MAP/MAPDATA.BIN",
  "/MAP/MAPNAME.BIN",
  //"/MAP/YA.BIN",
  "/DATA/HUN.BIN",
  "/DATA/MEETING.BIN",
  "/DATA/MENU.BIN",
  "/DATA/MENU_DRI.BIN",
  "/DATA/MENU_JOB.BIN",
  "/DATA/MENU_TSR.BIN",
  "/DATA/MEMCARD.BIN",
  "/DATA/CALENDAR.BIN",
  "/DATA/ETCETERA.BIN",
  "/DATA/FREEALL.BIN",
  "/DATA/FZDATAS.BIN",
  "/DATA/FZLIGHT.BIN",
  "/DATA/TIMEFONT.BIN",
  "/BATTLE/BTLSTAT.BIN",
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

    this.evData = new EvFile(this.iso.getFile(EVFILE));

    for (let filename of MODULE_FILES) {
      const file = this.iso.getFile(filename);

      this.files.push(
        new GPMFile(filename, file, new BinModule(filename, file))
      );
    }
  }
}
