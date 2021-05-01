// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

const KaitaiStream = require('kaitai-struct/KaitaiStream');

export  function Evdatabin(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;
    this._debug = {};

  }
  Evdatabin.prototype._read = function() {
  }

  var EvOffsets = Evdatabin.EvOffsets = (function() {
    function EvOffsets(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;
      this._debug = {};

    }
    EvOffsets.prototype._read = function() {
      this._debug.count = { start: this._io.pos, ioOffset: this._io.byteOffset };
      this.count = this._io.readU2le();
      this._debug.count.end = this._io.pos;
      this._debug.entries = { start: this._io.pos, ioOffset: this._io.byteOffset };
      this.entries = new Array(this.count);
      this._debug.entries.arr = new Array(this.count);
      for (var i = 0; i < this.count; i++) {
        this._debug.entries.arr[i] = { start: this._io.pos, ioOffset: this._io.byteOffset };
        var _t_entries = new EvOffsetEntry(this._io, this, this._root);
        _t_entries._read();
        this.entries[i] = _t_entries;
        this._debug.entries.arr[i].end = this._io.pos;
      }
      this._debug.entries.end = this._io.pos;
    }

    return EvOffsets;
  })();

  var EvOffsetData = Evdatabin.EvOffsetData = (function() {
    function EvOffsetData(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;
      this._debug = {};

    }
    EvOffsetData.prototype._read = function() {
      this._debug.unk1 = { start: this._io.pos, ioOffset: this._io.byteOffset };
      this.unk1 = this._io.readU2le();
      this._debug.unk1.end = this._io.pos;
      this._debug.unk2 = { start: this._io.pos, ioOffset: this._io.byteOffset };
      this.unk2 = this._io.readU2le();
      this._debug.unk2.end = this._io.pos;
      this._debug.start = { start: this._io.pos, ioOffset: this._io.byteOffset };
      this.start = this._io.readU2le();
      this._debug.start.end = this._io.pos;
      this._debug.content = { start: this._io.pos, ioOffset: this._io.byteOffset };
      this.content = this._io.readBytesFull();
      this._debug.content.end = this._io.pos;
    }

    return EvOffsetData;
  })();

  var EvOffsetEntry = Evdatabin.EvOffsetEntry = (function() {
    function EvOffsetEntry(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;
      this._debug = {};

    }
    EvOffsetEntry.prototype._read = function() {
      this._debug.start = { start: this._io.pos, ioOffset: this._io.byteOffset };
      this.start = this._io.readU2le();
      this._debug.start.end = this._io.pos;
      this._debug.end = { start: this._io.pos, ioOffset: this._io.byteOffset };
      this.end = this._io.readU2le();
      this._debug.end.end = this._io.pos;
    }
    Object.defineProperty(EvOffsetEntry.prototype, 'data', {
      get: function() {
        if (this._m_data !== undefined)
          return this._m_data;
        var _pos = this._io.pos;
        this._io.seek((this.start * 2048));
        this._debug._m_data = { start: this._io.pos, ioOffset: this._io.byteOffset };
        this._raw__m_data = this._io.readBytes(((this.end - this.start) * 2048));
        var _io__raw__m_data = new KaitaiStream(this._raw__m_data);
        this._m_data = new EvOffsetData(_io__raw__m_data, this, this._root);
        this._m_data._read();
        this._debug._m_data.end = this._io.pos;
        this._io.seek(_pos);
        return this._m_data;
      }
    });

    return EvOffsetEntry;
  })();

  var FileTableEntry = Evdatabin.FileTableEntry = (function() {
    function FileTableEntry(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;
      this._debug = {};

    }
    FileTableEntry.prototype._read = function() {
      this._debug.zero = { start: this._io.pos, ioOffset: this._io.byteOffset };
      this.zero = this._io.readU4le();
      this._debug.zero.end = this._io.pos;
      this._debug.unk2 = { start: this._io.pos, ioOffset: this._io.byteOffset };
      this.unk2 = this._io.readU4le();
      this._debug.unk2.end = this._io.pos;
      this._debug.unk3 = { start: this._io.pos, ioOffset: this._io.byteOffset };
      this.unk3 = this._io.readU4le();
      this._debug.unk3.end = this._io.pos;
      this._debug.unk4 = { start: this._io.pos, ioOffset: this._io.byteOffset };
      this.unk4 = this._io.readU4le();
      this._debug.unk4.end = this._io.pos;
      this._debug.name = { start: this._io.pos, ioOffset: this._io.byteOffset };
      this.name = KaitaiStream.bytesToStr(this._io.readBytes(16), "sjis");
      this._debug.name.end = this._io.pos;
    }

    return FileTableEntry;
  })();

  var FileTable = Evdatabin.FileTable = (function() {
    function FileTable(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;
      this._debug = {};

    }
    FileTable.prototype._read = function() {
      this._debug.magic = { start: this._io.pos, ioOffset: this._io.byteOffset };
      this.magic = this._io.readBytes(16);
      this._debug.magic.end = this._io.pos;
      this._debug.fileTableEntries = { start: this._io.pos, ioOffset: this._io.byteOffset };
      this.fileTableEntries = new Array(1800);
      this._debug.fileTableEntries.arr = new Array(1800);
      for (var i = 0; i < 1800; i++) {
        this._debug.fileTableEntries.arr[i] = { start: this._io.pos, ioOffset: this._io.byteOffset };
        var _t_fileTableEntries = new FileTableEntry(this._io, this, this._root);
        _t_fileTableEntries._read();
        this.fileTableEntries[i] = _t_fileTableEntries;
        this._debug.fileTableEntries.arr[i].end = this._io.pos;
      }
      this._debug.fileTableEntries.end = this._io.pos;
    }

    return FileTable;
  })();
  Object.defineProperty(Evdatabin.prototype, 'fileTable', {
    get: function() {
      if (this._m_fileTable !== undefined)
        return this._m_fileTable;
      this._debug._m_fileTable = { start: this._io.pos, ioOffset: this._io.byteOffset };
      this._m_fileTable = new FileTable(this._io, this, this._root);
      this._m_fileTable._read();
      this._debug._m_fileTable.end = this._io.pos;
      return this._m_fileTable;
    }
  });
  Object.defineProperty(Evdatabin.prototype, 'evoffsets', {
    get: function() {
      if (this._m_evoffsets !== undefined)
        return this._m_evoffsets;
      var _pos = this._io.pos;
      this._io.seek(114688);
      this._debug._m_evoffsets = { start: this._io.pos, ioOffset: this._io.byteOffset };
      this._m_evoffsets = new EvOffsets(this._io, this, this._root);
      this._m_evoffsets._read();
      this._debug._m_evoffsets.end = this._io.pos;
      this._io.seek(_pos);
      return this._m_evoffsets;
    }
  });