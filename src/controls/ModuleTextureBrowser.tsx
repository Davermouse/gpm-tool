import { observer } from "mobx-react";
import React, { useState } from "react";
import { useGPMToolContext } from "../context/GPMToolContext";
import { Texture } from "../gpm-lib/BinModule";
import { TexturePreview, TextureType } from "./TexturePreview";

export const ModuleTextureBrowser = observer(() => {
  const { fileStore } = useGPMToolContext();
  const [textureId, setTextureId] = useState(0);
  const [fileName, setFileName] = useState("");

  if (!fileStore) {
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
    for (let i = 0; i < file.module.entries; i++) {
      textureIds.push(i.toString(16));
    }
  }

  return (
    <div>
      <select value={fileName} onChange={(e) => setFileName(e.target.value)}>
        {fileStore.files
          .filter((f) => f.module)
          .sort((f) => f.module.module_num)
          .map((f) => (
            <option value={f.name}>
              {f.module.module_num.toString(16)} - {f.name}
            </option>
          ))}
      </select>

      <select
        value={textureId.toString(16)}
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
