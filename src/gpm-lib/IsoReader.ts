import { Buffer } from "buffer";
import { BufferReader } from "./BufferReader";

const CD_SECTOR_SIZE = 2352;
const DATA_SIZE = 2336;

/*
/// Structure of a date stamp for ISO_DIR_ENTRY structure
	struct ISO_DATESTAMP
	{
		unsigned char	year;		/// number of years since 1900
		unsigned char	month;		/// month, where 1=January, 2=February, etc.
		unsigned char	day;		/// day of month, in the range from 1 to 31
		unsigned char	hour;		/// hour, in the range from 0 to 23
		unsigned char	minute;		/// minute, in the range from 0 to 59
		unsigned char	second;		/// Second, in the range from 0 to 59
		signed char		GMToffs;	/// Greenwich Mean Time offset
	};
    */

/*

	/// Structure for a mode 2 form 1 sector (used in regular files)
	typedef struct {
		unsigned char	sync[12];	/// Sync pattern (usually 00 FF FF FF FF FF FF FF FF FF FF 00)
		unsigned char	addr[3];	/// Sector address (see below for encoding details)
		unsigned char	mode;		/// Mode (usually 2 for Mode 2 Form 1/2 sectors)
		unsigned char	subHead[8];	/// Sub-header (00 00 08 00 00 00 08 00 for Form 1 data sectors)
		unsigned char	data[2048];	/// Data (form 1)
		unsigned char	edc[4];		/// Error-detection code (CRC32 of data area)
		unsigned char	ecc[276];	/// Error-correction code (uses Reed-Solomon ECC algorithm)
	} SECTOR_M2F1;
    */

class SectorM2F1 {
  public sync: Uint8Array;
  public addr: Uint8Array;
  public mode: number;
  public subHead: Uint8Array;
  public data: Uint8Array;
  public edc: Uint8Array;
  public ecc: Uint8Array;

  constructor(buffer: Buffer) {
    if (buffer.byteLength !== CD_SECTOR_SIZE) {
      throw new Error(
        `Attempted to create sector with incorrect sector size: ${buffer.byteLength}`
      );
    }

    this.sync = buffer.slice(0, 12);
    this.addr = buffer.slice(12, 15);
    this.mode = buffer.readInt8(15);
    this.subHead = buffer.slice(16, 24);
    this.data = buffer.slice(24, 2072);
    this.edc = buffer.slice(2072, 2076);
    this.ecc = buffer.slice(2076, 2352);
  }
}
/*
typedef struct {
    unsigned char	sync[12];	/// Sync pattern (usually 00 FF FF FF FF FF FF FF FF FF FF 00)
    unsigned char	addr[3];	/// Sector address (a 24-bit big-endian integer. starts at 200, 201 an onwards)
    unsigned char	mode;		/// Mode (usually 2 for Mode 2 Form 1/2 sectors)
    unsigned char	data[2336];	/// 8 bytes Subheader, 2324 bytes Data (form 2), and 4 bytes ECC
} SECTOR_M2F2;
*/

class SectorM2F2 {
  public sync: Uint8Array;
  public addr: Uint8Array;
  public mode: number;
  public data: Uint8Array;

  constructor(buffer: Buffer) {
    if (buffer.byteLength !== CD_SECTOR_SIZE) {
      throw new Error(
        `Attempted to create sector with incorrect sector size: ${buffer.byteLength}`
      );
    }

    this.sync = buffer.slice(0, 12);
    this.addr = buffer.slice(12, 15);
    this.mode = buffer[15];
    this.data = buffer.slice(15, 2351);
  }
}

/*
/// ISO descriptor header structure
	typedef struct {
		unsigned char	type;		/// Volume descriptor type (1 is descriptor, 255 is descriptor terminator)
		char			id[5];		/// Volume descriptor ID (always CD001)
		unsigned short	version;	/// Volume descriptor version (always 0x01)
	} ISO_DESCRIPTOR_HEADER;
    */

class IsoDescriptorHeader {
  type: number;
  id: string;
  version: number;

  constructor(reader: BufferReader) {
    this.type = reader.readByte();
    this.id = reader.readString(5);
    this.version = reader.readShort();
  }

