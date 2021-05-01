export function read_short(data: Uint8Array, offset: number) {
    return data[offset] + data[offset + 1] * 0x100;
}
  
export function read_int(data: Uint8Array, offset: number) {
    return data[offset] + data[offset + 1] * 0x100 + data[offset + 2] * 0x10000 + data[offset + 3] * 0x1000000;
}
