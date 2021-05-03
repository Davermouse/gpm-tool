import { TalkCommand } from "./TalkCommand";
import { UnknownCommand } from "./UnknownCommand";

export function buildCommand(offset: number, cmd: number, params: number[]) {
  switch (cmd) {
    case 15:
      return new TalkCommand(offset, params);
    default:
      return new UnknownCommand(offset, cmd, params);
  }
}
