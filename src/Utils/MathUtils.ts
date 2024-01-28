import { Point, Rect, Size } from "../types";

const isInsideRect = (point: Point, rect: Rect) => (
  point.x >= rect.x &&
  point.x <= (rect.x + rect.width) &&
  point.y >= rect.y &&
  point.y <= rect.y + rect.height
);

const clamp = (value: number, min: number, max: number) => (
  Math.min(max, Math.max(value, min))
);

const isNearPoint = (point1: Point, point2:Point, threshold: number) => (
  (Math.abs(point1.x - point2.x) <= threshold) &&
  (Math.abs(point1.y - point2.y) <= threshold)
);

const convertToCanvasPoint = (resolution: Size, targetPoint: Point, canvas: HTMLCanvasElement) => {
  const rect = canvas.getBoundingClientRect();

  return {
    x: targetPoint.x * resolution.width / rect.width,
    y: targetPoint.y * resolution.height / rect.height
  } satisfies Point
};

const secondsToReadableText = (value:number, includeMilliseconds: boolean = false) => {
  const secondsTotal = Math.floor(value);
  const milliseconds = Math.floor((value - secondsTotal) * 100);
  const minutes = Math.floor(secondsTotal / 60);
  const seconds = secondsTotal - (minutes * 60);
  let text = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  if (includeMilliseconds){
    text += `:${milliseconds.toString().padStart(2, '0')}`
  }
  return text;
};

export const MathUtils = {
  clamp,
  isNearPoint,
  isInsideRect,
  convertToCanvasPoint,
  secondsToReadableText
};