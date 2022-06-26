import { useGPMToolContext } from "../context/GPMToolContext";

export const Publish = () => {
  const { fileStore } = useGPMToolContext();

  const doPublish = () => {
    const url = fileStore?.publishIso();

    if (!url) return;

    const a = document.createElement("a");

    a.href = url;
    a.download = `GPM-built.bin`;

    const clickHandler = () => {
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.removeEventListener("click", clickHandler);
      }, 150);
    };

    a.addEventListener("click", clickHandler, false);

    a.click();
  };

  return (
    <>
      <p>Generate a .BIN based on the one you originally loaded, and including any changes you've made.</p>
      <p>This should run correctly in an emulator, but will probably issues on hardware until some work around computing error correction hashes in the .BIN file is done.</p>

      <button onClick={() => doPublish()}>Publish</button>
    </>
  );
};
