import _entries from "./_entries.ts";
import _map from "./_map.ts";

class Morphine<T> {
  private _asyncIterable: AsyncIterable<T>;
  constructor(asyncIterable: AsyncIterable<T>) {
    this._asyncIterable = asyncIterable;
  }

  async *[Symbol.asyncIterator]() {
    yield* this._asyncIterable;
  }

  entries(): Morphine<[number, T]> {
    return new Morphine(_entries(this._asyncIterable));
  }

  map<U>(mapper: (item: T, index: number) => Promise<U>): Morphine<U> {
    return new Morphine(_map(this._asyncIterable, mapper));
  }
}

export default Morphine;
