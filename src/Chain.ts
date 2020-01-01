import { Type, URIs } from './HKT'
import { Apply1, ApplyS1 } from './Apply'

export interface Chain1<F extends URIs, A> extends Apply1<F, A> {
  chain: <B>(mab: Type<F, (a: A) => Type<F, B>>) => Type<F, B>
}

export interface ChainS1<F extends URIs> extends ApplyS1<F> {
  chain: <A, B>(mab: Type<F, (a: A) => Type<F, B>>, ma: Type<F, A>) => Type<F, B>
}
