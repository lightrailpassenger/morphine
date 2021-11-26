import { ValidIterable } from "./mod.ts";

import _shortcircuit from "./_shortcircuit.ts";

async function indexOf<T>(
  asyncIterable: ValidIterable<T>,
  checker: (item: T, index: number) => Promise<boolean>,
): Promise<number> {
  try {
    await _shortcircuit(asyncIterable, checker);
    return -1;
  } catch (err) {
    const { isShortcircuited, index } = err;
    if (isShortcircuited) {
      return index as number;
    } else {
      throw err;
    }
  }
}

export default indexOf;
