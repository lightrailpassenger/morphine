import entries from "./_entries.ts";

async function* map<T, U>(
  asyncIterable: AsyncIterable<T>,
  mapper: (item: T, index: number) => Promise<U>,
): AsyncGenerator<U, void, void> {
  const resolvedValues = new Map<number, U>();
  let callback: () => void;
  let newlyResolvedPromise: Promise<void> = new Promise((res) => {
    callback = res;
  });
  let nextResolvingIndex = 0;
  const endedPromise: Promise<true> = new Promise((res, rej) => {
    setTimeout(async () => {
      try {
        const iterablePromises = [];
        for await (const [index, item] of entries(asyncIterable)) {
          const iteratingPromise: Promise<void> = new Promise((res, rej) => {
            setTimeout(async () => {
              try {
                const value: U = await mapper(item, index);
                resolvedValues.set(index, value);
                callback();
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
