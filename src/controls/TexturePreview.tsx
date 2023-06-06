import { observer } from "mobx-react";
import React, { useEffect, useRef, useState } from "react";
import { Texture } from "../gpm-lib/BinModule";

export enum TextureType {
  FullColor,
  EightBitClut,
  FourBitClut,
}

const greyClut = new Uint16Array(
  new Array(256).fill(0).map((_, i) => {
    const level = Math.floor(0b11111 * (i / 256));

    return level | (level << 5) | (level << 10);
  })
);

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
  0x4b0c: 24,
};

export const TexturePreview = observer<
  React.FC<{
    texture: Texture;
    type: TextureType;
    clut?: Uint16Array;
    scale: number;
  }>
>(({ texture, type, clut, scale }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWidth = 1020 * scale;
  const canvasHeight = 250 * scale;

  const validSizes: {
    text: string;
    w: number;
    h: number;
  }[] = [];

  for (let w = 0; w < texture.data.length; w++) {
    if (texture.data.length % w === 0) {
      let h = texture.data.length / w;
      validSizes.push({
        text: `${w} x ${h}`,
        w,
        h,
      });
    }
  }

  let [selectedSizeIndex, setSelectedSizeIndex] = useState("0");

  useEffect(() => {
    if (texture) {
      const i = validSizes.findIndex(
        (vs) => vs.h === texture.h && vs.w === texture.w * 2
      );

      if (i !== -1) {
        setSelectedSizeIndex(i.toString());
      } else {
        setSelectedSizeIndex(Math.ceil(validSizes.length / 2).toString());
      }
    }
  }, [texture]);

  useEffect(() => {
    if (!texture || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    context.clearRect(0, 0, canvasWidth, canvasHeight);

    const size = validSizes[parseInt(selectedSizeIndex)];

    const width = size ? size.w : 1;
    const height = size ? size.h : 1;
    /*type === TextureType.FullColor
        ? texture.length / width / 2
        : type === TextureType.EightBitClut
        ? texture.length / width
        : (texture.length / width) * 2;*/

    const activeClut = clut || greyClut;

    const clutStyles: string[] = [];

    if (type === TextureType.EightBitClut) {
      for (let i = 0; i < 256; i++) {
        const pixel = activeClut[i];

        const r = pixel & 0b0000000000011111;
        const g = (pixel & 0b0000001111100000) >>> 5;
        const b = (pixel & 0b0111110000000000) >>> 10;
        const t = (pixel & 0b1000000000000000) !== 0;

        clutStyles.push(`rgba(${(r / 0x1f) * 256}, ${(g / 0x1f) * 256}, ${(b / 0x1f) * 256}, ${t ? 0 : 255})`);
      }
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelOffset = y * width + x;

        context.fillStyle = clutStyles[texture.data[pixelOffset]];
        context.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  }, [texture, selectedSizeIndex]);

  return (
    <div>
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />

      <select
        value={selectedSizeIndex}
        onChange={(e) => setSelectedSizeIndex(e.currentTarget.value)}
      >
        {validSizes.map((vs, i) => (
          <option key={i} value={i.toString()}>
            {vs.text}
          </option>
        ))}
      </select>
    </div>
  );
});

TexturePreview.defaultProps = {
  scale: 2,
};
