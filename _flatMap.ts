import _createEndedPromise from "./_createEndedPromise.ts";

async function* flatMap<T, U>(
  asyncIterable: AsyncIterable<T>,
  flatMapper: (item: T, index: number) => Promise<Iterable<U> | AsyncIterable<U>>,
): AsyncGenerator<U, void, undefined> {
  const resolvedValues = new Map<number, Iterable<U> | AsyncIterable<U>>();
  let callback: () => void;
  const onResolveValueRef = {
    onResolveValue: (index: number, item: AsyncIterable<U>) => {
      resolvedValues.set(index, item);
      callback();
    },
  };
  let newlyResolvedPromise: Promise<void> = new Promise((res) => {
    callback = res;
  });
  let nextResolvingIndex = 0;
  const endedPromise: Promise<true> = _createEndedPromise(asyncIterable, flatMapper, onResolveValueRef);

  while (1) {
    const hasEnded = await Promise.race([newlyResolvedPromise, endedPromise]);
    if (hasEnded) {
      break;
    }
    newlyResolvedPromise = new Promise((res) => {
      callback = res;
    });
    while (resolvedValues.has(nextResolvingIndex)) {
      yield* resolvedValues.get(nextResolvingIndex) as any;
      nextResolvingIndex++;
    }
  }
}

export default flatMap;
