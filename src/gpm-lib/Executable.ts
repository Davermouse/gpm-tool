import { GPMISO } from "./GpmIso";
import { read_int } from "./helpers";

// Mapped to 80010010
const EXECUTABLE_FILE = "/SCPS_101.36;1"

// Memory address = 80014868
const MAP_DATA_OFFSET = 0x5080;
const MAP_DATA_LENGTH = 352 * 4;

export class Executable {
    private data: Uint8Array;

    constructor(private iso: GPMISO) {
      this.data = iso.iso.getFile(EXECUTABLE_FILE);
    }

    // For 8, 0, 0
    // 4bf000  = 4976640
    //  22000
    getMapData(mapId: number, mapSubPart: number, mapSubSubPart: number) {
        const mapIndex = (mapId * 5) + mapSubSubPart;

        if (mapSubPart != 0) {
            mapId += 3;
        }

        if (mapSubSubPart === 2 && mapSubPart !== 0) {
            mapId -= 1;
        }

        const offsetOffset = MAP_DATA_OFFSET + (mapIndex + 1 - 5) * 4 - 1 + 1;
        const offset = read_int(this.data, offsetOffset)        
        const size = read_int(this.data, offsetOffset + 4) - offset;

        return {
            offset,
            size
        };
    }
}