import { Type, URIs } from './HKT'
import { Alt1, AltS1 } from './Alt'

export interface Plus1<F extends URIs, A> extends Alt1<F, A> {
  readonly zero: () => Type<F, A>
}

export interface PlusS1<F extends URIs> extends AltS1<F> {
  readonly zero: <A>(fa: Type<F, A>) => Type<F, A>
}
