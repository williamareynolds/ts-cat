import { Monad1, MonadS1 } from '../Monad'

declare module '../HKT' {
  interface URItoHKT<A> {
    Identity: Identity<A>
  }
}

export const URI = 'Identity'
export type URI = typeof URI

export class Identity<A> implements Monad1<URI, A> {
  constructor(readonly value: A, readonly tag: 'Identity' = 'Identity') {}

  map<B>(f: (a: A) => B): Identity<B> {
    return identity.of(f(this.value))
  }

  ap<B>(fab: Identity<(a: A) => B>): Identity<B> {
    return identity.of(fab.value(this.value))
  }

  chain<B>(mab: Identity<(a: A) => Identity<B>>): Identity<B> {
    return identity.of(mab.value(this.value).value)
  }
}

const of = <A>(a: A): Identity<A> => {
  return new Identity(a)
}

/** A common alias of `of` */
const pure = of

const map = <A, B>(f: (a: A) => B, fa: Identity<A>): Identity<B> => {
  return fa.map(f)
}

const ap = <A, B>(fab: Identity<(a: A) => B>, fa: Identity<A>): Identity<B> => {
  return fa.ap(fab)
}

const chain = <A, B>(mab: Identity<(a: A) => Identity<B>>, ma: Identity<A>): Identity<B> => {
  return ma.chain(mab)
}

export const identity: MonadS1<URI> = {
  map,
  ap,
  of,
  pure,
  chain
}
