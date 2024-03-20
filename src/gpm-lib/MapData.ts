import { Texture } from "./BinModule";
import { Executable } from "./Executable";
import { GPMISO } from "./GpmIso";
import { read_int, read_short } from "./helpers";
import { decompress_texture, decompress_sized_texture } from "./texture";

const MAPDATA_FILE = "/map/MAPDATA.bin";

class MapSpritePrim {
  constructor(private data: Uint8Array) {

  }
}

class MapSpriteData {
  private num_prims: number;

  public sprites: MapSpritePrim[];

  constructor(private data: Uint8Array) {
    this.num_prims = read_short(data, 26);

    this.sprites = [];

    for (let i = 0 ; i < this.num_prims ; i++) {
      this.sprites.push(
        new MapSpritePrim(data.slice(
          36 + i * 36
        ))
      );
    }
  }
}

export class MapData {
  public map_tex: Texture;
  public map_clut : Uint8Array;
  public chunk3: MapSpriteData;
  public chunk4: Texture;
  public chunk5: Texture;

  constructor(private data: Uint8Array) {
    if (data.byteLength === 0) {
      throw Error("MapData must be provided with data");
    }

    const chunk1Offset = read_int(data, 4);

    console.debug(`Map chunk 1 offset: ${chunk1Offset}`);

    this.map_tex = {
      w: read_short(data, chunk1Offset), //508
      h: read_short(data, chunk1Offset + 2) & 0x3fff, //256
      data: new Uint8Array()
    };

    this.map_tex.data = decompress_sized_texture(
      this.map_tex.w,
      this.map_tex.h,
      data, chunk1Offset + 8
    );

    const chunk2Offset = read_int(data, 8);
    
    this.map_clut = data.slice(
      chunk2Offset + 4,
      chunk2Offset + 4 + 512
    );

    const chunk3Offset = read_int(data, 12);
    const chunk3Data = decompress_texture(data, chunk3Offset + 4);
    this.chunk3 = new MapSpriteData(chunk3Data.data);

    console.log(
      `Chunk 3 stored size: ${read_int(data, chunk3Offset)} actual size: ${
        chunk3Data.data.byteLength
      }`
    );
    console.log(`Chunk 3 has ${this.chunk3.sprites.length} sprites`)

    const chunk4Offset = read_int(data, 16);
    this.chunk4 = {
      w: 0,
      h: 0,
      data: decompress_texture(data, chunk4Offset + 4).data,
    };

    const chunk5Offset = read_int(data, 20);
    this.chunk5 = {
      w: 0,
      h: 0,
      data: decompress_texture(data, chunk5Offset + 4).data,
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
