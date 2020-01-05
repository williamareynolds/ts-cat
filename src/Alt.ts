import { Type, URIs } from './HKT'

export interface Alt1<F extends URIs, A> {
  alt: (fa: Type<F, A>) => Type<F, A>
}

export interface AltS1<F extends URIs> {
  alt: <A>(f2: Type<F, A>, f1: Type<F, A>) => Type<F, A>
}
