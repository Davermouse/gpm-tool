/*
console.log('Start texture parser');

const textureModule = new BinModule(TEXTURE_PATH);
const titlevModule = new BinModule(TITLEV_PATH);

//ppVar3 = draw_picture(0xa00d,0xa003,0x78,0xb0,10);
//titlevModule.findTexture(0xa00d * 0xffff + 0xa003);

const fileContent = fs.readFileSync(TEXTURE_PATH);

// First module load in program:
// 0x140,0x100,2

//const tex1 = textureModule.findTexture(0x900);

//find_texture(0x901);

// titleev offset b24
// ppVar3 = draw_picture(0xa00a,0xa000,0x60,0xd0,10);
// find_or_load_picture_entry(0xa00a, 0xa000)
// insert_picture_load_texture(0xa00a, 0xa000))
// find_entry_by_mod_num(0xa00a)
// find_list_entry_unk(0xa0)
// rect = get_obj_data(0x30, 0x40, 0x1, 0xa00a)
//  rect = (0x300, 0x100, 0xe0, 0x40)
// load_texture_data
//  data_to_load = 0x7000

// do_faceload(0x18, 0)
//    fixed_modnum = 0x18
//    evfileid = 0x538
*/

import { read_short } from "./helpers";

// first faceload(intro)
// do_faceload(modnum = 4. p2 = 4)

// First in game faceload:
// do_faceload(0x18, 0)
// fixed_modnum = 0x18
// type = 0
// face_pack_index = 0
// file_id = 0x5d8
// size = 0x3800
// load_texture_from_entry_with_found_rect(0xe801)
// Loaded offset: 0x5fd000
// Actual offset in data file: 0x5fd218

// Second in game faceload:
// list_entry_from_ev_data(0x4d4)
//   data_size=0x4000

/* (0x200,0x100,1,0x10eb) */

function load_mod_data(a: number, b: number, c: number) {
  const c_offsets = [0x40, 0x80, 0x100, 0x7fff];

  if (a === 0 || c === 0) {
    throw new Error();
  }

  if (c === 1) {
    if (a > 0x80) {
      c = 2;
    }

    if (a > 0x100 || b > 0x100) {
      c = 3;
    }
  } else if (c === 0) {
    if (a > 0x40) {
      c = 1;
    }

    if (a > 0x80) {
      c = 2;
    }

    if (a > 0x100 || b > 0x100) {
      c = 3;
    }
  } else if (c === 2) {
    if (a > 0x100 || b > 0x100) {
      c = 3;
    }
  }

  const c_val = c_offsets[3];

  let x = 0;

  while (true) {
    let y = 0x140;
    let v6 = a + 0x140;

    if (x + b > 0x200) break;
  }
}
/*
  short * do_load_mod_data(int a,int b,int c)

{
short sVar1;
short *psVar2;
int iVar3;
mod_load_struct *data;
undefined2 *puVar4;
short *psVar5;
int b_;
int iVar6;
undefined2 *puVar7;
uint y;
uint x;
int iVar8;
int iVar9;
uint x_00;
uint local_2c;
 
x_00 = 0;
local_2c = 0;
if ((a == 0) || (b == 0)) goto error;
if (c == 1) {
LAB_80018300:
  if (0x80 < a) {
    c = 2;
  }
LAB_8001830c:
  if ((0x100 < a) || (0x100 < b)) goto LAB_80018320;
}
else {
  if (c < 2) {
    if (c == 0) {
      if (0x40 < a) {
        c = 1;
      }
      goto LAB_80018300;
    }
  }
  else {
    if (c == 2) goto LAB_8001830c;
  }
LAB_80018320:
  c = 3;
}
iVar8 = c_refs[c];
x = 0;
iVar9 = iVar8;
iVar3 = DAT_800fcdcc;
while( true ) {
  y = 0x140;
  iVar6 = a + 0x140;
  if (0x200 < (int)(x + b)) break;
  if (iVar3 == 0) {
    if ((iVar6 < 0x401) && (iVar3 = FUN_80018090(0x140,x,a,b), iVar3 < iVar9)) {
      local_2c = 0x140;
      iVar9 = iVar3;
      x_00 = x;
    }
    break;
  }
  puVar7 = &refs_list_root;
  DAT_800fcdd0 = (short *)0x0;
  puVar4 = DAT_800fcdc8;
  while (psVar2 = DAT_800fcdd0, puVar4 != (undefined2 *)0x0) {
    if (((int)(short)puVar4[1] < (int)(x + b)) &&
       ((int)x < (int)(short)puVar4[1] + (int)(short)puVar4[3])) {
      *(undefined2 **)(puVar7 + 8) = puVar4;
      *(undefined4 *)(puVar4 + 8) = 0;
      puVar7 = puVar4;
    }
    puVar4 = *(undefined2 **)(puVar4 + 4);
  }
  while (psVar2 != (short *)0x0) {
    sVar1 = *psVar2;
    psVar5 = psVar2;
    while (iVar6 <= sVar1) {
      psVar5 = *(short **)(psVar5 + 8);
      if (psVar5 == (short *)0x0) {
        iVar6 = FUN_80018090(y,x,a,b);
        if (iVar6 < iVar9) {
          iVar9 = iVar6;
          x_00 = x;
          local_2c = y;
        }
        break;
      }
      sVar1 = *psVar5;
    }
    y = (int)*psVar2 + (int)psVar2[2];
    if ((iVar8 < (int)((y & 0x3f) + a)) || (_DAT_00003bfc != 0)) {
      y = (y & 0xffffffc0) + 0x40;
    }
    iVar6 = y + a;
    psVar2 = *(short **)(psVar2 + 8);
  }
  if ((iVar6 < 0x401) && (iVar6 = FUN_80018090(y,x,a,b), iVar6 < iVar9)) {
    iVar9 = iVar6;
    x_00 = x;
    local_2c = y;
  }
  x = (int)*(short *)(iVar3 + 2) + (int)*(short *)(iVar3 + 6);
  if ((c < 3) && ((0x100 < (int)((x & 0xff) + b) || (_DAT_00003bfc != 0)))) {
    x = (x - 1 & 0xff00) + 0x100;
  }
  iVar3 = *(int *)(iVar3 + 0xc);
}
if (iVar9 < 0x20) {
  data = FUN_800180ec(local_2c,x_00,a,b);
  return (short *)data;
}
error:
error_occurred((char *)0x2);
return (short *)(mod_load_struct *)0x0;
}*/

