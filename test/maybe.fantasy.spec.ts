import { maybe } from '../src/ts-cat'
import * as fc from 'fast-check'

const func = fc.func(
  fc.oneof<number | string | boolean | object>(
    fc.integer(),
    fc.fullUnicodeString(),
    fc.boolean(),
    fc.object(),
    fc.array(fc.anything()),
    fc.date()
  )
)

describe('Maybe', () => {
  describe('has an instance of functor', () => {
    it('and it obeys the Identity Law', () => {
      fc.assert(
        fc.property(fc.anything(), (a: any) => {
          const x = maybe(a)
          expect(x.map(b => b).value).toStrictEqual(x.value)
        })
      )
    })

    it('and it obeys the Composition Law', () => {
      fc.assert(
        fc.property(fc.anything(), func, func, (a, f, g) => {
          const x = maybe(a)

          expect(x.map(x => f(g(x))).value).toStrictEqual(
            // @ts-ignore
            x.map(g).map(f).value
          )
        })
      )
    })
  })
})
