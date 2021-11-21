# Morphine

## An async iterable utility library

This library includes utility methods for handling async iterables. The methods
aims at non-blocking, so await calls will be processed concurrently as long as
there is no dependency.

Example:

```
const asyncIterable = new Morphine<string>((async function*() {
  yield 'hello';
  yield 'world';
})());
const mappedAsyncIterable = asyncIterable.map(async (str, idx) => {
  await delay(2000 - index * 1000);
  return str.toUpperCase();
});
```

The above code fragment takes (slightly more than) 2 seconds to run. While there
are two callbacks (one awaiting 2 seconds and another awaiting 1 second), they
are done concurrently. You may be tempted to try either

```
const mappedPromises = [];
for await (let item of asyncIterable) {
  mappedPromises.push(mapper(item));
}
await Promise.all(mappedPromises);
```

but this will not work properly if the iterable represents an infinite stream.
