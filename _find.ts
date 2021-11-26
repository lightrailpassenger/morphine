import { ValidIterable } from "./mod.ts";

import _shortcircuit from "./_shortcircuit.ts";

async function find<T>(
  asyncIterable: ValidIterable<T>,
  checker: (item: T, index: number) => Promise<boolean>,
): Promise<T | undefined> {
  try {
    await _shortcircuit(asyncIterable, checker);
    return undefined;
  } catch (err) {
    const { isShortcircuited, item } = err;
    if (isShortcircuited) {
      return item;
    } else {
      throw err;
    }
  }
}

export default find;