  validate() {
    if (this.type !== 1) {
      throw new Error(`Unknown header type: ${this.type}`);
    }

    if (this.id !== "CD001") {
      throw new Error(`Unknown header id: ${this.id}`);
    }

    if (this.version !== 1) {
      throw new Error(`Unknown header version: ${this.version}`);
    }
  }
}

/*
typedef struct {
		unsigned char entryLength;		// Always 34 bytes
		unsigned char extLength;		// Always 0
		ISO_UINT_PAIR entryOffs;	// Should point to LBA 22
		ISO_UINT_PAIR entrySize;	// Size of entry extent
		ISO_DATESTAMP entryDate;	// Record date and time
		unsigned char flags;				// File flags
		unsigned char fileUnitSize;
		unsigned char interleaveGapSize;
		ISO_USHORT_PAIR volSeqNum;
		unsigned char identifierLen;		// 0x01
		unsigned char identifier;			// 0x00
	} ISO_ROOTDIR_HEADER;
    */
class IsoRootDirHeader {
  entryLength: number;
  extLength: number;
  entryOffset: number;
  entrySize: number;
  entryDate: Date;
  flags: number;
  fileUnitSize: number;
  interleaveGapSize: number;
  volSeqNumber: number;
  identifierLen: number;
  identifier: number;

  constructor(reader: BufferReader) {
    this.entryLength = reader.readByte();
    this.extLength = reader.readByte();
    this.entryOffset = reader.readIsoUintPair();
    this.entrySize = reader.readIsoUintPair();
    this.entryDate = reader.readIsoDate();
    this.flags = reader.readByte();
    this.fileUnitSize = reader.readByte();
    this.interleaveGapSize = reader.readByte();
    this.volSeqNumber = reader.readIsoUshortPair();
    this.identifierLen = reader.readByte();
    this.identifier = reader.readByte();
  }
}

/*
typedef struct {

		// ISO descriptor header
		ISO_DESCRIPTOR_HEADER header;
		// System ID (always PLAYSTATION)
		char systemID[32];
		// Volume ID (or label, can be blank or anything)
		char volumeID[32];
		// Unused null bytes
		unsigned char pad2[8];
		// Size of volume in sector units
		ISO_UINT_PAIR volumeSize;
		// Unused null bytes
		unsigned char pad3[32];
		// Number of discs in this volume set (always 1 for single volume)
		ISO_USHORT_PAIR volumeSetSize;
		// Number of this disc in volume set (always 1 for single volume)
		ISO_USHORT_PAIR volumeSeqNumber;
		// Size of sector in bytes (always 2048 bytes)
		ISO_USHORT_PAIR sectorSize;
		// Path table size in bytes (applies to all the path tables)
		ISO_UINT_PAIR pathTableSize;
		// LBA to Type-L path table
		unsigned int	pathTable1Offs;
		// LBA to optional Type-L path table (usually a copy of the primary path table)
		unsigned int	pathTable2Offs;
		// LBA to Type-L path table but with MSB format values
		unsigned int	pathTable1MSBoffs;
		// LBA to optional Type-L path table but with MSB format values (usually a copy of the main path table)
		unsigned int	pathTable2MSBoffs;
		// Directory entry for the root directory (similar to a directory entry)
		ISO_ROOTDIR_HEADER	rootDirRecord;
		// Volume set identifier (can be blank or anything)
		char	volumeSetIdentifier[128];
		// Publisher identifier (can be blank or anything)
		char	publisherIdentifier[128];
		// Data preparer identifier (can be blank or anything)
		char	dataPreparerIdentifier[128];
		// Application identifier (always PLAYSTATION)
		char	applicationIdentifier[128];
		// Copyright file in the file system identifier (can be blank or anything)
		char	copyrightFileIdentifier[37];
		// Abstract file in the file system identifier (can be blank or anything)
		char	abstractFileIdentifier[37];
		// Bibliographical file identifier in the file system (can be blank or anything)
		char	bibliographicFilelIdentifier[37];
		// Volume create date
		ISO_LONG_DATESTAMP volumeCreateDate;
		// Volume modify date
		ISO_LONG_DATESTAMP volumeModifyDate;
		// Volume expiry date
		ISO_LONG_DATESTAMP volumeExpiryDate;
		// Volume effective date
		ISO_LONG_DATESTAMP volumeEffectiveDate;
		// File structure version (always 1)
		unsigned char	fileStructVersion;
		// Padding
		unsigned char	dummy0;
		// Application specific data (says CD-XA001 at [141], the rest are null bytes)
		unsigned char	appData[512];
		// Padding
		unsigned char	pad4[653];

	} ISO_DESCRIPTOR;
    */
