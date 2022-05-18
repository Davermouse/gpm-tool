import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";

import { cmd_to_string } from "../gpm-lib/evdata";
import { BaseCommand } from "../gpm-lib/Events/BaseCommand";
import { TalkCommand } from "../gpm-lib/Events/Commands/TalkCommand";
import { UnknownCommand } from "../gpm-lib/Events/Commands/UnknownCommand";
import { EvString } from "../gpm-lib/Events/EvString";
import { GPEvent } from "../gpm-lib/Events/GPEvent";
import { EvModule } from "../gpm-lib/EvFile";

import styles from "./EventPreview.module.css";
import { EvTexturePreview } from "./EVTexturePreview";
import { useEffect, useState } from "react";
import { FaceOnCommand } from "../gpm-lib/Events/Commands/FaceOnCommand";

const elementFromCommand = (index: number, command: BaseCommand) => {
  if (command instanceof EvString) {
    return <StringEntry key={index} evString={command} />;
  } else if (command instanceof UnknownCommand) {
    return <UnknownCommandEntry key={index} unknownCommand={command} />;
  } else if (command instanceof TalkCommand) {
    return <TalkCommandEntry key={index} talkCommand={command} />;
  } else if (command instanceof FaceOnCommand) {
    return <FaceOnCommandEntry key={index} command={command} />;
  } else {
    return <div>Unknown command type</div>;
  }
};

const Label = ({ command }: { command: BaseCommand }) => {
  return (
    <div
      className={styles.label}
      id={command.label ? `label-${command.label}` : undefined}
    >
      {command.label ? `${command.label.toString(16)}:` : ""}
    </div>
  );
};

const StringEntry = ({ evString }: { evString: EvString }) => {
  const [text, setText] = useState(evString.text);

  useEffect(() => {
    setText(evString.text);
  }, [evString]);

  return (
    <Accordion>
      <AccordionSummary>
        <div className={styles.label} />
        {evString.text}
      </AccordionSummary>
      <AccordionDetails>
        <input value={text} onChange={(e) => setText(e.currentTarget.value)} />
        <button onClick={() => (evString.text = text)}>Save</button>
      </AccordionDetails>
    </Accordion>
  );
};

const TalkCommandEntry = ({ talkCommand }: { talkCommand: TalkCommand }) => {
  return (
    <Accordion>
      <AccordionSummary>
        <Label command={talkCommand} />
        Talk(
        {talkCommand.paramInfo
          .map((p, i) => `0x${talkCommand.params[i].toString(16)}`)
          .join(",")}
        )
      </AccordionSummary>
      <AccordionDetails>
        <EvTexturePreview moduleId={talkCommand.getTextureId()} />
      </AccordionDetails>
    </Accordion>
  );
};

const FaceOnCommandEntry = ({ command }: { command: FaceOnCommand }) => {
  return (
    <Accordion>
      <AccordionSummary>
        <Label command={command} />
        FaceOn(
        {command.paramInfo
          .map((p, i) => `0x${command.params[i].toString(16)}`)
          .join(",")}
        )
      </AccordionSummary>
      <AccordionDetails>
        <EvTexturePreview moduleId={command.getTextureId()} />
      </AccordionDetails>
    </Accordion>
  );
};

const UnknownCommandEntry = ({
  unknownCommand,
}: {
  unknownCommand: UnknownCommand;
}) => {
  const cmdData = cmd_to_string(unknownCommand.cmd);

  return (
    <Accordion>
      <AccordionSummary>
        <Label command={unknownCommand} />
        {cmdData.title}(
        {unknownCommand.params.map((p) => `0x${p.toString(16)}`).join(",")})
      </AccordionSummary>
      <AccordionDetails>asdsad</AccordionDetails>
    </Accordion>
  );
};

export const EventPreview = ({ module }: { module: EvModule }) => {
  const event = new GPEvent(module.data);

  const serialize = () => {
    const d = event.serialize();

    module.replaceData(d);
  };

  return (
    <div>
      <h2>Event preview</h2>
      <div>
        <table>
          <thead>
            <tr>
              <th>Label</th>
              <th>Destination</th>
            </tr>
          </thead>
          <tbody>
            {event.labels.map((l) => (
              <tr key={l.label.toString()}>
                <td>{l.label.toString(16)}</td>
                <td>
                  <a href={`#label-${l.label}`}>{l.dest}</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <button onClick={() => serialize()}>Serialize</button>
      </div>
      <div>{event.commands.map((c, i) => elementFromCommand(i, c))}</div>
    </div>
  );
};
