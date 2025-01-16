import { fieldWidth, fieldHeight } from "../components/FieldImage";

/**
 * @param {number} x - The x coordinant of the action in figma
 * @param {number} y - The y coordinant of the action in figma
 * @param {number} width - The width of the action in figma
 * @param {number} height - The height of the action in figma
 * @returns {[number, number, number, number]} The resulting edge insets from the coordinants
 */

export default function calculatePositionBasedInsets(
  x: number,
  y: number,
  width: number,
  height: number,
): [number, number, number, number] {
  const barHeight = 59;

  const left = x / fieldWidth;
  const top = (y - barHeight) / fieldHeight;

  const right = 1 - (x + width) / fieldWidth;
  const bottom = 1 - (y - barHeight + height) / fieldHeight;

  return [top, right, bottom, left];
}
