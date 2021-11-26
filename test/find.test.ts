import {
  assertEquals,
  assertThrowsAsync,
} from "https://deno.land/std@0.115.1/testing/asserts.ts";
import { delay } from "https://deno.land/std@0.115.1/async/delay.ts";

import Morphine from "../mod.ts";

Deno.test("Find", async () => {
  const it = new Morphine<number>((async function* () {
    yield 5;
    yield 6;
    yield 7;
    yield 8;
  })());
  assertEquals(
    await it.find(async (item: number, index: number) => {
      await delay(1000);
      return item === 7 && index === 2;
    }),
    7,
  );
});

Deno.test("Find - negative", async () => {
  const it = new Morphine<number>((async function* () {
    yield 5;
    yield 6;
    yield 7;
    yield 8;
  })());
  assertEquals(
    await it.find(async (item: number, index: number) => {
      await delay(1000);
      return item === 7 && index === 3;
    }),
    undefined,
  );
});

Deno.test({
  name: "Find - Throws",
  fn() {
    const it = new Morphine<number>((async function* () {
      yield 5;
      yield 6;
      throw new Error("Throws");
    })());
    assertThrowsAsync(
      async () => {
        await it.find(async (item: number) => {
          await delay(1000);
          return item === 7;
        });
      },
      Error,
      "Throws",
    );
  },
  sanitizeOps: false,
});
