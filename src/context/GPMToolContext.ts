import { createContext, useContext } from "react";
import { FileStore } from "../stores/FileStore";
import { GPMEventStore } from "../stores/GPMEventStore";

export const GPMToolContext = createContext<
{
    fileStore?: FileStore,
    gpmEventStore?: GPMEventStore,
}>({
    fileStore: undefined,
    gpmEventStore: undefined,
});

export const useGPMToolContext = () => useContext(GPMToolContext);
