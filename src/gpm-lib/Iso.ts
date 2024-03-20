const SECTOR_SIZE = 2048;

class DirectoryEntry {
  public length: number;
  public extent: number;
  public size: number;
  public flags: number;

  public identifier: string;

  constructor(private fullBuffer: Buffer, offset: number) {
    this.length = fullBuffer.readUInt8(offset);

    const buffer = fullBuffer.slice(offset, offset + this.length);

    const extendedAttributeLength = buffer.readUInt8(1);

    this.extent = buffer.readUInt32LE(2);

    this.size = buffer.readUInt32LE(10);

    this.flags = buffer.readUInt8(25);

    const identifierLength = buffer.readUInt8(32);
    this.identifier = buffer.slice(33, 33 + identifierLength).toString("ascii");
  }

  public getDirectoryEntries(): DirectoryEntry[] {
    if (!this.isDirectory) throw new Error("Attempt to list non-directory");

    const directories: DirectoryEntry[] = [];
    let offset = 0;
    do {
      const entry = new DirectoryEntry(
        this.fullBuffer,
        this.dataStart + offset
      );

      directories.push(entry);

      offset += entry.length;
    } while (this.fullBuffer.readInt8(this.dataStart + offset) !== 0);

    return directories;
  }

  public get dataStart() {
    return this.extent * SECTOR_SIZE;
  }

  public get isDirectory() {
    return (this.flags & 2) !== 0;
  }
}

class VolumeDescriptor {
  public systemIdentifier: string;
  public volumeIdentifier: string;

  public volumeSpaceSize: number;

  public rootDirectory: DirectoryEntry;

  constructor(fullBuffer: Buffer, offset: number) {
    const buffer = fullBuffer.slice(offset, offset + SECTOR_SIZE);

    const type = buffer.readInt8(0);

    if (type !== 1) throw new Error("Unexpected type");

    const identifier = buffer.slice(1, 6).toString("ascii");

    if (identifier !== "CD001") throw new Error("Unexpected identifier");

    const volumeDesciptorVersion = buffer.readInt8(6);

    this.systemIdentifier = buffer.slice(8, 40).toString("ascii").trim();
    this.volumeIdentifier = buffer.slice(40, 72).toString("ascii").trim();

    this.volumeSpaceSize = buffer.readUInt32LE(80);

    this.rootDirectory = new DirectoryEntry(fullBuffer, offset + 156);
  }
}

export class ISO {
  public volumeDesciptor: VolumeDescriptor;

  constructor(private buffer: Buffer) {
    const volumeDescriptorStart = 2048 * 16;

    const vdType = buffer[volumeDescriptorStart];

    // Primary volume descriptor
    this.volumeDesciptor = new VolumeDescriptor(buffer, volumeDescriptorStart);

    console.log(this.volumeDesciptor.systemIdentifier);
    console.log(this.volumeDesciptor.volumeIdentifier);

    console.log(this.volumeDesciptor.rootDirectory.extent);
  }

  public listDir(path: string) {
    const dir = this.findEntry(path);

    if (!dir || !dir.isDirectory) {
      throw new Error("Attempt to list non-directory");
    }

    for (const entry of dir.getDirectoryEntries()) {
      console.log(entry.identifier);
    }
  }

  public findEntry(path: string) {
    path += ";1";

    const parts = path.split("/").filter((e) => e !== "");
    console.dir(parts);

    let currentEntry = this.volumeDesciptor.rootDirectory;

    for (const part of parts) {
      const entries = currentEntry.getDirectoryEntries();

      const entry = entries.find(
        (e) => e.identifier.toLowerCase() === part.toLowerCase()
      );

      if (!entry) {
        debugger;
        throw new Error("Unable to find entry " + part);
      }

      currentEntry = entry;
    }

    return currentEntry;
  }

  public replaceData(path: string, data: Buffer) {
    const entry = this.findEntry(path);

    if (entry.isDirectory) {
      throw new Error("Can't replace a directory");
    }

    if (data.length > entry.size) {
      throw new Error("Can't make a file bigger");
    }

    for (let i = 0; i < data.length; i++) {
      this.buffer[entry.dataStart + i] = data[i];
    }
  }
}
