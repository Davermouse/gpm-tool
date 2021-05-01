import { read_short, read_int } from "./helpers";
import { decompress_texture } from "./texture";

export class BinModule {
    public module_num: number = -1;
    public entries: number = -1;
  
    constructor(public name: string, public data: Uint8Array) {
      this.load();
    }
  
    load() {
      console.log(`Loading module: ${this.name}`)
  
      this.module_num = this.data[3];
      console.log(`Loading module id: ${this.module_num.toString(16)}`);
  
      this.entries = read_short(this.data, 0);
      console.log(`Module has ${this.entries} entries`)
    }
  
    findModule(id: number) {
      console.log(`Finding entry ID 0x${id.toString(16)}`)
      const module_id = id >>> 8;
  
      if (this.module_num !== module_id) {
        console.error('Unknown module');
      }
  
      /*  uVar2 = mod_num + (uint)(byte)plVar1->mod_num * -0x100 & 0xffff;
          if (uVar2 < *data_) {
              plVar1 = (list_entry_data *)((int)data_ + *(int *)(data_ + uVar2 * 2 + 2));
          }
      */
      const entry_id = id - this.module_num * 0x100 & 0xffff;

      if (entry_id < 0 || entry_id > this.module_num) return 0;
      
      console.log(`Entry ID: ${entry_id}`);
  
      const offset = read_int(this.data, entry_id * 4 + 4);
  
      console.log(`Offset: 0x${offset.toString(16)}`);
  
      return offset;
    }
  
    findTexture(id: number) {
      const data_offset = this.findModule(id);

      if (data_offset === 0) return null;
  
      const a = read_short(this.data, data_offset);
      const b = read_int(this.data, data_offset) >>> 0x10;
      const c = read_int(this.data, data_offset) >>> 0x1e;
  
    //  const mod_data = load_mod_data(a, b, c);
  
      const texture_offset = data_offset + 8;
      console.log(read_int(this.data, data_offset).toString(16));
      console.log(read_int(this.data, data_offset + 4).toString(16));
  
      const texture = decompress_texture(this.data, texture_offset);
  
      return texture;
    }
  }