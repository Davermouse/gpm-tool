import { GPMISO } from "./GpmIso";
import { GPMStrings } from "./Strings";

interface TranslatedString {
    id: string;
    value: string;
}

const translatedStrings = [
    {
        id: "FINAMISC::800f5358",
        value: "$w\\4In 1945$n$w　全世界規模で行われた人類同士の戦い、$nすなわち第２次世界大戦は、意外な形で$n終幕を迎えることとなった。$w$w$w$z"
    }
]

export default class StringPatcher {
    constructor(private iso: GPMISO) {

    }

    public TranslateStrings() {
        for (let s of translatedStrings) {
            this.translateString(s);
        }
    }

    private translateString(ts: TranslatedString) {
        let s = GPMStrings.find(gpms => gpms.address == ts.id);

        if (!s) {
            console.warn(`Unable to find string ${ts.id}`);

            var file = this.iso.moduleFiles.find("")
        }
    }
}