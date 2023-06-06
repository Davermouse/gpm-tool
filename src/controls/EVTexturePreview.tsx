import React from "react";
import { useGPMToolContext } from "../context/GPMToolContext";
import { EvModule, EvModuleType } from "../gpm-lib/EvFile";
import { decompress_texture, coloredClutFromRaw } from "../gpm-lib/texture";
import { TexturePreview, TextureType } from "./TexturePreview";

export const EvTexturePreview = React.memo(({ moduleId }: { moduleId: number }) => {
  const { fileStore } = useGPMToolContext();

  if (!fileStore) {
    throw new Error("Filestore not loaded");
  }

  if (!fileStore.evFile) {
    throw new Error("EVFile not loaded");
  }

  const module = fileStore.evFile.getModule(moduleId);

  if (!module || module.type !== EvModuleType.Texture) {
    return <span>{`EV Module ${moduleId} not found`}</span>;
  }

  const clut = coloredClutFromRaw(module.data.slice(0 + 4, 512 + 4));
  const evTexture = {
    w: 0,
    h: 0,
    data: decompress_texture(module.data.slice(0x212 + 4), 0).data,
  };

  return (
    <TexturePreview
      scale={1}
      texture={evTexture}
      type={TextureType.EightBitClut}
      clut={clut}
    />
  );
});
