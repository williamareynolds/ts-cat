import { Functor1 } from '../../Functor'

declare module '../../HKT' {
  interface URItoHKT<A> {
    Identity: Identity<A>
  }
}

const URI = 'Identity'
type URI = typeof URI

export interface Identity<A> extends Functor1<URI, A> {
  readonly _tag: 'Identity'
  readonly value: A
}

export function identity<A>(a: A): Identity<A> {
  return {
    _tag: 'Identity',
    value: a,
    map<B>(f: (a: A) => B): Identity<B> {
      return identity(f(a))
    }
  }
}
