meta:
  id: evdatabin
  title: Gunparade March EVDATA
  file-extension: bin
  license: CC0-1.0
  endian: le
  encoding: sjis
types:
  ev_offset_entry:
    seq:
      - id: start
        type: u2
      - id: end
        type: u2
    instances:
      data:
        type: ev_offset_data
        pos: start * 0x800
        size: (end - start) * 0x800 
  ev_offset_data:
    seq:
      - id: unk1
        type: u2
      - id: unk2
        type: u2
      - id: start
        type: u2
      - id: content
        type: str
        size-eos: true
  ev_offsets:
    seq:
      - id: count
        type: u2
      - id: entries
        type: ev_offset_entry
        repeat: expr
        repeat-expr: count
  file_table:
    seq:
      - id: magic
        size: 16
      - id: file_table_entries
        type: file_table_entry
        repeat: expr
        repeat-expr: 1800
  file_table_entry:
    seq:
      - id: zero
        type: u4
      - id: unk2
        type: u4
      - id: unk3
        type: u4
      - id: unk4
        type: u4
      - id: name
        type: str
        size: 16
instances:
  file_table:
    type: file_table
  evoffsets:
    type: ev_offsets
    pos: 0x01c000
