import { Type, URIs } from './HKT'
import { Apply1, ApplyS1 } from './Apply'

export interface Applicative1<F extends URIs, A> extends Apply1<F, A> {
  /*
  Typescript cannot yet handle static interface declarations.
  You MUST implement a static function on the class as follows:

  readonly static of: <A>(a: A) => Type<F, A>
  */
}

export interface ApplicativeS1<F extends URIs> extends ApplyS1<F> {
  readonly of: <A>(a: A) => Type<F, A>
}
