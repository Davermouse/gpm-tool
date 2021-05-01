import { cmd_to_string } from "../gpm-lib/evdata";
import { EvModule } from "../gpm-lib/EvFile";
import { read_short } from "../gpm-lib/helpers";

const shiftjis = require("shiftjis");

export const EventPreview = ({ module }: { module: EvModule }) => {
  let num_labels = read_short(module.data, 0);

  let curr = num_labels - 2;

  if (num_labels % 2 === 1) {
    throw new Error("Unexpected labels length");
  }

  const entries = [];

  while (true) {
    if (module.data[curr] === 0x1b) {
      // This is a command
      const cmd = module.data[curr + 1];
      const cmdData = cmd_to_string(cmd);

      entries.push(
        <span>
          {cmd.toString(16)} ({cmd})- {cmdData.title}(
          {new Array(cmdData.params)
            .fill(0)
            .map(
              (_, i) =>
                "0x" + read_short(module.data, curr + 2 + i * 2).toString(16)
            )
            .join(",")}
          )<br />
        </span>
      );

      curr += 2 + 2 * cmdData.params;
    } else {
      const stringBytes = [];
      while (module.data[curr] !== 0) {
        stringBytes.push(module.data[curr++]);
      }

      entries.push(
        <>
          {shiftjis.decode(stringBytes)}
          <br />
        </>
      );
      curr++;
    }

    if (entries.length > 100) {
      break;
    }
  }

  return (
    <div>
      <h2>Event preview</h2>
      <span>Num labels: {num_labels}</span>
      <div>{entries}</div>
    </div>
  );
};
