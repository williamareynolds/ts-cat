import { Type, URIs } from './HKT'
import { Apply1, ApplyS1 } from './Apply'

export interface Chain1<F extends URIs, A> extends Apply1<F, A> {
  readonly chain: <B>(fa: (a: A) => Type<F, B>) => Type<F, B>
}

export interface ChainS1<F extends URIs> extends ApplyS1<F> {
  readonly chain: <A, B>(fa: (a: A) => Type<F, B>, ma: Type<F, A>) => Type<F, B>
}
