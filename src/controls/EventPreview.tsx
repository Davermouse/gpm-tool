import { cmd_to_string } from "../gpm-lib/evdata";
import { BaseCommand } from "../gpm-lib/Events/BaseCommand";
import { TalkCommand } from "../gpm-lib/Events/Commands/TalkCommand";
import { UnknownCommand } from "../gpm-lib/Events/Commands/UnknownCommand";
import { EvString } from "../gpm-lib/Events/EvString";
import { GPEvent } from "../gpm-lib/Events/GPEvent";
import { EvModule } from "../gpm-lib/EvFile";

import styles from "./EventPreview.module.css";
import { EvTexturePreview } from "./EVTexturePreview";

const shiftjis = require("shiftjis");

const elementFromCommand = (command: BaseCommand) => {
  if (command instanceof EvString) {
    return <StringEntry evString={command} />;
  } else if (command instanceof UnknownCommand) {
    return <UnknownCommandEntry unknownCommand={command} />;
  } else if (command instanceof TalkCommand) {
    return <TalkCommandEntry talkCommand={command} />;
  } else {
    return <div>Unknown command type</div>;
  }
};

const StringEntry = ({ evString }: { evString: EvString }) => {
  return (
    <div>
      {evString.offset} - {evString.text}
    </div>
  );
};

const TalkCommandEntry = ({ talkCommand }: { talkCommand: TalkCommand }) => {
  return (
    <div>
      {talkCommand.offset} - Talk()
      <EvTexturePreview moduleId={talkCommand.getTextureId()} />
    </div>
  );
};

const UnknownCommandEntry = ({
  unknownCommand,
}: {
  unknownCommand: UnknownCommand;
}) => {
  const cmdData = cmd_to_string(unknownCommand.cmd);

  return (
    <div>
      {unknownCommand.offset} - {cmdData.title}(
      {unknownCommand.params.map((p) => `0x${p.toString(16)}`).join(",")})
    </div>
  );
};

export const EventPreview = ({ module }: { module: EvModule }) => {
  const event = new GPEvent(module.data);

  return (
    <div>
      <h2>Event preview</h2>
      <div>
        <table>
          <thead>
            <th>Label</th>
            <th>Destination</th>
          </thead>
          <tbody>
            {event.labels.map((l) => (
              <tr>
                <td>{l.label.toString(16)}</td>
                <td>{l.dest}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>{event.commands.map((c) => elementFromCommand(c))}</div>
    </div>
  );
};
