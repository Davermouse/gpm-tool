import { ContactsOutlined } from "@material-ui/icons";
import { read_short, write_short } from "../helpers";
import { BaseCommand } from "./BaseCommand";
import { cmd_param_lengths } from "./CmdParamLengths";
import { buildCommand } from "./Commands/buildCommand";
import { EvString } from "./EvString";

export const COMMAND_START = 0x1b;

export class GPEvent {
  public commands: BaseCommand[] = [];
  public labels: { label: number; dest: number }[] = [];
  public post_label_data: number[] = [];

  constructor(private data: Uint8Array) {
    this.populateCommands(data);
  }

  public serialize(): Uint8Array {
    const data: number[] = [];

    write_short(this.labels.length, data);

    for (const label of this.labels) {
      write_short(label.label, data);
      write_short(label.dest, data);
    }

    write_short(0xffff, data);

    for (const cmd of this.commands) {
      const cmdData = cmd.serialize();

      for (const b of cmdData) data.push(...cmd.serialize());
    }

    for (let i = 0; i < data.length; i++) {
      if (this.data[i] !== data[i]) {
        console.log(`Does not match at ${i}: ${this.data[i]} !== ${data[i]}`);

        console.dir(this.data);
        console.dir(data);
        break;
      }
    }

    return new Uint8Array(data);
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

      if (data[curr] === COMMAND_START) {
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
