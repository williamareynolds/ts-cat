import { Type, Type2, URI2s, URIs } from './HKT'

export interface Functor1<F extends URIs, A> {
  readonly map: <B>(f: (a: A) => B) => Type<F, B>
}

export interface FunctorS1<F extends URIs> {
  readonly map: <A, B>(f: (a: A) => B, fa: Type<F, A>) => Type<F, B>
}

export interface Functor2<F extends URI2s, A, B> {
  readonly map: <C>(f: (b: B) => C) => Type2<F, A, C>
}

export interface FunctorS2<F extends URI2s> {
  readonly map: <A, B, C>(f: (b: B) => C, fab: Type2<F, A, B>) => Type2<F, A, C>
}
