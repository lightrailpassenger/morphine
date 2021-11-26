import { ValidIterable } from "./mod.ts";

import entries from "./_entries.ts";

async function shortcircuit<T>(
  asyncIterable: ValidIterable<T>,
  shouldShortcircuit: (item: T, index: number) => Promise<boolean>,
) {
  let iterablePromises: Array<Promise<void>> = [];
  for await (let [index, item] of entries(asyncIterable)) {
    iterablePromises.push(
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