export function decompress_texture(buffer: Uint8Array, offset: number) {
  const output = [];

  var _place_in_texture_data = 0;
  var cond_temp_uint_2;
  let int_1;
  let uint_1;
  let bytes_written = 0;
  let uint_2 = 0;
  let int_3 = 0;
  let byte_1;
  let cond_temp;
  let look_ahead_byte_pointer;

  while (true) {
    while (true) {
      while (true) {
        while (true) {
          cond_temp = int_3 === 0;
          int_3 = int_3 + -1;
          if (cond_temp) {
            uint_2 = buffer[offset + _place_in_texture_data];
            _place_in_texture_data = _place_in_texture_data + 1;
            int_3 = 7;
          }
          cond_temp_uint_2 = uint_2 & 1;
          uint_2 = uint_2 >>> 1;
          if (cond_temp_uint_2 === 0) break;
          bytes_written = bytes_written + 1;
          byte_1 = buffer[offset + _place_in_texture_data];
          _place_in_texture_data = _place_in_texture_data + 1;
          output.push(byte_1);
        }
        cond_temp = int_3 === 0;
        int_3 = int_3 + -1;
        if (cond_temp) {
          uint_2 = buffer[offset + _place_in_texture_data];
          _place_in_texture_data = _place_in_texture_data + 1;
          int_3 = 7;
        }
        cond_temp_uint_2 = uint_2 & 1;
        uint_2 = uint_2 >>> 1;
        if (cond_temp_uint_2 === 0) break;
        byte_1 = buffer[offset + _place_in_texture_data];
        _place_in_texture_data = _place_in_texture_data + 1;
        int_1 = (byte_1 >> 6) + 2;
        look_ahead_byte_pointer =
          (bytes_written + (byte_1 | 0xffffffc0)) % 0xffffffff;
        while (int_1 !== 0) {
          byte_1 = output[look_ahead_byte_pointer];
          look_ahead_byte_pointer = look_ahead_byte_pointer + 1;
          bytes_written = bytes_written + 1;
          int_1 = int_1 + -1;
          output.push(byte_1);
        }
      }
      cond_temp_uint_2 = buffer[offset + _place_in_texture_data] >>> 4;
      uint_1 =
        (((buffer[offset + _place_in_texture_data + 1] +
          buffer[offset + _place_in_texture_data] * 0x100) |
          0xfffff000) >>>
          0) %
          0xffffffff >>>
        0;
      if (cond_temp_uint_2 === 0) break;
      int_1 = cond_temp_uint_2 + 2;
      look_ahead_byte_pointer = (bytes_written + uint_1 - 1) % 0xffffffff;
      _place_in_texture_data = _place_in_texture_data + 2;
      while (int_1 !== 0) {
        byte_1 = output[look_ahead_byte_pointer];
        look_ahead_byte_pointer = (look_ahead_byte_pointer + 1) % 0xffffffff;
        bytes_written = bytes_written + 1;
        int_1 = int_1 + -1;
        output.push(byte_1);
      }
    }
    look_ahead_byte_pointer = _place_in_texture_data + 2;
    _place_in_texture_data = _place_in_texture_data + 3;
    int_1 = (buffer[offset + look_ahead_byte_pointer] || 0) + 2;
    if (buffer[offset + look_ahead_byte_pointer] === 0) break;
    look_ahead_byte_pointer = (bytes_written + uint_1 - 1) % 0xffffffff;
    while (int_1 !== 0) {
      byte_1 = output[look_ahead_byte_pointer] || 0;
      look_ahead_byte_pointer = look_ahead_byte_pointer + 1;
      bytes_written = bytes_written + 1;
      int_1 = int_1 + -1;
      output.push(byte_1);
    }
  }

  return {
    bytes_read: _place_in_texture_data,
    data: new Uint8Array(output),
  };
}

