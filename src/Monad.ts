import { Chain1, ChainS1 } from './Chain'
import { Type, URIs } from './HKT'
import { Apply1 } from './Apply'
import { ApplicativeS1 } from './Applicative'

export interface Monad1<M extends URIs, A> extends Apply1<M, A>, Chain1<M, A> {}

export interface MonadS1<M extends URIs> extends ApplicativeS1<M>, ChainS1<M> {
  readonly pure: <A>(a: A) => Type<M, A>
}
