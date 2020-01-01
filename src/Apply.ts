import { Type, URIs } from './HKT'
import { Functor1, FunctorS1 } from './Functor'

export interface Apply1<F extends URIs, A> extends Functor1<F, A> {
  readonly ap: <B>(fab: Type<F, (a: A) => B>) => Type<F, B>
}

export interface ApplyS1<F extends URIs> extends FunctorS1<F> {
  readonly ap: <A, B>(fab: Type<F, (a: A) => B>, fa: Type<F, A>) => Type<F, B>
}
