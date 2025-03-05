import { GPEvent } from "../gpm-lib/Events/GPEvent";
import { FileStore } from "./FileStore";

type EventCache = { [id: string]: GPEvent };

export class GPMEventStore {
    private events: EventCache = {};

    public constructor(private fileStore: FileStore) {

    }

    public getEvent(eventId: number): GPEvent | null {
        if (this.events[eventId.toString()]) {
            return this.events[eventId.toString()];
        }

        if (!this.fileStore.iso) {
            return null;
        }

        const module = this.fileStore.evFile?.getModule(eventId);

        if (!module) {
            return null;
        }

        const event = new GPEvent(module?.data);

        this.events[eventId.toString()] = event;

        return event;
    }

    public saveEvent(eventId: number, event: GPEvent) {
        const module = this.fileStore.evFile?.getModule(eventId);

        if (!module) {
            return;
        }

        module.replaceData(event.serialize());
    }
}