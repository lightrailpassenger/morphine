import _entries from "./_entries.ts";
import _flatMap from "./_flatMap.ts";
import _map from "./_map.ts";
import _some from "./_some.ts";
import _indexOf from "./_indexOf.ts";
import _find from "./_find.ts";

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

  some(
    checker: (item: T, index: number) => Promise<boolean>,
  ): Promise<boolean> {
    return _some(this._asyncIterable, checker);
  }

  indexOf(
    checker: (item: T, index: number) => Promise<boolean>,
  ): Promise<number> {
    return _indexOf(this._asyncIterable, checker);
  }

  find(
    checker: (item: T, index: number) => Promise<boolean>,
  ): Promise<T | undefined> {
    return _find(this._asyncIterable, checker);
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
