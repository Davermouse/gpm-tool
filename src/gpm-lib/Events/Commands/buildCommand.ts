import { BaseCommand } from "../BaseCommand";
import { FaceOnCommand } from "./FaceOnCommand";
import { TalkCommand } from "./TalkCommand";
import { UnknownCommand } from "./UnknownCommand";

export function buildCommand(cmd: number, params: number[]): BaseCommand {
  switch (cmd) {
    case 15:
      return new TalkCommand(params);
    case 26:
      return new FaceOnCommand(params);
    default:
      return new UnknownCommand(cmd, params);
  }
}
