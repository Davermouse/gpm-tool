import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { Buffer } from "buffer";
import { useGPMToolContext } from "../context/GPMToolContext";

export const Upload = () => {
  const { fileStore } = useGPMToolContext();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log(acceptedFiles);

    if (acceptedFiles.length) {
      const f = acceptedFiles[0];

      const buf = await f.arrayBuffer();
      fileStore?.loadBinData(Buffer.from(buf));
    }
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ onDrop, accept: [".bin"] });

  const area = (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop your .BIN file here, or click to open a file picker.</p>
    </div>
  );

  return <div>{area}</div>;
};
