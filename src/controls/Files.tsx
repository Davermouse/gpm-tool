import { observer } from "mobx-react";
import { useGPMToolContext } from "../context/GPMToolContext";
import { DirEntry } from "../gpm-lib/IsoReader";

const FileEntry = ({ file }: { file: DirEntry }) => {
  return (
    <li>
      {file.identifier} - {file.entrySize}
    </li>
  );
};

const DirList = ({ dir }: { dir: DirEntry }) => {
  return (
    <>
      <li>
        {dir.identifier}
        <ul>
          {dir.children.map((c) =>
            c.isFolder ? (
              <DirList dir={c} key={c.identifier} />
            ) : (
              <FileEntry key={c.identifier} file={c} />
            )
          )}
        </ul>
      </li>
    </>
  );
};

export const Files = observer(() => {
  const { fileStore } = useGPMToolContext();

  if (!fileStore) {
    return <>Filestore not found</>;
  }

  if (!fileStore.iso || !fileStore.iso.header) {
    return <>Image not loaded</>;
  }

  return <>
    <p>A raw list of files loaded from the BIN image.</p>
    <DirList dir={fileStore.iso.header.rootDirRecord} />
  </>;
});
