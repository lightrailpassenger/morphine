import { assertEquals } from "https://deno.land/std@0.115.1/testing/asserts.ts";
import { delay } from "https://deno.land/std@0.115.1/async/delay.ts";

import Morphine from "../mod.ts";

Deno.test("Entries", async () => {
  const it = new Morphine<number>((async function* () {
    yield 5;
    yield 6;
    yield 7;
    yield 8;
  })());
  const results: Array<[number, number]> = [];
  for await (const item of it.entries()) {
    results.push(item);
  }
  assertEquals(results, [
    [0, 5],
    [1, 6],
    [2, 7],
    [3, 8],
  ]);
});