export function compress_texture(data: Uint8Array): Uint8Array {
  // Output buffer and position tracker
  const output: number[] = [];
  let output_pos = 0;
  
  // Bitstream management
  let control_byte = 0;
  let control_bit_count = 0;
  let control_byte_pos = 0;
  
  // Function to write a control bit
  function writeControlBit(bit: number) {
    control_byte |= (bit << control_bit_count);
    control_bit_count++;
    
    if (control_bit_count === 8) {
      // Write the completed control byte
      output[control_byte_pos] = control_byte;
      
      // Reset for next control byte
      control_byte = 0;
      control_bit_count = 0;
      control_byte_pos = output_pos++;
      output.push(0); // Reserve space for next control byte
    }
  }
  
  // Function to flush any remaining control bits
  function flushControlBits() {
    if (control_bit_count > 0) {
      output[control_byte_pos] = control_byte;
    }
  }
  
  // LZ77 sliding window - find the longest match in previous data
  function findLongestMatch(pos: number, max_length: number = 258, max_offset: number = 4096): { length: number, offset: number } | null {
    if (pos === 0) return null;
    
    const max_search_pos = Math.max(0, pos - max_offset);
    const search_bytes = Math.min(max_length, data.length - pos);
    
    if (search_bytes < 3) return null; // Minimum match length for efficiency
    
    let best_length = 0;
    let best_offset = 0;
    
    // Search for matches
    for (let i = pos - 1; i >= max_search_pos; i--) {
      let match_length = 0;
      
      while (match_length < search_bytes && 
             data[i + match_length] === data[pos + match_length]) {
        match_length++;
      }
      
      if (match_length > best_length) {
        best_length = match_length;
        best_offset = pos - i;
        
        // Early exit if we found a "perfect" match
        if (best_length === search_bytes) break;
      }
    }
    
    // Only return matches that are worth encoding (at least 3 bytes)
    if (best_length >= 3) {
      return {
        length: best_length,
        offset: best_offset
      };
    }
    
    return null;
  }
  
  // Reserve the first position for a control byte
  control_byte_pos = output_pos++;
  output.push(0);
  
  let pos = 0;
  
  while (pos < data.length) {
    // Try to find a match
    const match = findLongestMatch(pos);
    
    if (match === null) {
      // No match, output literal byte
      writeControlBit(1); // Signal a literal byte
      output.push(data[pos]);
      output_pos++;
      pos++;
    } else {
      // We found a match, encode it based on length
      if (match.length <= 9 && match.offset <= 63) {
        // Short match encoding
        writeControlBit(1); // First control bit
        writeControlBit(0); // Second control bit pattern for match
        
        // Encode offset and length in a single byte
        // Top 6 bits are low 6 bits of offset, bottom 2 bits are (length-2)
        const encoded_byte = ((match.offset & 0x3F) << 2) | ((match.length - 2) & 0x3);
        output.push(encoded_byte);
        output_pos++;
        
      } else if (match.length <= 17) {
        // Medium match encoding
        writeControlBit(0);
        
        // Encode length in top 4 bits of first byte
        const first_byte = (match.length - 2) << 4;
        
        // Encode offset in remaining 12 bits (across 2 bytes)
        const second_byte = match.offset & 0xFF;
        output.push(first_byte | ((match.offset >> 8) & 0x0F));
        output.push(second_byte);
        output_pos += 2;
        
      } else {
        // Long match encoding
        writeControlBit(0);
        
        // Signal a long match with 0 in the top 4 bits
        output.push(0);
        output.push(match.offset & 0xFF);
        output.push((match.offset >> 8) & 0xFF);
        
        // Encode length-2 in the next byte
        output.push(match.length - 2);
        output_pos += 4;
      }
      
      // Skip the matched bytes
      pos += match.length;
    }
  }
  
  // Signal end of data with a special pattern
  writeControlBit(0);
  output.push(0);
  output.push(0);
  output.push(0);
  output_pos += 3;
  
  // Flush any remaining control bits
  flushControlBits();
  
  return new Uint8Array(output);
}

export function decompress_sized_texture(w: number, h: number, buffer: Uint8Array, offset: number): Uint8Array {
  const data_to_load = w * h * 2;
  const output = new Uint8Array(data_to_load);
  let data_loaded = 0;

  while (data_loaded < data_to_load) {
    const decompressed = decompress_texture(buffer, offset);

    output.set(decompressed.data, data_loaded);
    offset += decompressed.bytes_read;

    data_loaded += decompressed.data.length;
  }

  return output;
}

export function coloredClutFromRaw(data: Uint8Array): Uint16Array {
  if (data.length !== 512) throw new Error("Unexpected data length");

  const output = [];

  for (let i = 0; i < 256; i++) {
    output.push(read_short(data, i * 2));
  }

  return new Uint16Array(output);
}