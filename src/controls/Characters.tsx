import { useGPMToolContext } from "../context/GPMToolContext";
import { computeTextureId } from "../gpm-lib/Events/Helpers/CharacterHelpers";
import { EvModuleType } from "../gpm-lib/EvFile";
import { EvTexturePreview } from "./EVTexturePreview";
import { TexturePreview } from "./TexturePreview";

export const Character: React.FC<{ characterId: number }> = ({
  characterId,
}) => {
  const { fileStore } = useGPMToolContext();

  if (!fileStore) {
    throw new Error("Filestore not loaded");
  }

  if (!fileStore.evFile) {
    throw new Error("EVFile not loaded");
  }

  const charPics = [];

  for (let m = 0; m < 0xd; m++) {
    const moduleId = computeTextureId(characterId, m);
    const module = fileStore.evFile.getModule(moduleId);

    if (!module || module.type !== EvModuleType.Texture) {
      continue;
    }

    charPics.push(
      <EvTexturePreview moduleId={computeTextureId(characterId, m)} />
    );
  }

  if (charPics.length === 0) return <></>;

  return (
    <>
      <h4>{characterId}</h4>
      <div>{charPics}</div>
    </>
  );
};

export const Characters = () => {
  const charcount = 60;
  const characters = [];

  for (let c = 0; c < charcount; c++) {
    characters.push(<Character characterId={c} />);
  }

  return <>{characters}</>;
};
