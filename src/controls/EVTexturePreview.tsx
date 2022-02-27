import React from "react";
import { useGPMToolContext } from "../context/GPMToolContext";
import { EvModule, EvModuleType } from "../gpm-lib/EvFile";
import { read_short } from "../gpm-lib/helpers";
import { decompress_texture } from "../gpm-lib/texture";
import { TexturePreview, TextureType } from "./TexturePreview";

function coloredClutFromRaw(data: Uint8Array): Uint16Array {
  if (data.length !== 512) throw new Error("Unexpected data length");

  const output = [];

  for (let i = 0; i < 256; i++) {
    output.push(read_short(data, i * 2));
  }

  return new Uint16Array(output);
}

export const EvTexturePreview = ({ moduleId }: { moduleId: number }) => {
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
    data: decompress_texture(module.data.slice(0x212 + 4), 0),
  };

  return (
    <TexturePreview
      scale={1}
      texture={evTexture}
      type={TextureType.EightBitClut}
      clut={clut}
    />
  );
};
