import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { Buffer } from "buffer";
import { useGPMToolContext } from "../context/GPMToolContext";

import styles from './Upload.module.css';

export const Upload = () => {
  const { fileStore } = useGPMToolContext();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      const f = acceptedFiles[0];

      const buf = await f.arrayBuffer();
      fileStore?.loadBinData(Buffer.from(buf));
    }
  }, [fileStore]);

  const {
    getRootProps,
    getInputProps
  } = useDropzone({ onDrop, accept: [".bin"] });

  const area = (
    <div className={styles.uploadArea} {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag and drop your .BIN file here, or click to open a file picker.</p>
    </div>
  );

  return <div>{area}</div>;
};
