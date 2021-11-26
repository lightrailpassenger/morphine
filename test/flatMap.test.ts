import { assertEquals } from "https://deno.land/std@0.115.1/testing/asserts.ts";
import { delay } from "https://deno.land/std@0.115.1/async/delay.ts";

import Morphine from "../mod.ts";

Deno.test("Flat map", async () => {
  const it = new Morphine<string>((async function* () {
    yield "hello";
    yield "world";
  })());
  const results: Array<string> = [];
  for await (
    const item of it.flatMap(async (str) => {
      await delay(1000);
      return str.toUpperCase();
    })
  ) {
    results.push(item);
  }
  assertEquals(results, [..."HELLOWORLD"]);
});

Deno.test("Flat map - sync iterable", async () => {
  const it = new Morphine<string>((function* () {
    yield "hello";
    yield Promise.resolve("world");
  })());
  const results: Array<string> = [];
  for await (
    const item of it.flatMap(async (str) => {
      await delay(1000);
      return str.toUpperCase();
    })
  ) {
    results.push(item);
  }
  assertEquals(results, [..."HELLOWORLD"]);
});

Deno.test("Flat map - reverse order", async () => {
  const it = new Morphine<string>((async function* () {
    yield "hello";
    yield "world";
  })());
  const results: Array<string> = [];
  for await (
    const item of it.flatMap(async (str, index) => {
      await delay(2000 - index * 1000);
      return str.toUpperCase();
    })
  ) {
    results.push(item);
  }
  assertEquals(results, [..."HELLOWORLD"]);
});
