import { FuurakiExecutable } from "./FuurakiExecutable";
import { IsoFile } from "./IsoReader";
import { MCDatFile } from "./MCDatFile";

export class FuurakiImage {
    public exe: FuurakiExecutable;
    public data: MCDatFile;

    constructor(private image: IsoFile) {
        if (image.header?.volumeId !== 'SLPS-03094') {
            throw new Error(`Unknown image name ${image.header?.volumeId}`);
        }

        this.exe = new FuurakiExecutable(image.getFile("/SLPS_030.94"));

        this.data = new MCDatFile(image.getFile("/MC.DAT"), this.exe);
    }
}