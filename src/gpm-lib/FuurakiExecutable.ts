export class FuurakiExecutable {
    constructor(private file: Buffer) {

    }

    public datKey() {
        return this.file.slice(0x79288);
    }
}