import { observer } from "mobx-react";
import React, { useEffect, useRef, useState } from "react";
import { read_short } from "../gpm-lib/helpers";

export enum TextureType {
    FullColor,
    EightBitClut,
    FourBitClut
};

const greyClut = new Uint16Array(new Array(256).fill(0).map((_, i) => {
    const level = Math.floor(0b11111 * (i / 256));

    return level | (level << 5) | (level << 10);
}));

const textureDimensions = {
    0xa00a: 0xe0,
    0xa00b: 128,
    0xa00d: 86,
    0xa00f: 156,
    0xa010: 160,
    0xa013: 160,
    0x900: 192,
    0x901: 128,
    0x7c16: 64,
    0x7c17: 54,
    0x7c25: 64,
    0x7c26: 64,
    0x7c2f: 50,
    0x4b0c: 24
}

export const TexturePreview = observer<React.FC<{texture: Uint8Array, type: TextureType, clut?: Uint16Array }>>(({ texture, type, clut }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasWidth = 650;
    const canvasHeight = 500;
    let [width, setWidth] = useState(184);
    const scale = 2;

    useEffect(() => {
        if (!texture || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;
        
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        const height = 
            type === TextureType.FullColor ? texture.length / width / 2 :
            type === TextureType.EightBitClut ? texture.length / width :
            texture.length / width * 2;
    
        const p = context.createImageData(scale, scale);
        const pixelData = p.data;
        const activeClut = clut || greyClut;
        
        for (let y = 0 ; y < height ; y++) {
            for (let x = 0 ; x < width ; x++) {
                let pixel: number = 0;

                // Each pixel is 16 bits and full color
                if (type === TextureType.FullColor) {
                    const pixelOffset = ((y * width) + x) * 2;
                    pixel = read_short(texture, pixelOffset);
                } else if (type === TextureType.EightBitClut) {
                    const pixelOffset = ((y * width) + x);

                    pixel = activeClut[texture[pixelOffset]];
                }

                if (pixel === undefined) {
                    continue;
                }

                const r = pixel & 0b0000000000011111;
                const g = (pixel & 0b0000001111100000) >>> 5;
                const b = (pixel & 0b0111110000000000) >>> 10;
                const t = (pixel & 0b1000000000000000) !== 0;

                if (!t) {
                    for (let po = 0 ; po < scale * scale * 4 ; po += 4) {
                        pixelData[po] = r / 0x1f * 256;
                        pixelData[po + 1] = g / 0x1f * 256;
                        pixelData[po + 2] = b / 0x1f * 256;
                        pixelData[po + 3] = 256;
                    }
                }

                context.putImageData(p, x * scale, y * scale);
            }
        }
    });
    
    return (
        <div>
            <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
            <input type="number" value={width} onChange={(e) => setWidth(parseInt(e.currentTarget.value))} style={{float: 'right'}}/>
        </div>
    )
});