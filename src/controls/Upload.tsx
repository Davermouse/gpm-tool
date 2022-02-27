import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useGPMToolContext } from "../context/GPMToolContext";

export const Upload = () => {
  const { fileStore } = useGPMToolContext();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log(acceptedFiles);

    if (acceptedFiles.length) {
      const f = acceptedFiles[0];

      const buf = await f.arrayBuffer();
      fileStore?.loadIsoData(Buffer.from(buf));
    }
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ onDrop });

  const area = (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
    </div>
  );

  return <div>{area}</div>;
};
