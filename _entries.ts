async function* entries<T>(
  asyncIterable: AsyncIterable<T>,
): AsyncGenerator<[number, T], void, void> {
  let index = 0;
  for await (const item of asyncIterable) {
    yield [index, item];
    index++;
  }
}

export default entries;
