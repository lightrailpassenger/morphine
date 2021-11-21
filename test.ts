import { assertEquals } from "https://deno.land/std@0.115.1/testing/asserts.ts";
import { delay } from "https://deno.land/std@0.115.1/async/delay.ts";

import Morphine from "./mod.ts";

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

Deno.test("Map", async () => {
  const it = new Morphine<string>((async function* () {
    yield "hello";
    yield "world";
  })());
  const results: Array<string> = [];
  for await (
    const item of it.map(async (str) => {
      await delay(1000);
      return str.toUpperCase();
    })
  ) {
    results.push(item);
  }
  assertEquals(results, ["HELLO", "WORLD"]);
});

Deno.test("Map - reverse order", async () => {
  const it = new Morphine<string>((async function* () {
    yield "hello";
    yield "world";
  })());
  const results: Array<string> = [];
  for await (
    const item of it.map(async (str, index) => {
      await delay(2000 - index * 1000);
      return str.toUpperCase();
    })
  ) {
    results.push(item);
  }
  assertEquals(results, ["HELLO", "WORLD"]);
});
