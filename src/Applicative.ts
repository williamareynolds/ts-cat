import { Type, URIs } from './HKT'
import { ApplyS1 } from './Apply'

export interface ApplicativeS1<F extends URIs> extends ApplyS1<F> {
  readonly of: <A>(a: A) => Type<F, A>
}
