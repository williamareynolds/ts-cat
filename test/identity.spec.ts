import * as fc from 'fast-check'
import { Identity, identity } from '../src/ts-cat'

describe("Identity's", () => {
  const identityFn = (a: number) => a
  const f = (a: number) => a + 2
  const g = (a: number) => a - 8

  describe('instance of functor', () => {
    it('should obey the identity law', () => {
      fc.assert(
        fc.property(fc.integer(), int => {
          const m = identity.of(int)
          expect(m.map(identityFn)).toStrictEqual(m)
        })
      )
    })

    it('should obey the composition law', () => {
      fc.assert(
        fc.property(fc.integer(), int => {
          const m = identity.of(int)

          expect(m.map(a => f(g(a)))).toStrictEqual(m.map(g).map(f))
        })
      )
    })
  })

  describe('instance of Apply', () => {
    it('should obey the composition law', () => {
      const idF = identity.of(f)
      const idG = identity.of(g)

      fc.assert(
        fc.property(fc.integer(), int => {
          const m = identity.of(int)

          expect(
            m.ap(
              idF.ap(
                idG.map(f => g => x => {
                  return f(g(x))
                })
              )
            )
          ).toStrictEqual(m.ap(idF).ap(idG))
        })
      )
    })
  })

  describe('instance of Chain', () => {
    it('should obey the associativity law', () => {
      const mf = (a: number) => identity.of(f(a))
      const mg = (a: number) => identity.of(g(a))

      fc.assert(
        fc.property(fc.integer(), int => {
          const m = identity.of(int)

          expect(m.chain(mf).chain(mg)).toStrictEqual(m.chain(x => mf(x).chain(mg)))
        })
      )
    })
  })

  describe('instance of Applicative', () => {
    it('should obey the identity law', () => {
      fc.assert(
        fc.property(fc.integer(), int => {
          const m = identity.of(int)

          expect(m.ap(Identity.of(x => x))).toStrictEqual(m)
        })
      )
    })

    it('should obey the homomorphism law', () => {
      fc.assert(
        fc.property(fc.integer(), int => {
          expect(Identity.of(int).ap(Identity.of(f))).toStrictEqual(Identity.of(f(int)))
        })
      )
    })

    it('should obey the interchange law', () => {
      const mf = Identity.of(f)

      fc.assert(
        fc.property(fc.integer(), int => {
          expect(Identity.of(int).ap(mf)).toStrictEqual(mf.ap(Identity.of(x => x(int))))
        })
      )
    })
  })

  describe('instance of Monad', () => {
    const mf = (a: number) => Identity.of(f(a))

    it('should obey the left identity law', () => {
      fc.assert(
        fc.property(fc.integer(), int => {
          expect(Identity.of(int).chain(mf)).toStrictEqual(mf(int))
        })
      )
    })

    it('should obey the right identity law', () => {
      fc.assert(
        fc.property(fc.integer(), int => {
          const m = Identity.of(int)

          expect(m.chain(Identity.of)).toStrictEqual(m)
        })
      )
    })
  })
})
