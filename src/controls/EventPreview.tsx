import { cmd_to_string } from "../gpm-lib/evdata";
import { BaseCommand } from "../gpm-lib/Events/BaseCommand";
import { TalkCommand } from "../gpm-lib/Events/Commands/TalkCommand";
import { UnknownCommand } from "../gpm-lib/Events/Commands/UnknownCommand";
import { EvString } from "../gpm-lib/Events/EvString";
import { GPEvent } from "../gpm-lib/Events/GPEvent";
import { EvModule } from "../gpm-lib/EvFile";

import styles from "./EventPreview.module.css";
import { EvTexturePreview } from "./EVTexturePreview";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { FaceOnCommand } from "../gpm-lib/Events/Commands/FaceOnCommand";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import classNames from "classnames";
import { useDropzone } from "react-dropzone";
import { useGPMToolContext } from "../context/GPMToolContext";

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
      <b>{command.label ? `${command.label.toString()}:` : ""}</b>
    </div>
  );
};

const CommandEntry = ({ command, children }: { command: BaseCommand, children: ReactNode }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const c = classNames(
    styles.commandEntry,
    {
      [styles.commandEntryExpanded]: isExpanded
    }
  );

  return (
    <div className={c} onClick={() => setIsExpanded(!isExpanded)}>
      <Label command={command} />
      {children}
    </div>
  );
}

const CommandEntrySummary = ({ children }: { children: ReactNode}) =>
  <div className={styles.commandSummary}>
    {children}
  </div>;

const CommandEntryDetails = ({ children }: { children: ReactNode}) =>
  <div className={styles.commandDetails}>
    {children}
  </div>;

const StringEntry = ({ evString }: { evString: EvString }) => {
  const [text, setText] = useState(evString.text);

  useEffect(() => {
    setText(evString.text);
  }, [evString]);

  return (
    <CommandEntry command={evString}>
      <CommandEntrySummary>
        {evString.text}
      </CommandEntrySummary>
      <CommandEntryDetails>
        <input value={text} onChange={(e) => setText(e.currentTarget.value)} />
        <button onClick={() => (evString.text = text)}>Save</button>
      </CommandEntryDetails>
    </CommandEntry>
  );
};

const TalkCommandEntry = ({ talkCommand }: { talkCommand: TalkCommand }) => {
  const currentPlayer = talkCommand.params[0] === 0 && talkCommand.params[1] === 0;

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
        { currentPlayer && <p>The current player/narrator</p>} 
        { !currentPlayer && <EvTexturePreview moduleId={talkCommand.getTextureId()} /> }
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
    <Accordion >
      <AccordionSummary>
        <Label command={unknownCommand} />
        {cmdData !== null ? cmdData.title : `Unknown command ${unknownCommand.cmd}`}(
        {unknownCommand.params.map((p) => `0x${p.toString(16)}`).join(",")})
      </AccordionSummary>
      <AccordionDetails></AccordionDetails>
    </Accordion>
  );
};

export const EventPreview = ({ eventId }: { eventId: number }) => {
  const { gpmEventStore } = useGPMToolContext();
  const event = gpmEventStore?.getEvent(eventId);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) {
      console.warn('Attempted to import script but files empty');
      return;
    }

    const f = acceptedFiles[0];
    const buf = await f.text();

    try {
      if (event != null) {
        event.import(buf);
      }
    } catch (err) {
      if (err instanceof Error) {
        alert(err.toString());
      }
    }
    
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: [".txt"]});

  if (!event) {
    return <div>Unable to find event.</div>;
  }

  const serialize = () => {
    const d = event.serialize();

    gpmEventStore?.saveEvent(eventId, event);
  };

  const doExport = () => {
    console.log('Do export');

    const output = event.export();
    const url = URL.createObjectURL(new Blob([output]));

    const a = document.createElement('a');

    a.href = url;
    a.download = `script-${module.id}.txt`;

    const clickHandler = () => {
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.removeEventListener("click", clickHandler);
      }, 150);
    };

    a.addEventListener("click", clickHandler, false);

    a.click();
  }

  
  return (
    <div>
      <button onClick={() => doExport()}>Export script</button>

      <div className={styles.uploadArea} { ...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drop a script .txt file here</p>
      </div>

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
                <td>{l.label.toString()}</td>
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
