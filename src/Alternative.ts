import { URIs } from './HKT'
import { Plus1, PlusS1 } from './Plus'
import { Applicative1, ApplicativeS1 } from './Applicative'

export interface Alternative1<F extends URIs, A> extends Plus1<F, A>, Applicative1<F, A> {}

export interface AlternativeS1<F extends URIs> extends PlusS1<F>, ApplicativeS1<F> {}
