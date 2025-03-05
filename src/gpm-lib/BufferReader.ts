import { Buffer } from "buffer";

export class BufferReader {
  pos: number = 0;

  constructor(private buffer: Buffer) {}

  reset() {
    this.pos = 0;
  }

  peekByte(): number {
    return this.buffer.readUInt8(this.pos);
  }

  readByte(): number {
    const b = this.buffer.readUInt8(this.pos);
    this.pos += 1;

    return b;
  }

  readSignedByte(): number {
    const b = this.buffer.readInt8(this.pos);
    this.pos += 1;

    return b;
  }

  readShort(): number {
    const s = this.buffer.readInt16LE(this.pos);
    this.pos += 2;

    return s;
  }

  readInt(): number {
    const s = this.buffer.readInt32LE(this.pos);
    this.pos += 4;

    return s;
  }

  readUint(): number {
    const s = this.buffer.readUInt32LE(this.pos);
    this.pos += 4;

    return s;
  }

  readBytes(length: number): Buffer {
    const b = this.buffer.slice(this.pos, this.pos + length);
    this.pos += length;

    return b;
  }

  readString(length: number): string {
    const s = this.buffer.toString("ascii", this.pos, this.pos + length);
    this.pos += length;

    return s.trim();
  }

  readIsoUshortPair(): number {
    const n = this.readShort();
    this.readShort();

    return n;
  }

  readIsoUintPair(): number {
    const n = this.readUint();
    this.readUint();

    return n;
  }

  readIsoDate(): Date {
    const y = 1900 + this.readByte();
    const m = this.readByte();
    const d = this.readByte();
    const hour = this.readByte();
    const min = this.readByte();
    const second = this.readByte();
    /*const offset =*/ this.readSignedByte();

    return new Date(y, m, d, hour, min, second, 0);
  }

  /*
  /// Structure of a long date time format, specified in Section 8.4.26.1 of ECMA 119
	struct ISO_LONG_DATESTAMP
	{
		char		year[4];	/// year from I to 9999
		char		month[2];	/// month of the year from 1 to 12
		char		day[2];		/// day of the month from 1 to 31
		char		hour[2];	/// hour of the day from 0 to 23
		char		minute[2];	/// minute of the hour from 0 to 59
		char		second[2];	/// second of the minute from 0 to 59
		char		hsecond[2];	/// hundredths of a second
		signed char	GMToffs;	/// Greenwich Mean Time offset
	};*/

  readLongIsoDate(): Date {
    const y = this.readString(4);
    const month = this.readString(2);
    const day = this.readString(2);
    const hour = this.readString(2);
    const min = this.readString(2);
    const second = this.readString(2);
    const hsecond = this.readString(2);
    /*const off = */ this.readByte();

    return new Date(
      parseInt(y),
      parseInt(month),
      parseInt(day),
      parseInt(hour),
      parseInt(min),
      parseInt(second),
      parseInt(hsecond) * 10
    );
  }

  skip(length: number) {
    this.pos += length;
  }

  get length() {
    return this.buffer.byteLength;
  }
}
