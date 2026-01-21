type FigmaDimensions = {
  x: number;
  y: number;
  height: number;
  width: number;
};

const FIGMA_FIELD_DIMENSIONS = { width: 677, height: 337 };

export const figmaDimensionsToFieldInsets: (
  dims: FigmaDimensions,
) => [number, number, number, number] = (dims) => {
  const { width: w, height: h } = FIGMA_FIELD_DIMENSIONS;

  return [
    dims.y / h,
    (w - (dims.x + dims.width)) / w,
    (h - (dims.y + dims.height)) / h,
    dims.x / w,
  ];
};
