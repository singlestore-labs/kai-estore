import path from "path";
import { fileURLToPath } from "url";
import util from "util";
import differenceInMilliseconds from "date-fns/differenceInMilliseconds";

import { AnyFunction } from "@/types/common";

export function inspect(data: any) {
  console.log(util.inspect(data, { showHidden: false, depth: null, colors: true }));
}

export function getDirname(moduleUrl: string) {
  return path.dirname(fileURLToPath(moduleUrl));
}

export function sliceIntoChunks<T extends any[]>(array: T, chunkSize: number) {
  const result = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    result.push(chunk);
  }

  return result as T[];
}

export function calcAverage(numbers: number[]) {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
}

function formatMS(milliseconds: number) {
  let formattedTime: string;
  let unit: string;

  function formatMilliseconds(milliseconds: number): string {
    return Math.floor((milliseconds % 1000) / 10)
      .toString()
      .padStart(2, "0");
  }

  function formatSeconds(seconds: number): string {
    return seconds.toString().padStart(2, "0");
  }

  if (milliseconds < 1000) {
    formattedTime = milliseconds.toString();
    unit = "ms";
  } else if (milliseconds < 60000) {
    const seconds = Math.floor(milliseconds / 1000);
    const ms = formatMilliseconds(milliseconds);
    formattedTime = `${seconds}.${ms}`;
    unit = "s";
  } else {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = formatSeconds(Math.floor((milliseconds % 60000) / 1000));
    formattedTime = `${minutes}.${seconds}`;
    unit = "m";
  }

  return [formattedTime, unit] as const;
}

export async function withDuration<T extends AnyFunction>(callback: T) {
  const startTime = performance.now();
  const result = await callback();
  const endTime = performance.now();
  const ms = Math.abs(differenceInMilliseconds(startTime, endTime));
  return [result, ms, ...formatMS(ms)] as const;
}

export async function processAsChunks<T extends any[]>(
  array: T,
  onChunk: (chunk: T) => Promise<void>,
  chunkSize = 10_000
) {
  const total = array.length;
  for (let i = 0; i < total; i += chunkSize) {
    await onChunk(array.slice(i, i + chunkSize) as T);
  }
}
