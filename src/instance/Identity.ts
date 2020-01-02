import { Monad1, MonadS1 } from '../Monad'

declare module '../HKT' {
  interface URItoHKT<A> {
    Identity: _Identity<A>
  }
}

export const URI = 'Identity'
export type URI = typeof URI

class _Identity<A> implements Monad1<URI, A> {
  /** @param value A value of any type to wrap in Identity */
  constructor(readonly value: A) {}

  /**
   * Apply a function to the value wrapped by Identity.
   *
   * @param f A unary function.
   */
  map<B>(f: (a: A) => B): _Identity<B> {
    return identity.of(f(this.value))
  }

  /**
   * Apply a function wrapped in Identity to the value wrapped by this Identity.
   *
   * @param fab An Identity wrapping a unary function.
   */
  ap<B>(fab: _Identity<(a: A) => B>): _Identity<B> {
    return identity.of(fab.value(this.value))
  }

  /**
   * A monadic bind. Apply a function which returns an Identity without adding additional structure.
   *
   * @param fa A function which returns an Identity.
   */
  chain<B>(fa: (a: A) => _Identity<B>): _Identity<B> {
    return fa(this.value)
  }
}

/**
 * A simple wrapper around a value which provides no special behavior.
 *
 * Identity is valuable in cases where some function expects an instance of Functor, Monad, or
 * otherwise, but the data to pass needs no special behavior (as may be provided by something like
 * Maybe).
 */
export type Identity<A> = _Identity<A>

/**
 * Create a new Identity object.
 *
 * @param a Any value to wrap with Identity.
 */
const of = <A>(a: A): _Identity<A> => {
  return new _Identity(a)
}

/** A common alias of [[of]] */
const pure = of

/**
 * Apply a function to the value within an Identity.
 *
 * @param f A unary function.
 * @param fa An Identity containing the value to which the function will be applied.
 */
const map = <A, B>(f: (a: A) => B, fa: _Identity<A>): _Identity<B> => {
  return fa.map(f)
}

/**
 * Apply a function wrapped by Identity to the value within another Identity.
 *
 * @param fab A unary function wrapped by Identity.
 * @param fa An identity containing the value to which the function will be applied.
 */
const ap = <A, B>(fab: _Identity<(a: A) => B>, fa: _Identity<A>): _Identity<B> => {
  return fa.ap(fab)
}

/**
 * Apply a function which returns Identity without adding structure.
 *
 * @param fa A unary function which returns an Identity
 * @param ma An identity containing the value to which the function will be applied.
 */
const chain = <A, B>(fa: (a: A) => _Identity<B>, ma: _Identity<A>): _Identity<B> => {
  return ma.chain(fa)
}

/** The set of static identity functions which can be applied with Identity */
export const identity: MonadS1<URI> = {
  map,
  ap,
  of,
  pure,
  chain
}
