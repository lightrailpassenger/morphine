import _createEndedPromise from "./_createEndedPromise.ts";
import { ValidIterable } from "./mod.ts";

async function reduce<T, U>(
  asyncIterable: ValidIterable<T>,
  reducer: (acc: U, cur: T, index: number) => Promise<U>,
  initialValue: U,
): Promise<U> {
  const resolvedValues = new Map<number, T>();
  let callback: () => void;
  const onResolveValueRef = {
    onResolveValue: (index: number, item: T) => {
      resolvedValues.set(index, item);
      callback();
    },
  };
  let newlyResolvedPromise: Promise<void> = new Promise((res) => {
    callback = res;
  });
  let nextResolvingIndex = 0;
  const endedPromise: Promise<true> = _createEndedPromise(
    asyncIterable,
    async (item) => (item),
    onResolveValueRef,
  );

  let accumulator: U = initialValue;

  while (1) {
    const hasEnded = await Promise.race([newlyResolvedPromise, endedPromise]);
    if (hasEnded) {
      break;
    }
    newlyResolvedPromise = new Promise((res) => {
      callback = res;
    });
    while (resolvedValues.has(nextResolvingIndex)) {
      const currentValue = resolvedValues.get(nextResolvingIndex) as T;
      accumulator = await reducer(
        accumulator,
        currentValue,
        nextResolvingIndex,
      );
      nextResolvingIndex++;
    }
  }

  return accumulator;
}

export default reduce;