class IsoDescriptor {
  header: IsoDescriptorHeader;
  systemId: string;
  volumeId: string;

  volumeSize: number;

  volumeSetSize: number;
  volumeSeqNumber: number;

  sectorSize: number;
  pathTableSize: number;

  pathTable1Offset: number;
  pathTable2Offset: number;
  pathTable1OffsetMSB: number;
  pathTable2OffsetMSB: number;

  rootDirRecord: DirEntry;
  volumeSetIdentifier: string;
  publisherIdentifier: string;
  dataPreparererIdentifier: string;
  applicationIdentifier: string;
  copyrightFileIdentifier: string;
  abstractFileIdentifier: string;
  bibliographicFilelIdentifier: string;

  volumeCreateDate: Date;
  volumeModifyDate: Date;
  volumeExpiryDate: Date;
  volumeEffectiveDate: Date;

  fileStructVersion: number;

  appData: Buffer;

  constructor(data: Uint8Array) {
    const reader = new BufferReader(Buffer.from(data));

    this.header = new IsoDescriptorHeader(reader);

    this.header.validate();

    this.systemId = reader.readString(32);
    this.volumeId = reader.readString(32);

    reader.skip(8);

    this.volumeSize = reader.readIsoUintPair();

    reader.skip(32);

    this.volumeSetSize = reader.readIsoUshortPair();
    this.volumeSeqNumber = reader.readIsoUshortPair();
    this.sectorSize = reader.readIsoUshortPair();
    this.pathTableSize = reader.readIsoUintPair();

    this.pathTable1Offset = reader.readUint();
    this.pathTable2Offset = reader.readUint();
    this.pathTable1OffsetMSB = reader.readUint();
    this.pathTable2OffsetMSB = reader.readUint();

    this.rootDirRecord = new DirEntry(reader);

    this.volumeSetIdentifier = reader.readString(128);
    this.publisherIdentifier = reader.readString(128);
    this.dataPreparererIdentifier = reader.readString(128);
    this.applicationIdentifier = reader.readString(128);
    this.copyrightFileIdentifier = reader.readString(37);
    this.abstractFileIdentifier = reader.readString(37);
    this.bibliographicFilelIdentifier = reader.readString(37);

    this.volumeCreateDate = reader.readLongIsoDate();
    this.volumeModifyDate = reader.readLongIsoDate();
    this.volumeExpiryDate = reader.readLongIsoDate();
    this.volumeEffectiveDate = reader.readLongIsoDate();

    this.fileStructVersion = reader.readByte();
    reader.skip(1);
    this.appData = reader.readBytes(512);

    reader.skip(653);
  }
}

class PathTable {
  entries: PathTableEntry[] = [];

  constructor(reader: IsoReader, offset: number) {
    reader.seekToSector(offset);

    const data = reader.readData(2048);
    const br = new BufferReader(Buffer.from(data));

    while (true) {
      const entry = new PathTableEntry(br);

      if (entry.nameLength === 0) {
        break;
      }

      this.entries.push(entry);
    }
  }
}

/*
	/// Structure of an ISO path table entry
	struct ISO_PATHTABLE_ENTRY
	{
		unsigned char nameLength;	/// Name length (or 1 for the root directory)
		unsigned char extLength;	/// Number of sectors in extended attribute record
		unsigned int dirOffs;		/// Number of the first sector in the directory, as a double word
		short parentDirIndex;		/// Index of the directory record's parent directory
		// If nameLength is even numbered, a padding byte will be present after the entry name.
	};
*/

