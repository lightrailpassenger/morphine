import { ValidIterable } from "./mod.ts";

import _shortcircuit from "./_shortcircuit.ts";

async function some<T>(
  asyncIterable: ValidIterable<T>,
  checker: (item: T, index: number) => Promise<boolean>,
): Promise<boolean> {
  try {
    await _shortcircuit(asyncIterable, checker);
    return false;
  } catch (err) {
    const { isShortcircuited } = err;
    if (isShortcircuited) {
      return true;
    } else {
      throw err;
    }
  }
}

export default some;
