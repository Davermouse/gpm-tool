import { Buffer } from "buffer";

import { FuurakiExecutable } from "./FuurakiExecutable";
import { read_int } from "./helpers";

class FileEntry {
    constructor(public name: string, public start: number, public size: number) {

    }
}

export class MCDatFile {
    private header: Buffer;

    private entries: FileEntry[];

    constructor(private buffer: Buffer, private exe: FuurakiExecutable) {
        this.header = Buffer.from([]);
        this.entries = [];

        this.parseHeader();
    }

    parseHeader() {
        const firstPart = this.decrypt(0, 0xf);

        const headerLength = read_int(firstPart, 0);

        console.info(`Header length: ${headerLength}`);

        const secondPart = this.decrypt(0x10, (headerLength << 4) | 0xf);

        this.header = Buffer.concat([firstPart, secondPart]);

        if (this.header.length % 16 !== 0) {
         //   throw new Error('Header length not % 16');
        }

        for (let i = 0 ; i < this.header.length ; i += 16) {
            const nameBytes = this.header.slice(i, i + 8);
            const nullIdx = nameBytes.findIndex(b => b === 0);
            const name = nameBytes.toString('ascii', 0, nullIdx);

            const a = this.header.readInt32LE(i + 8);
            const b = this.header.readInt32LE(i + 12);

            this.entries.push(new FileEntry(name, a, b));
        }

        console.info(`Loaded ${this.entries.length} entries`);
    }

    decrypt(start: number, end: number) {
        /*
            curr_byte = (byte *)(data + start);
        key_idx = start + 7;
      accum = start >> 10;
      start = start + 1;
      *curr_byte = *curr_byte ^ decrypt_key[key_idx & 0x3ff] + (char)accum;
        */

        const data = new Uint8Array(end - start + 1);
        const key = this.exe.datKey();
        
        for (let i = start ; i <= end ; i++) {
            let curr = this.buffer[i];
            let key_idx = i + 7;
            let add = i >> 10;

            data[i - start] = curr ^ key[key_idx & 0x3ff] + add % 256;
        }


        return data;
    }
}