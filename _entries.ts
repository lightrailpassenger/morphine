import { ValidIterable } from "./mod.ts";

async function* entries<T>(
  asyncIterable: ValidIterable<T>,
): AsyncGenerator<[number, T], void, void> {
  let index = 0;
  for await (const item of asyncIterable) {
    yield [index, item];
    index++;
  }
}

export default entries;
