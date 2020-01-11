import { Functor1 } from '../../Functor'

declare module '../../HKT' {
  interface URItoHKT<A> {
    Maybe: Maybe<A>
  }
}

const URI = 'Maybe'
type URI = typeof URI

export interface Maybe<A> extends Functor1<URI, A> {
  readonly _tag: 'Nothing' | 'Just'
  readonly value?: A
  map<B>(f: (a: A) => B): Maybe<B>
}

export function nothing(): Maybe<never> {
  return {
    _tag: 'Nothing',
    map<A, B>(_: (a: A) => B): Maybe<NonNullable<B>> {
      return nothing() as Maybe<NonNullable<B>>
    }
  }
}

export function just<A>(a: A): Maybe<A> {
  return {
    _tag: 'Just',
    value: a,
    map<B>(f: (a: A) => B): Maybe<NonNullable<B>> {
      return maybe(f(a)) as Maybe<NonNullable<B>>
    }
  }
}

export function maybe<A>(a: A): Maybe<A> {
  return a === undefined || a === null
    ? (nothing() as Maybe<NonNullable<A>>)
    : (just(a) as Maybe<NonNullable<A>>)
}
