export const formatHex = (x: number) => {
    const s = x.toString(16);

    if (s.length < 2) {
        return "0" + s;
    }

    return s;
}