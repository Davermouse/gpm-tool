import { Texture } from "./BinModule";
import { Executable } from "./Executable";
import { GPMISO } from "./GpmIso";
import { read_int, read_short } from "./helpers";
import { decompress_texture } from "./texture";

const MAPDATA_FILE = "/map/MAPDATA.bin;1";

export class MapData {
  public chunk1: Texture;
  public chunk2: Texture;
  public chunk3: Texture;
  public chunk4: Texture;
  public chunk5: Texture;

  constructor(private data: Uint8Array) {
    if (data.byteLength === 0) {
      throw Error("MapData must be provided with data");
    }

    const chunk1Offset = read_int(data, 4);

    console.debug(`Map chunk 1 offset: ${chunk1Offset}`);

    this.chunk1 = {
      w: read_short(data, chunk1Offset),
      h: read_short(data, chunk1Offset + 2),
      data: decompress_texture(data, chunk1Offset + 8),
    };

    const chunk2Offset = read_int(data, 8);
    const packedDims = 0x7800; // read_int(data, chunk2Offset);

    const chunk2Width = (packedDims & 0x3f) << 4;
    const chunk2Height = (packedDims & 0xffff) >> 6;
    this.chunk2 = {
      w: chunk2Width,
      h: chunk2Height,
      data: data.slice(
        chunk2Offset + 4,
        chunk2Offset + 4 + chunk2Width * chunk2Height
      ),
    };

    const chunk3Offset = read_int(data, 12);
    this.chunk3 = {
      w: 0,
      h: 0,
      data: decompress_texture(data, chunk3Offset + 4),
    };

    console.log(
      `Chunk 3 stored size: ${read_int(data, chunk3Offset)} actual size: ${
        this.chunk3.data.byteLength
      }`
    );

    const chunk4Offset = read_int(data, 16);
    this.chunk4 = {
      w: 0,
      h: 0,
      data: decompress_texture(data, chunk4Offset + 4),
    };

    const chunk5Offset = read_int(data, 20);
    this.chunk5 = {
      w: 0,
      h: 0,
      data: decompress_texture(data, chunk5Offset + 4),
    };
  }
}

export class MapDataFile {
  private data: Uint8Array;

  constructor(private iso: GPMISO, private executable: Executable) {
    this.data = iso.iso.getFile(MAPDATA_FILE);

    console.debug(`Loaded ${MAPDATA_FILE} with length ${this.data.byteLength}`);
  }

  loadMap(mapId: number, mapSubId: number, mapSubSubId: number): MapData {
    const offset = this.executable.getMapData(mapId, mapSubId, mapSubSubId);

    if (offset.offset + offset.size > this.data.byteLength) {
      throw new Error(
        `Attempt to load map with offset outside file ${offset.offset} ${offset.size}`
      );
    }

    const mapData = this.data.slice(offset.offset, offset.offset + offset.size);

    return new MapData(mapData);
  }
}
