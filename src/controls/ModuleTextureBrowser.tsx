import { observer } from "mobx-react";
import React, { useState } from "react";
import { useGPMToolContext } from "../context/GPMToolContext";
import { TexturePreview, TextureType } from "./TexturePreview";

export const ModuleTextureBrowser = observer(() => {
  const { fileStore } = useGPMToolContext();
  const [textureId, setTextureId] = useState(0xa00f);

  if (!fileStore) {
    return <>Filestore not found</>;
  }

  //texture = module && module.findTexture(0xa00a);
  const texture = fileStore.findTexture(textureId);

  return (
    <div>
      <input
        value={textureId.toString(16)}
        onChange={(e) => setTextureId(parseInt(e.currentTarget.value, 16))}
      />

      {texture && texture.length > 0 && (
        <TexturePreview
          scale={2}
          texture={texture}
          type={TextureType.EightBitClut}
        />
      )}
    </div>
  );
});
