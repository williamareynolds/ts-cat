import { Chain1, ChainS1 } from './Chain'
import { Type, URIs } from './HKT'
import { Applicative1, ApplicativeS1 } from './Applicative'

export interface Monad1<M extends URIs, A> extends Applicative1<M, A>, Chain1<M, A> {
  /*
  Typescript cannot yet handle static interface declarations.
  You MUST implement static functions on the class as follows:

  readonly static of: <A>(a: A) => Type<M, A> // From Applicative1
  readonly static pure: <A>(a: A) => Type<M, A>
  */
}

export interface MonadS1<M extends URIs> extends ApplicativeS1<M>, ChainS1<M> {
  readonly pure: <A>(a: A) => Type<M, A>
}
