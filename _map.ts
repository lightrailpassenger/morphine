import _createEndedPromise from "./_createEndedPromise.ts";

async function* map<T, U>(
  asyncIterable: AsyncIterable<T>,
  mapper: (item: T, index: number) => Promise<U>,
): AsyncGenerator<U, void, void> {
  const resolvedValues = new Map<number, U>();
  let callback: () => void;
  const onResolveValueRef = {
    onResolveValue: (index: number, item: U) => {
      resolvedValues.set(index, item);
      callback();
    },
  };
  let newlyResolvedPromise: Promise<void> = new Promise((res) => {
    callback = res;
  });
  let nextResolvingIndex = 0;
  const endedPromise: Promise<true> = _createEndedPromise(asyncIterable, mapper, onResolveValueRef);

  while (1) {
    const hasEnded = await Promise.race([newlyResolvedPromise, endedPromise]);
    if (hasEnded) {
      break;
    }
    newlyResolvedPromise = new Promise((res) => {
      callback = res;
    });
    while (resolvedValues.has(nextResolvingIndex)) {
      yield resolvedValues.get(nextResolvingIndex) as U;
      nextResolvingIndex++;
    }
  }
}

export default map;
