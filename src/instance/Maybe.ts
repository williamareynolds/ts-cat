import { Monad1, MonadS1 } from '../Monad'

declare module '../HKT' {
  interface URItoHKT<A> {
    Maybe: Maybe<A>
  }
}

const URI = 'Maybe'
type URI = typeof URI

export const MAYBE_URI = URI
export type MaybeURI = URI

export abstract class Maybe<A> implements Monad1<URI, A> {
  /** @ignore */
  readonly tag!: 'Just' | 'Nothing'

  /** @ignore */
  readonly value!: A

  /** Produce a string representation of the object */
  abstract toString(): String

  /**
   * Apply a function to the value contained in Maybe
   *
   * If Maybe is "Nothing" then it will always return "Nothing". If Maybe is "Just" some value, the
   * function will be applied to that value and returned as a Maybe.
   *
   * @param f A unary function
   */
  abstract map<B>(f: (a: A) => B): Maybe<B>

  /**
   * Similar to map, but apply a function wrapped in Maybe.
   *
   * If either the function Maybe or this Maybe is "Nothing", then this will return "Nothing".
   * Otherwise, the function will be applied to the value and return a Maybe.
   *
   * @param fab Maybe wrapping a function
   */
  abstract ap<B>(fab: Maybe<(a: A) => B>): Maybe<B>

  /**
   * Wrap a value with Maybe.
   *
   * If the value is undefined or null, it will return "Nothing". Otherwise, it will return a "Just"
   * containing the value.
   *
   * @param a
   */
  static of<A>(a: A): Maybe<A> {
    if (a === undefined || a === null) return new Nothing()
    return new Just(a)
  }

  /**
   * A common alias of [[Maybe.of]]
   *
   * @param a
   */
  static pure = Maybe.of

  /**
   * Monadic binding. Apply a function which returns a Maybe without adding structure.
   *
   * Returns "Nothing" when the Maybe is "Nothing, or when the function applied to the value
   * returns "Nothing". Otherwise, returns "Just" the result of the function: a Maybe of the value.
   *
   * @param f A unary function which returns a Maybe
   */
  abstract chain<B>(f: (a: A) => Maybe<B>): Maybe<B>
}

class Nothing<A> extends Maybe<A> {
  readonly tag: 'Nothing' = 'Nothing'
  readonly value!: never

  toString(): String {
    return this.tag
  }

  map<B>(f: (a: A) => B): Maybe<B> {
    return new Nothing()
  }

  ap<B>(fab: Maybe<(a: A) => B>): Maybe<B> {
    return new Nothing()
  }

  chain<B>(_: (a: A) => Maybe<B>): Maybe<B> {
    return new Nothing()
  }
}

class Just<A> extends Maybe<A> implements Monad1<URI, A> {
  tag: 'Just' = 'Just'

  toString(): String {
    return `${this.tag} ${String(this.value)}`
  }

  public constructor(readonly value: A) {
    super()
  }

  map<B>(f: (a: A) => B): Maybe<B> {
    return Maybe.of(f(this.value))
  }

  ap<B>(fab: Maybe<(a: A) => B>): Maybe<B> {
    switch (fab.tag) {
      case 'Nothing':
        return new Nothing()
      case 'Just':
        return Maybe.of(fab.value(this.value))
    }
  }

  chain<B>(f: (a: A) => Maybe<B>): Maybe<B> {
    return f(this.value)
  }
}

/**
 * The set of static functions which can be applied with Maybe
 */
export const maybe: MonadS1<URI> = {
  /**
   * Apply a function to the value contained in Maybe
   *
   * If Maybe is "Nothing" then it will always return "Nothing". If Maybe is "Just" some value, the
   * function will be applied to that value and returned as a Maybe.
   *
   * @param f A unary function
   * @param fa
   */
  map: <A, B>(f: (a: A) => B, fa: Maybe<A>): Maybe<B> => {
    return fa.map(f)
  },

  /**
   * Similar to map, but apply a function wrapped in Maybe.
   *
   * If either the function Maybe or this Maybe is "Nothing", then this will return "Nothing".
   * Otherwise, the function will be applied to the value and return a Maybe.
   *
   * @param fab A unary function wrapped by Maybe
   * @param fa
   */
  ap: <A, B>(fab: Maybe<(a: A) => B>, fa: Maybe<A>): Maybe<B> => {
    return fa.ap(fab)
  },

  /**
   * Wrap a value with Maybe.
   *
   * If the value is undefined or null, it will return "Nothing". Otherwise, it will return a "Just"
   * containing the value.
   *
   * @param a
   */
  of: Maybe.of,

  /** A common alias for [[of]] */
  pure: Maybe.of,

  /**
   * Monadic binding. Apply a function which returns a Maybe without adding structure.
   *
   * Returns "Nothing" when the Maybe is "Nothing, or when the function applied to the value
   * returns "Nothing". Otherwise, returns "Just" the result of the function: a Maybe of the value.
   *
   * @param f A unary function which returns a maybe
   * @param ma
   */
  chain: <A, B>(f: (a: A) => Maybe<B>, ma: Maybe<A>): Maybe<B> => {
    return ma.chain(f)
  }
}
