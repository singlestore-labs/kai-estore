import path from "path";
import { fileURLToPath } from "url";
import util from "util";
import differenceInMilliseconds from "date-fns/differenceInMilliseconds";
import humanizeDuration from "humanize-duration";

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

export async function withDuration<T extends AnyFunction>(callback: T) {
  const durationHumanizer = humanizeDuration.humanizer({
    spacer: "",
    language: "short",
    languages: {
      short: {
        m: () => "m",
        s: (count) => (count?.toString()[0] === "0" ? "ms" : "s"),
        ms: () => "ms"
      }
    }
  });

  function splitDuration(duration: string, ms: number) {
    const _duration = duration.match(/^0./) ? duration.split(/^0./)[1] : duration;
    const unit = _duration.match(/[a-zA-Z]+/g)?.[0] ?? "";
    const value = unit === "ms" ? ms : _duration.split(unit)[0];

    return [value, unit] as const;
  }

  const startTime = performance.now();
  const result = await callback();
  const endTime = performance.now();
  const ms = Math.abs(differenceInMilliseconds(startTime, endTime));
  const durationParts = splitDuration(durationHumanizer(ms), ms);

  return [result, ms, ...durationParts] as [ReturnType<T>, number, ...ReturnType<typeof splitDuration>];
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
