import _entries from "./_entries.ts";
import _flatMap from "./_flatMap.ts";
import _map from "./_map.ts";

type ValidIterable<T> = AsyncIterable<T> | Iterable<T | Promise<T>>;

class Morphine<T> {
  private _asyncIterable: ValidIterable<T>;
  constructor(asyncIterable: ValidIterable<T>) {
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

  flatMap<U>(
    flatMapper: (
      item: T,
      index: number,
    ) => Promise<Iterable<U> | AsyncIterable<U>>,
  ): Morphine<U> {
    return new Morphine(_flatMap(this._asyncIterable, flatMapper));
  }
}

export type { ValidIterable };
export default Morphine;
