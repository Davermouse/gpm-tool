import { observer } from "mobx-react";
import { useState } from "react";
import { useGPMToolContext } from "../context/GPMToolContext";
import { EvModule, EvModuleType } from "../gpm-lib/EvFile";
import { EventPreview } from "./EventPreview";
import { EvTexturePreview } from "./EVTexturePreview";

export const EVDataEvents = observer(() => {
  const { fileStore } = useGPMToolContext();
  const [currentOffset, setCurrentOffset] = useState(0x425 /*0x5d8*/);

  if (!fileStore) {
    return <>Filestore not found</>;
  }

  if (!fileStore.evFile) {
    return <>EVData not loaded</>;
  }

  const module = fileStore.evFile.getModule(currentOffset);

  return (
    <div>
      <p>View and manipulate event scripts. Select an event ID using the dropdown, and then when the script for that event has loaded, you can expand some instruction types to view or edit data. Currently this is limited to viewing the textures for 'faceon' and 'talk' commands, and editing strings.</p>
      <p> Event 1061 is the event loaded at new game, and so is a good place to start. Following on from there are the successive school lessons. Prior to these are conversations with different characters triggered by interacting with them.</p>
      <p>To make a text change, you need to do the following:</p>
      <ul>
        <li>Click the text entry you want to edit, and make your change. Starting a string with \4 will put the game into a mode which will correctly display single width capitalised Latin text.</li>
        <li>Click the 'Save' button in that text entry.</li>
        <li>(When you're finished with the event)</li>
        <li>Click the 'Serialize' button at the top of the script.</li>
        <li>(When you've finished completely)</li>
        <li>Click the 'Save EV file' at the top of the page.</li>
        <li>Go to the 'Publish' page to produce a gamae image.</li>
        <li>Load in an emulator. PCSX-redux works well for me.</li>
      </ul>
      <label>Event ID:
      <input
        type="number"
        value={currentOffset}
        onChange={(e) => setCurrentOffset(parseInt(e.currentTarget.value))}
      />
      </label>
      <button onClick={() => fileStore.evFile?.updateISO()}>
        Save EV file
      </button>
      {module && module.type == EvModuleType.Texture && (
        <EvTexturePreview moduleId={currentOffset} />
      )}
      {module && module.type == EvModuleType.Event && (
        <EventPreview module={module} />
      )}

      {!module && <span>Empty module</span>}
    </div>
  );
});
