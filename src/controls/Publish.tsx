import { useGPMToolContext } from "../context/GPMToolContext";

export const Publish = () => {
  const { fileStore } = useGPMToolContext();

  const doPublish = () => {
    const url = fileStore?.publishIso();

    if (!url) return;

    const a = document.createElement("a");

    a.href = url;
    a.download = `GPM-built.iso`;

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
      <h1>Publishing</h1>

      <button onClick={() => doPublish()}>Publish</button>
    </>
  );
};
