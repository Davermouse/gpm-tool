import { observer } from "mobx-react";
import { useGPMToolContext } from "../context/GPMToolContext";
import StringPatcher from "../gpm-lib/StringPatcher";

export const Strings = observer(() => {
    const { fileStore } = useGPMToolContext();

    if (!fileStore) {
        return <>Filestore not found</>;
    }

    if (!fileStore.iso) {
        return <>Image not loaded</>;
    }

    const updateStrings = () => {
        console.log("Updating strings");

        if (fileStore.iso === null) {
            console.error("ISO not found");
            return;
        }

        const strings = new StringPatcher(fileStore.iso);
    };

    return (
        <>
        <button onClick={() => updateStrings()} >Update strings</button>
        </>
    );
});