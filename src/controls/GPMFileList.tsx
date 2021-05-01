import { observer } from "mobx-react";
import { useGPMToolContext } from "../context/GPMToolContext"

export const GPMFileList = observer(() => {
    const { fileStore } = useGPMToolContext();

    if (!fileStore) {
        return <>Filestore not found</>;
    }

    return (
        <>
            {fileStore.files.map(f => <div><h4>{f.module? f.module.module_num.toString(16): 'xx'} {f.name} - {f.module? f.module.entries: ''}  {f.data ? f.data.byteLength : '?'}</h4></div>)}
        </>
    )
});