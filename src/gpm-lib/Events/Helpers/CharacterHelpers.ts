export function computeTextureId(charId: number, mood: number) {
  const dataCharId = charIdToDataCharId(charId);
  const wrappedMood = (mood - 1) & 0xff;

  return dataCharId * 0xd + wrappedMood + 0x4a0 - 1; // This -1 is manual and wrong :(
}

export function charIdToDataCharId(charId: number) {
  if (charId === 0) return 0xff;
  return charId - 1;
}
