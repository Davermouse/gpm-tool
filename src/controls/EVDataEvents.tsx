import { observer } from "mobx-react";
import { useState } from "react";
import { useGPMToolContext } from "../context/GPMToolContext";
import { EvModule, EvModuleType } from "../gpm-lib/EvFile";
import { read_short } from "../gpm-lib/helpers";
import { decompress_texture } from "../gpm-lib/texture";
import { EventPreview } from "./EventPreview";
import { TexturePreview, TextureType } from "./TexturePreview";

function coloredClutFromRaw(data: Uint8Array): Uint16Array {
  if (data.length !== 512) throw new Error("Unexpected data length");

  const output = [];

  for (let i = 0; i < 256; i++) {
    output.push(read_short(data, i * 2));
  }

  return new Uint16Array(output);
}

export const EvModuleView = ({ module }: { module: EvModule }) => {
  const clut = coloredClutFromRaw(module.data.slice(0 + 4, 512 + 4));
  const evTexture = decompress_texture(module.data.slice(0x212 + 4), 0); // evdatafile.data, 0x5fd218);

  return (
    <div>
      <span>Type: {module.friendlyType}</span>
      <br />
      <span>Unk2: {module.unk2}</span>
      {module.type === EvModuleType.Texture && (
        <TexturePreview
          texture={evTexture}
          type={TextureType.EightBitClut}
          clut={clut}
        />
      )}
      {module.type === EvModuleType.Event && <EventPreview module={module} />}
    </div>
  );
};

export const EVDataEvents = observer(() => {
  const { fileStore } = useGPMToolContext();
  const [currentOffset, setCurrentOffset] = useState(0x426 /*0x5d8*/);

  if (!fileStore) {
    return <>Filestore not found</>;
  }

  if (!fileStore.evFile) {
    return <>EVData not loaded</>;
  }

  const evdatafile = fileStore.files.find(
    (f) => f.name.indexOf("EVDATA") !== -1
  );

  if (!evdatafile?.data) return <>EVDATA not loaded</>;

  const module = fileStore.evFile.getModule(currentOffset);

  return (
    <div>
      <input
        type="number"
        value={currentOffset}
        onChange={(e) => setCurrentOffset(parseInt(e.currentTarget.value))}
      />
      {module && <EvModuleView module={module} />}
      {!module && <span>Empty module</span>}
    </div>
  );
});
