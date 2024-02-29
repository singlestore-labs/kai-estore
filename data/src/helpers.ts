import path from "path";
import { fileURLToPath } from "url";
import randomInt from "random-int";

export function getDirname(moduleUrl: string) {
  return path.dirname(fileURLToPath(moduleUrl));
}

export function getRandomDate(from: Date | string, to: Date | string) {
  const _from = new Date(from).getTime();
  return new Date(_from + Math.random() * (new Date(to).getTime() - _from));
}

export function getUniqueArrayValues<T extends Array<any>>(value: T) {
  return value.filter((value, index, self) => self.indexOf(value) === index);
}

export function getUniqueFieldValues<T extends Array<object>, _V = T[number]>(objects: T) {
  return objects.reduce((values, object) => {
    return Object.entries(object).reduce((innerValues, [key, value]) => {
      const _value = !Array.isArray(value) ? [value] : value;
      return {
        ...innerValues,
        [key]: getUniqueArrayValues([...(innerValues[key as keyof typeof innerValues] || []), ..._value])
      };
    }, values);
  }, {}) as { [K in keyof _V]: _V[K] extends Array<any> ? _V[K] : Array<_V[K]> };
}

export function getRandomIndex(length: number, lastIndex?: number): number {
  const _lastIndex = lastIndex || length;
  const index = randomInt(0, length - 1);
  return _lastIndex === index ? getRandomIndex(length, _lastIndex) : index;
}

export function createRandomIndexClosure(length: number, lastIndex?: number): () => number {
  let _lastIndex = lastIndex || length;

  return () => {
    _lastIndex = getRandomIndex(length, _lastIndex);
    return _lastIndex;
  };
}

export function generateDuplicates<T extends Array<any>>(
  objects: T,
  length: number,
  customizer?: (object: T[number], i: number) => T[number]
) {
  const randomIndex = createRandomIndexClosure(objects.length);
  const result = [];

  for (const i of Array.from({ length }, (_, index) => index)) {
    const object = objects[randomIndex()];
    result.push(customizer?.(object, i) || object);
    process.stdout.write(`\r${i + 1}/${length} generated${i === length - 1 ? "\n" : ""}`);
  }

  return result;
}

export function calcAverage(numbers: number[]) {
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

function unwind<T extends Record<any, any>[], K extends keyof T[number]>(array: T, key: K) {
  const unwoundArray = [];

  for (const [i, obj] of array.entries()) {
    const items: any = obj[key];
    if (Array.isArray(items)) {
      for (const item of items) {
        unwoundArray.push({ ...obj, [key]: item });
      }
    } else {
      unwoundArray.push({ ...obj });
    }

    process.stdout.write(`\r${i + 1}/${array.length} unwound${i === array.length - 1 ? "\n" : ""}`);
  }

  return unwoundArray;
}

export function unwindObjects<T extends Array<Record<any, any>>, K extends Array<keyof T[number]>>(
  objects: T,
  customizer?: (object: T[number]) => T[number],
  skipKeys?: K
) {
  const arrayKeys = Object.entries(objects[0]).reduce((keys, [key, value]) => {
    return Array.isArray(value) ? [...keys, key] : keys;
  }, [] as Array<string>);

  let unwoundObjects: any[] = [];

  for (const key of arrayKeys) {
    if (skipKeys?.includes(key)) continue;
    unwoundObjects = unwind(unwoundObjects.length ? unwoundObjects : objects, key);
  }

  const result = unwoundObjects.length ? unwoundObjects : objects;

  if (customizer) {
    for (let object of result) {
      object = customizer(object) ?? object;
    }
  }

  return result;
}

export async function processAsChunks<T extends any[]>(
  array: T,
  onChunk: (chunk: T) => Promise<void>,
  chunkSize = 100_000
) {
  const total = array.length;
  for (let i = 0; i < total; i += chunkSize) {
    await onChunk(array.slice(i, i + chunkSize) as T);
  }
}