class PathTableEntry {
  nameLength: number;
  extLength: number;
  dirOffs: number;
  parentDirIndex: number;

  name: string;

  constructor(reader: BufferReader) {
    this.nameLength = reader.readByte();
    this.extLength = reader.readByte();
    this.dirOffs = reader.readInt();
    this.parentDirIndex = reader.readShort();

    if (this.nameLength > 0) {
      this.name = reader.readString(this.nameLength);
    } else {
      this.name = "";
    }

    if (this.nameLength % 2 !== 0) {
      reader.skip(1);
    }
  }
}

/*
	struct ISO_DIR_ENTRY
	{
		unsigned char entryLength;			// Directory entry length (variable, use for parsing through entries)
		unsigned char extLength;			// Extended entry data length (always 0)
		ISO_UINT_PAIR entryOffs;			// Points to the LBA of the file/directory entry
		ISO_UINT_PAIR entrySize;			// Size of the file/directory entry
		ISO_DATESTAMP entryDate;			// Date & time stamp of entry
		unsigned char flags;				// File flags (0x02 for directories, 0x00 for files)
		unsigned char fileUnitSize;			// Unit size (usually 0 even with Form 2 files such as STR/XA)
		unsigned char interleaveGapSize;	// Interleave gap size (usually 0 even with Form 2 files such as STR/XA)
		ISO_USHORT_PAIR volSeqNum;			// Volume sequence number (always 1)
		unsigned char identifierLen;		// Identifier (file/directory name) length in bytes
		// If identifierLen is even numbered, a padding byte will be present after the identifier text.
	};
    */
export class DirEntry {
  entryLength: number;
  entryOffset: number;
  entrySize: number;
  entryDate: Date;
  flags: number;
  fileUnitSize: number;
  interleaveGapSize: number;

  identifier: string;

  children: DirEntry[] = [];

  constructor(reader: BufferReader) {
    let currPos = reader.pos;
    this.entryLength = reader.readByte();
    if (reader.readByte() !== 0) throw new Error("Unexpected extLength");
    this.entryOffset = reader.readIsoUintPair();
    this.entrySize = reader.readIsoUintPair();
    this.entryDate = reader.readIsoDate();
    this.flags = reader.readByte();
    this.fileUnitSize = reader.readByte();
    this.interleaveGapSize = reader.readByte();
    if (reader.readIsoUshortPair() !== 1)
      throw new Error("Unexpected volSeqNumber");

    const identifierLength = reader.readByte();

    if (identifierLength > 0) {
      this.identifier = reader.readString(identifierLength);
    } else {
      this.identifier = "";
    }

    if (identifierLength % 2 === 0) {
      reader.skip(1);
    }

    // TODO: Parse remaining header stuff
    reader.skip(this.entryLength - (reader.pos - currPos));
  }

  get isFolder() {
    return (this.flags & 2) !== 0;
  }
}

class IsoReader {
  private currentSector = 0;
  private currentByte = 0;

  constructor(private buffer: Buffer) {}

  reset() {
    this.currentSector = 0;
    this.currentByte = 0;
  }

  seekToSector(sector: number) {
    this.currentSector = sector;
    this.currentByte = 0;
  }

  readData(length: number): Uint8Array {
    const data = new Uint8Array(length);
    let bytesWritten = 0;
    let bytesRemaining = length;

    while (bytesRemaining) {
      const sector = new SectorM2F1(
        this.buffer.slice(this.sectorOffset, this.sectorOffset + CD_SECTOR_SIZE)
      );

      const bytesToRead = Math.min(
        sector.data.length - this.currentByte,
        bytesRemaining
      );

      for (let i = 0; i < bytesToRead; i++) {
        data[i + bytesWritten] = sector.data[i];
      }

      bytesWritten += bytesToRead;
      bytesRemaining -= bytesToRead;

      this.currentSector += 1;
      this.currentByte = 0;
    }

    return data;
  }

