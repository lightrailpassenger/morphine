import entries from "./_entries.ts";

interface CallbackRefType<U> {
  onResolveValue(index: number, value: U): void;
}

async function createEndedPromise<T, U>(asyncIterable: AsyncIterable<T>, mapper: (item: T, index: number) => Promise<U>, callbackRef: CallbackRefType<U>) {
  return new Promise<true>((res, rej) => {
    setTimeout(async () => {
      try {
        const iterablePromises = [];
        for await (const [index, item] of entries(asyncIterable)) {
          const iteratingPromise: Promise<void> = new Promise((res, rej) => {
            setTimeout(async () => {
              try {
                const value: U = await mapper(item, index);
                callbackRef.onResolveValue(index, value);
                res();
              } catch (err) {
                rej(err);
              }
            }, 0);
          });
          iterablePromises.push(iteratingPromise);
        }
        await Promise.all(iterablePromises);
        res(true);
      } catch (err) {
        rej(err);
      }
    }, 0);
  });
}

export default createEndedPromise;
