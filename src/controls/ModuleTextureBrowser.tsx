import { observer } from "mobx-react";
import React, { useState } from "react";
import { useGPMToolContext } from "../context/GPMToolContext";
import { Texture } from "../gpm-lib/BinModule";
import { formatHex } from "../helpers";
import { TexturePreview, TextureType } from "./TexturePreview";

export const ModuleTextureBrowser = observer(() => {
  const { fileStore } = useGPMToolContext();
  const [textureId, setTextureId] = useState(0xf);
  const [fileName, setFileName] = useState("/OTHER/TITLEV.BIN;1");

  if (!fileStore || !fileStore.evFile) {
    return <>Filestore not found</>;
  }

  const file = fileStore.files.find((f) => f.name === fileName);

  let texture: Texture | null = null;

  if (file && file.module.entries > textureId) {
    texture = file.module.findTexture(
      file.module.module_num * 0x100 + textureId
    );
  } else {
    console.warn(
      `Unable to find file ${fileName} or textureId: ${textureId.toString(16)}`
    );
  }

  let textureIds: string[] = [];

  if (file) {
    for (let i = 1; i < file.module.entries; i++) {
      textureIds.push(formatHex(i));
    }
  }

  return (
    <div>
      <p>Browse textures loaded from game modules. These are identified by two bytes - the module id and then the index in that module. </p>
      <select value={fileName} onChange={(e) => setFileName(e.target.value)}>
        {fileStore.files
          .filter((f) => f.module)
          .sort((f) => f.module.module_num)
          .map((f) => (
            <option value={f.name} key={f.name}>
              {formatHex(f.module.module_num)} - {f.name}
            </option>
          ))}
      </select>

      <select
        value={formatHex(textureId)}
        onChange={(e) => setTextureId(parseInt(e.currentTarget.value, 16))}
      >
        {textureIds.map((id) => (
          <option key={id} value={id}>
            {id}
          </option>
        ))}
      </select>

      {texture && texture.data.length > 0 && (
        <TexturePreview
          scale={2}
          texture={texture}
          type={TextureType.EightBitClut}
        />
      )}
      {!texture && <span>Texture not found</span>}
    </div>
  );
});
