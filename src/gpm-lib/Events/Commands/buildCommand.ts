import { UnknownCommand } from "./UnknownCommand";

export function buildCommand(offset: number, cmd: number, params: number[]) {
  switch (cmd) {
    default:
      return new UnknownCommand(offset, cmd, params);
  }
}
