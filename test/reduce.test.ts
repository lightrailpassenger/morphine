import { assertEquals } from "https://deno.land/std@0.115.1/testing/asserts.ts";
import { delay } from "https://deno.land/std@0.115.1/async/delay.ts";

import Morphine from "../mod.ts";

Deno.test("Reduce", async () => {
  const it = new Morphine<string>((async function* () {
    yield "hello";
    yield "world";
    yield "reduce!";
  })());
  assertEquals(
    await it.reduce(async (acc, cur) => {
      await delay(1000);
      return [acc, cur].join(", ");
    }, "deno"),
    "deno, hello, world, reduce!",
  );
});

Deno.test("Reduce - Sync iterable", async () => {
  const it = new Morphine<string>((function* () {
    yield "hello";
    yield Promise.resolve("world");
    yield "reduce!";
  })());
  assertEquals(
    await it.reduce(async (acc, cur) => {
      await delay(1000);
      return [acc, cur].join(", ");
    }, "deno"),
    "deno, hello, world, reduce!",
  );
});
