import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useGPMToolContext } from "../context/GPMToolContext";
import { TexturePreview, TextureType } from "./TexturePreview";

export const Maps = observer(() => {
  const { fileStore } = useGPMToolContext();
  const [mapId, setMapId] = useState(8);

  if (!fileStore) {
    return <>Filestore not found</>;
  }

  if (!fileStore.iso || !fileStore.mapData) {
    return <>Image not loaded</>;
  }

  const map = fileStore.mapData.loadMap(mapId, 0, 0);

  return (
    <>
      <TexturePreview
        texture={map.chunk1}
        type={TextureType.EightBitClut}
        scale={1}
      />

      <TexturePreview
        texture={map.chunk2}
        type={TextureType.EightBitClut}
        scale={1}
      />
      <TexturePreview
        texture={map.chunk3}
        type={TextureType.EightBitClut}
        scale={1}
      />
      <TexturePreview
        texture={map.chunk4}
        type={TextureType.EightBitClut}
        scale={1}
      />

      <TexturePreview
        texture={map.chunk5}
        type={TextureType.EightBitClut}
        scale={1}
      />
    </>
  );
});
