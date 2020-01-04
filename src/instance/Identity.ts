import { Monad1, MonadS1 } from '../Monad'

declare module '../HKT' {
  interface URItoHKT<A> {
    Identity: Identity<A>
  }
}

const URI = 'Identity'
type URI = typeof URI

export const IDENTITY_URI = URI
export type IdentityURI = URI

/**
 * A simple wrapper around a value which provides no special behavior.
 *
 * Identity is valuable in cases where some function expects an instance of Functor, Monad, or
 * otherwise, but the data to pass needs no special behavior (as may be provided by something like
 * Maybe).
 *
 * @category Identity
 */
export class Identity<A> implements Monad1<URI, A> {
  /** @param value A value of any type to wrap in Identity */
  private constructor(readonly value: A) {}

  /**
   * Create a new Identity object.
   *
   * @param a Any value to wrap with Identity.
   */
  static of<A>(a: A): Identity<A> {
    return new Identity(a)
  }

  /**
   * A common alias of [[of]]
   *
   * @param a Any value to wrap with Identity
   */
  static pure<A>(a: A): Identity<A> {
    return new Identity(a)
  }

  toString(): String {
    return `Identity ${String(this.value)}`
  }

  /**
   * Apply a function to the value wrapped by Identity.
   *
   * @param f A unary function.
   */
  map<B>(f: (a: A) => B): Identity<B> {
    return identity.of(f(this.value))
  }

  /**
   * Apply a function wrapped in Identity to the value wrapped by this Identity.
   *
   * @param fab An Identity wrapping a unary function.
   */
  ap<B>(fab: Identity<(a: A) => B>): Identity<B> {
    return identity.of(fab.value(this.value))
  }

  /**
   * A monadic bind. Apply a function which returns an Identity without adding additional structure.
   *
   * @param fa A function which returns an Identity.
   */
  chain<B>(fa: (a: A) => Identity<B>): Identity<B> {
    return fa(this.value)
  }
}

/**
 * The set of static functions which can be applied with Identity
 *
 * @category Identity
 */
export const identity: MonadS1<URI> = {
  /**
   * Apply a function to the value within an Identity.
   *
   * @category Identity
   * @param f A unary function.
   * @param fa An Identity containing the value to which the function will be applied.
   */
  map: <A, B>(f: (a: A) => B, fa: Identity<A>): Identity<B> => {
    return fa.map(f)
  },

  /**
   * Apply a function wrapped by Identity to the value within another Identity.
   *
   * @category Identity
   * @param fab A unary function wrapped by Identity.
   * @param fa An identity containing the value to which the function will be applied.
   */
  ap: <A, B>(fab: Identity<(a: A) => B>, fa: Identity<A>): Identity<B> => {
    return fa.ap(fab)
  },

  /**
   * Create a new Identity object.
   *
   * @category Identity
   * @param a Any value to wrap with Identity.
   */
  of: <A>(a: A): Identity<A> => {
    return Identity.of(a)
  },

  /**
   * A common alias of [[of]]
   *
   * @category Identity
   */
  pure: <A>(a: A): Identity<A> => {
    return Identity.of(a)
  },

  /**
   * Apply a function which returns Identity without adding structure.
   *
   * @category Identity
   * @param fa A unary function which returns an Identity
   * @param ma An identity containing the value to which the function will be applied.
   */
  chain: <A, B>(fa: (a: A) => Identity<B>, ma: Identity<A>): Identity<B> => {
    return ma.chain(fa)
  }
}
