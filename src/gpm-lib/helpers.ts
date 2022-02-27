export function read_short(data: Uint8Array, offset: number) {
  return data[offset] + data[offset + 1] * 0x100;
}

export function serialize_short(value: number): number[] {
  if (value > 0xffff) {
    throw new Error("Attempt to serialize > 0xffff as short.");
  }

  return [value % 0x100, Math.floor(value / 0x100)];
}

export function write_short(value: number, array: number[]) {
  const serial = serialize_short(value);

  array.push(...serial);
}

export function overwrite_short(
  value: number,
  array: number[],
  offset: number
) {
  const s = serialize_short(value);

  array[offset] = s[0];
  array[offset + 1] = s[1];
}

export function read_int(data: Uint8Array, offset: number) {
  return (
    data[offset] +
    data[offset + 1] * 0x100 +
    data[offset + 2] * 0x10000 +
    data[offset + 3] * 0x1000000
  );
}
