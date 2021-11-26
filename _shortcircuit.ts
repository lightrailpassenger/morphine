import { ValidIterable } from "./mod.ts";

import entries from "./_entries.ts";

async function shortcircuit<T>(
  asyncIterable: ValidIterable<T>,
  shouldShortcircuit: (item: T, index: number) => Promise<boolean>,
) {
  const iterablePromises: Array<Promise<void>> = [];
  for await (const [index, item] of entries(asyncIterable)) {
    iterablePromises.push(
      // deno-lint-ignore no-async-promise-executor
      new Promise(async (res, rej) => {
        try {
          const shouldShortcircuitResult = await shouldShortcircuit(
            item,
            index,
          );
          if (shouldShortcircuitResult) {
            rej({ isShortcircuited: true, item, index });
          } else {
            res();
          }
        } catch (err) {
          rej({ isShortcircuited: false, err });
        }
      }),
    );
  }
  await Promise.all(iterablePromises);
}

export default shortcircuit;
