import { BaseCommand } from "../BaseCommand";
import { ParamInfo, ParamType } from "../ParamInfo";

export class TalkCommand extends BaseCommand {
  public paramInfo = [
    new ParamInfo(ParamType.Character),
    new ParamInfo(ParamType.Unknown),
  ];

  constructor(offset: number, public params: number[]) {
    super(offset);
  }

  public getTextureId() {
    return this.computeTextureId(this.params[0], this.params[1]);
  }

  private computeTextureId(charId: number, mood: number) {
    const dataCharId = this.charIdToDataCharId(charId);
    const wrappedMood = (mood - 1) & 0xff;

    return dataCharId * 0xd + wrappedMood + 0x4a0 - 1; // This -1 is manual and wrong :(
  }

  private charIdToDataCharId(charId: number) {
    if (charId === 0) return 0xff;
    return charId - 1;
  }
}
