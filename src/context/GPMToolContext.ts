import { createContext, useContext } from "react";
import { FileStore } from "../stores/FileStore";

export const GPMToolContext = createContext<
{
    fileStore?: FileStore
}>({
    fileStore: undefined
});

export const useGPMToolContext = () => useContext(GPMToolContext);
