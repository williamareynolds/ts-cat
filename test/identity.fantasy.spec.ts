import * as fc from 'fast-check'
import { identity } from '../src/ts-cat'

describe('Identity', () => {
  describe('has an instance of functor', () => {
    it('and it obeys the Identity Law', () => {
      fc.assert(
        fc.property(fc.anything(), (a: any) => {
          const x = identity(a)

          expect(x.map(b => b).value).toStrictEqual(x.value)
        })
      )
    })

    it('and it obeys the Composition Law', () => {
      fc.assert(
        fc.property(
          fc.anything(),
          fc.func(fc.anything()),
          fc.func(fc.anything()),
          (x: any, f: (...args: any) => any, g: (...args: any) => any) => {
            const idX = identity(x)
            expect(idX.map(x => f(g(x))).value).toStrictEqual(idX.map(g).map(f).value)
          }
        )
      )
    })
  })
})
