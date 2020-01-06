import * as fc from 'fast-check'
import { Identity, identity } from '../src/ts-cat'

describe("Identity's", () => {
  describe('string helper function', () => {
    it('translates an Identity to a pretty string', () => {
      fc.assert(
        fc.property(fc.integer(), int => {
          const m = Identity.of(int)

          expect(m.toString()).toStrictEqual(`Identity ${int}`)
        })
      )
    })
  })

  describe('pure', () => {
    it('is an alias of `of`', () => {
      fc.assert(
        fc.property(fc.integer(), int => {
          expect(Identity.of(int)).toStrictEqual(Identity.pure(int))

          expect(identity.of(int)).toStrictEqual(identity.pure(int))
        })
      )
    })
  })

  const identityFn = (a: number) => a
  const f = (a: number): number => a * 2
  const g = (a: number): number => a - 8

  describe('instance of functor', () => {
    it('should obey the identity law', () => {
      fc.assert(
        fc.property(fc.integer(), int => {
          const m = Identity.of(int)
          expect(m.map(identityFn)).toStrictEqual(m)
        })
      )

      fc.assert(
        fc.property(fc.integer(), int => {
          const m = identity.of(int)
          expect(identity.map(identityFn, m)).toStrictEqual(m)
        })
      )
    })

    it('should obey the composition law', () => {
      fc.assert(
        fc.property(fc.integer(), int => {
          const m = Identity.of(int)

          expect(m.map(a => f(g(a)))).toStrictEqual(m.map(g).map(f))
        })
      )

      fc.assert(
        fc.property(fc.integer(), int => {
          const m = identity.of(int)

          expect(identity.map(a => f(g(a)), m)).toStrictEqual(identity.map(f, identity.map(g, m)))
        })
      )
    })
  })

  describe('instance of Apply', () => {
    it('should obey the composition law', () => {
      const idF = Identity.of(f)
      const idG = Identity.of(g)

      fc.assert(
        fc.property(fc.integer(), int => {
          const m = Identity.of(int)

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

      fc.assert(
        fc.property(fc.integer(), int => {
          const m = identity.of(int)

          expect(
            identity.ap(
              identity.ap(
                identity.map(f => g => x => f(g(x)), idG),
                idF
              ),
              m
            )
          ).toStrictEqual(identity.ap(idG, identity.ap(idF, m)))
        })
      )
    })
  })

  describe('instance of Chain', () => {
    it('should obey the associativity law', () => {
      const mf = (a: number): Identity<number> => identity.of(f(a))
      const mg = (a: number): Identity<number> => identity.of(g(a))

      fc.assert(
        fc.property(fc.integer(), int => {
          const m = identity.of(int)

          expect(m.chain(mf).chain(mg)).toStrictEqual(m.chain(x => mf(x).chain(mg)))
        })
      )

      fc.assert(
        fc.property(fc.integer(), int => {
          const m = identity.of(int)

          expect(identity.chain(mg, identity.chain(mf, m))).toStrictEqual(
            identity.chain(x => identity.chain(mg, mf(x)), m)
          )
        })
      )
    })
  })

  describe('instance of Applicative', () => {
    it('should obey the identity law', () => {
      fc.assert(
        fc.property(fc.integer(), int => {
          const m = Identity.of(int)

          expect(m.ap(Identity.of(x => x))).toStrictEqual(m)
        })
      )

      fc.assert(
        fc.property(fc.integer(), int => {
          const m = identity.of(int)

          expect(
            identity.ap(
              identity.of(x => x),
              m
            )
          ).toStrictEqual(m)
        })
      )
    })

    it('should obey the homomorphism law', () => {
      fc.assert(
        fc.property(fc.integer(), int => {
          expect(Identity.of(int).ap(Identity.of(f))).toStrictEqual(Identity.of(f(int)))
        })
      )

      fc.assert(
        fc.property(fc.integer(), int => {
          expect(identity.ap(identity.of(f), identity.of(int))).toStrictEqual(identity.of(f(int)))
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

      fc.assert(
        fc.property(fc.integer(), int => {
          expect(identity.ap(mf, identity.of(int))).toStrictEqual(
            identity.ap(
              identity.of(x => x(int)),
              mf
            )
          )
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

      fc.assert(
        fc.property(fc.integer(), int => {
          expect(identity.chain(mf, identity.of(int))).toStrictEqual(mf(int))
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

      fc.assert(
        fc.property(fc.integer(), int => {
          const m = identity.of(int)

          expect(identity.chain(identity.of, m)).toStrictEqual(m)
        })
      )
    })
  })
})
