import { makeAutoObservable, makeObservable, observable } from "mobx";
import { cmd_to_string, string_to_cmd } from "../evdata";
import { overwrite_short, read_short, write_short } from "../helpers";
import { BaseCommand } from "./BaseCommand";
import { cmd_param_lengths } from "./CmdParamLengths";
import { buildCommand } from "./Commands/buildCommand";
import { EvString } from "./EvString";

export const COMMAND_START = 0x1b;

export class GPEvent {
  public commands: BaseCommand[] = [];
  public labels: { label: number; dest: number }[] = [];
  public post_label_data: number[] = [];

  constructor(data: Uint8Array) {
    makeObservable(this,
      {
        commands: observable,
        labels: observable,
      }
    );

    this.populateCommands(data);
  }

  public export(): string {
    const lines: string[] = [];

    for (const command of this.commands) {
      if (command instanceof EvString) {
        lines.push(`Text:${command.text}`);
      } else {
        const label = command.label != null ? `${command.label}: ` : '';

        const cmdInfo = cmd_to_string(command.cmd);

        if (!cmdInfo) {
          throw new Error(`Unable to find command with ID ${command.cmd}`);
        }

        lines.push(label + cmdInfo.title + (command.params.length ? ' ' + command.params.join(',') : ''));
      }
    }

    return lines.join('\n');
  }

  public import(script: string) {
    const importedCommands: BaseCommand[] = [];
    const lines = script.split('\n').map(l => l.trim());

    for (const line of lines) {
      if (line.startsWith(`Text:`)) {
        const text = line.replace('Text:', '');
        importedCommands.push(new EvString(text));
      } else {
        let strippedLine = line;
        let label = null;
        const labelMatch = /(\d+):/.exec(line);
  
        if (labelMatch !== null && labelMatch.length) {
          label = parseInt(labelMatch[1]);

          strippedLine = strippedLine.replace(labelMatch[0], '');
        }

        let parts = strippedLine.split(/,|\s+/gm).map(p => p.trim()).filter(p => p.length);

        if (parts.length === 0) {
          console.error(`Unable to find command on line ${line}`);
          throw new Error(`Unable to find command on line ${line}`);
        }

        const commandTitle = parts.shift() || '';

        const command = string_to_cmd(commandTitle);

        if (!command) {
          console.error(`Unable to find command ${commandTitle} on line ${line}`);
          throw new Error(`Unable to find command ${commandTitle} on line ${line}`);
        }

        if (command.params !== parts.length)  {
          console.error(`Unexpected number of params on line ${line} expected ${command.params}`);
          throw new Error(`Unexpected number of params on line ${line} expected ${command.params}`);
        }

        const params = parts.map(s => parseInt(s));

        const c = buildCommand(command.commandId, params);

        if (label) {
          c.label = label;
        }

        importedCommands.push(c);
      }
    }

    this.commands = importedCommands;

    this.labels = this.commands.filter(c => c.label !== null)
      .map(c => ({
        label: c.label || 0,
        dest: 0, //TODO
      }));
  }

  public serialize(): Uint8Array {
    const data: number[] = [];

    write_short((this.labels.length + 2) * 4, data);

    for (const label of this.labels) {
      write_short(label.label, data);

      // We'll fix these up later, as we won't know the precise offsets until after
      // we serialize the commands themselves.
      write_short(0, data);
    }

    write_short(0xffff, data);

    // This is normally the length of the event?
    write_short(0xffff, data);

    for (const cmd of this.commands) {
      if (cmd.label) {
        const l = this.labels.find((l) => l.label === cmd.label);

        if (!l) {
          console.error(`Unable to find label with name ${cmd.label}`);
        } else {
          // There's a magic byte in the event stream that the GOTO skips, so do that here too
          l.dest = data.length + 2;
        }
      }

      data.push(...cmd.serialize());
    }

    this.labels.forEach((label, i) => {
      // Skip the initial count, then skip previous labels, then skip to dest part
      overwrite_short(label.dest, data, 2 + i * 4 + 2);
    });

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

      // There is sometimes some data inbetween the labels and the start of the
      // commands, but I don't know what that does yet...
      if (label === 0xffff) break;

      this.labels.push({
        label,
        dest,
      });
    }

    while (curr < data.length) {
      if (data[curr] === COMMAND_START) {
        // This is a command)
        const cmd = data[curr + 1];
        const param_count = cmd_param_lengths[cmd];
        const params = new Array(param_count)
          .fill(0)
          .map((_, i) => read_short(data, curr + 2 + i * 2));

        const command = buildCommand(cmd, params);

        const label = this.labels.find((l) => l.dest === curr + 2);

        if (label) {
          command.label = label.label;
        }

        this.commands.push(command);

        curr += 2 + 2 * param_count;
      } else {
        const stringBytes = [];
        while (data[curr] !== 0) {
          stringBytes.push(data[curr++]);
        }

        this.commands.push(
          new EvString(new Uint8Array(stringBytes))
        );
        curr++;
      }

      if (data[curr] === 0 && data[curr + 1] === 0) break;
    }
  }
}
