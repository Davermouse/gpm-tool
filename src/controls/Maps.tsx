import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useGPMToolContext } from "../context/GPMToolContext";
import { TexturePreview, TextureType } from "./TexturePreview";
import { coloredClutFromRaw } from "../gpm-lib/texture";

export const Maps = observer(() => {
  const { fileStore } = useGPMToolContext();
  const [mapId, setMapId] = useState(8);
  const [mapSubId, setMapSubId] = useState(0);

  if (!fileStore) {
    return <>Filestore not found</>;
  }

  if (!fileStore.iso || !fileStore.mapData) {
    return <>Image not loaded</>;
  }
  
  const map = fileStore.mapData.loadMap(mapId, mapSubId, 0);
  const clut = coloredClutFromRaw(map.map_clut);

  return (
    <>
      <input type="number" value={mapId} onChange={(e) => {
        try {
          const n = parseInt(e.currentTarget.value);

          setMapId(n);
        } catch (e) {}
      }} />
      <input type="number" value={mapSubId} onChange={(e) => {
        try {
          const n = parseInt(e.currentTarget.value);

          setMapSubId(n);
        } catch (e) {}
      }} />
      <TexturePreview
        texture={map.map_tex}
        type={TextureType.EightBitClut}
        clut={clut}
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