  readXAData(length: number): Uint8Array {
    const data = new Uint8Array(length);

    let bytesWritten = 0;
    let bytesRemaining = length;

    while (bytesRemaining) {
      const sector = new SectorM2F2(
        this.buffer.slice(this.sectorOffset, this.sectorOffset + CD_SECTOR_SIZE)
      );

      const bytesToRead = Math.min(
        DATA_SIZE - this.currentByte,
        bytesRemaining
      );

      for (let i = 0; i < bytesToRead; i++) {
        data[i + bytesWritten] = sector.data[i];
      }

      bytesWritten += bytesWritten;
      bytesRemaining -= bytesToRead;

      this.currentSector += 1;
      this.currentByte = 0;
    }

    return data;
  }

  writeData(buffer: Buffer) {
    let bytesWritten = 0;

    while (bytesWritten < buffer.byteLength) {
      const sector = new SectorM2F1(
        this.buffer.slice(this.sectorOffset, this.sectorOffset + CD_SECTOR_SIZE)
      );

      const bytesToWriteInThisSector = Math.min(
        sector.data.length - this.currentByte,
        buffer.byteLength - bytesWritten
      );

      for (let i = 0; i < bytesToWriteInThisSector; i++) {
        sector.data[this.currentByte + i] = buffer[bytesWritten + i];
      }

      bytesWritten += bytesToWriteInThisSector;

      this.currentSector += 1;
      this.currentByte = 0;
    }
  }

  readDir(offset: number): DirEntry[] {
    this.seekToSector(offset);

    const entries = [];

    // TODO: Handle dirs longer than one sector
    const data = this.readData(2048);
    const br = new BufferReader(Buffer.from(data));

    while (br.peekByte() !== 0) {
      const entry = new DirEntry(br);

      if (
        entry.entryOffset !== offset &&
        entry.identifier !== "" &&
        entry.identifier !== "\u0000" &&
        entry.identifier !== "\u0001"
      ) {
        entries.push(entry);
      }
    }

    for (const e of entries.filter((e) => e.isFolder)) {
      e.children = this.readDir(e.entryOffset);
    }

    return entries;
  }

  get sectorOffset() {
    return this.currentSector * CD_SECTOR_SIZE;
  }
}

export class IsoFile {
  public license: Uint8Array | null = null;
  public header: IsoDescriptor | null = null;
  public pathTable: PathTable | null = null;

  private reader: IsoReader;

  constructor(public image: Buffer) {
    this.reader = new IsoReader(image);

    this.readLicense();
    this.readDescriptor();

    if (this.header != null) {
      this.pathTable = new PathTable(
        this.reader,
        this.header?.pathTable1Offset
      );

      this.header.rootDirRecord.children = this.reader.readDir(
        this.header.rootDirRecord.entryOffset
      );
    }
  }

  readLicense() {
    this.reader.seekToSector(0);

    this.license = this.reader.readXAData(28032);
  }

  readDescriptor() {
    this.reader.seekToSector(16);

    const header = this.reader.readData(2048);

    this.header = new IsoDescriptor(header);
  }

  public getFileEntry(name: string): DirEntry {
    if (!this.header) {
      throw new Error("Unable to get file before loading header");
    }

    name += ';1';

    const parts = name.split("/").filter((e) => e !== "");

    let currentEntry = this.header.rootDirRecord;

    for (const part of parts) {
      const entry = currentEntry.children.find(
        (e) => e.identifier.toLowerCase() === part.toLowerCase()
      );

      if (!entry) {
        throw new Error(`Unable to find entry ${part}`);
      }

      currentEntry = entry;
    }

    return currentEntry;
  }

  public getFile(name: string): Buffer {
    const entry = this.getFileEntry(name);

    this.reader.seekToSector(entry.entryOffset);

    return Buffer.from(this.reader.readData(entry.entrySize));
  }

  public replaceFile(name: string, data: Buffer) {
    const entry = this.getFileEntry(name);

    const capacity = Math.ceil(entry.entrySize / 2048) * 2048;

    if (capacity < data.byteLength) {
      throw new Error("Unable to fit data in space");
    }

    // TODO: Update length
    this.reader.seekToSector(entry.entryOffset);
    this.reader.writeData(data);
  }
}
