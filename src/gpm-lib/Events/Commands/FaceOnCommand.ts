import { serialize_short } from "../../helpers";
import { BaseCommand } from "../BaseCommand";
import { COMMAND_START } from "../GPEvent";
import { computeTextureId } from "../Helpers/CharacterHelpers";
import { ParamInfo, ParamType } from "../ParamInfo";

export class FaceOnCommand extends BaseCommand {
  public paramInfo = [
    new ParamInfo(ParamType.Character),
    new ParamInfo(ParamType.Unknown),
  ];

  constructor(offset: number, public params: number[]) {
    super(offset, 26, params);
  }

  public getTextureId() {
    return computeTextureId(this.params[0], this.params[1]);
  }

  public serialize(): number[] {
    const array = [COMMAND_START];
    array.push(26);
    array.push(...serialize_short(this.params[0]));
    array.push(...serialize_short(this.params[1]));

    return array;
  }
}
