import { observer } from "mobx-react";
import { useState } from "react";
import { useGPMToolContext } from "../context/GPMToolContext";
import { EvModule, EvModuleType } from "../gpm-lib/EvFile";
import { EventPreview } from "./EventPreview";
import { EvTexturePreview } from "./EVTexturePreview";

export const EVDataEvents = observer(() => {
  const { fileStore } = useGPMToolContext();
  const [currentOffset, setCurrentOffset] = useState(0x426 /*0x5d8*/);

  if (!fileStore) {
    return <>Filestore not found</>;
  }

  if (!fileStore.evFile) {
    return <>EVData not loaded</>;
  }

  const module = fileStore.evFile.getModule(currentOffset);

  return (
    <div>
      <input
        type="number"
        value={currentOffset}
        onChange={(e) => setCurrentOffset(parseInt(e.currentTarget.value))}
      />
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
