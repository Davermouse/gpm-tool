import { read_short } from "../helpers";
import { BaseCommand } from "./BaseCommand";
import { cmd_param_lengths } from "./CmdParamLengths";
import { buildCommand } from "./Commands/buildCommand";
import { EvString } from "./EvString";

export class GPEvent {
  public commands: BaseCommand[] = [];
  public labels: { label: number; dest: number }[] = [];

  constructor(data: Uint8Array) {
    this.populateCommands(data);
  }

  private populateCommands(data: Uint8Array) {
    let num_labels = read_short(data, 0);

    let curr = num_labels - 2;

    if (num_labels % 2 === 1) {
      throw new Error("Unexpected labels length");
    }

    for (let labelIndex = 0; labelIndex < num_labels; labelIndex++) {
      const label = read_short(data, 2 + labelIndex * 4);
      const dest = read_short(data, 4 + labelIndex * 4);

      this.labels.push({
        label,
        dest,
      });

      // There is sometimes some data inbetween the labels and the start of the
      // commands, but I don't know what that does yet...
      if (label === 0xffff) break;
    }

    while (curr < data.length) {
      let cmd_offset = curr;

      if (data[curr] === 0x1b) {
        // This is a command)
        const cmd = data[curr + 1];
        const param_count = cmd_param_lengths[cmd];
        const params = new Array(param_count)
          .fill(0)
          .map((_, i) => read_short(data, curr + 2 + i * 2));

        this.commands.push(buildCommand(cmd_offset, cmd, params));

        curr += 2 + 2 * param_count;
      } else {
        const stringBytes = [];
        while (data[curr] !== 0) {
          stringBytes.push(data[curr++]);
        }

        this.commands.push(
          new EvString(cmd_offset, new Uint8Array(stringBytes))
        );
        curr++;
      }

      if (data[curr] === 0 && data[curr + 1] === 0) break;
    }
  }
}
