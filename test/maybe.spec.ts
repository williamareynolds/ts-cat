import * as fc from 'fast-check'
import { Maybe, maybe } from '../src/ts-cat'

const intOrUndefined = fc.frequency(
  {
    weight: 1,
    arbitrary: fc.constant(undefined)
  },
  {
    weight: 20,
    arbitrary: fc.integer()
  }
)

describe("Maybe's", () => {
  describe('string helper function', () => {
    it('translates an Maybe to a pretty string', () => {
      const m = Maybe.of(5)

      expect(m.toString()).toStrictEqual(`Just ${5}`)

      const n = Maybe.of(undefined)

      expect(n.toString()).toStrictEqual(`Nothing`)
    })
  })

  describe('pure', () => {
    it('is an alias of `of`', () => {
      fc.assert(
        fc.property(intOrUndefined, int => {
          expect(Maybe.of(int)).toStrictEqual(Maybe.pure(int))

          expect(maybe.of(int)).toStrictEqual(maybe.pure(int))
        })
      )
    })
  })

  const maybeFn = (a: number) => a
  const f = (a?: number) => {
    if (a === undefined) return a
    return a * 2
  }
  const g = (a: number) => {
    if (a === undefined) return a
    return a - 8
  }

  describe('instance of functor', () => {
    it('should obey the maybe law', () => {
      fc.assert(
        fc.property(intOrUndefined, int => {
          const m = Maybe.of(int)
          expect(m.map(maybeFn)).toStrictEqual(m)
        })
      )

      fc.assert(
        fc.property(intOrUndefined, int => {
          const m = maybe.of(int)
          expect(maybe.map(maybeFn, m)).toStrictEqual(m)
        })
      )
    })

    it('should obey the composition law', () => {
      fc.assert(
        fc.property(intOrUndefined, int => {
          const m = Maybe.of(int)

          expect(m.map(a => f(g(a)))).toStrictEqual(m.map(g).map(f))
        })
      )

      fc.assert(
        fc.property(intOrUndefined, int => {
          const m = maybe.of(int)

          expect(maybe.map(a => f(g(a)), m)).toStrictEqual(maybe.map(f, maybe.map(g, m)))
        })
      )
    })
  })

  describe('instance of Apply', () => {
    it('should obey the composition law', () => {
      const fOrUndefined = fc.frequency(
        {
          weight: 1,
          arbitrary: fc.constant(undefined)
        },
        {
          weight: 1,
          arbitrary: fc.constant(f)
        }
      )
      const idG = Maybe.of(g)

      fc.assert(
        fc.property(intOrUndefined, fOrUndefined, (int, f) => {
          const m = Maybe.of(int)
          const idF = Maybe.of(f)

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
        fc.property(intOrUndefined, fOrUndefined, (int, f) => {
          const m = maybe.of(int)
          const idF = maybe.of(f)

          expect(
            maybe.ap(
              maybe.ap(
                maybe.map(f => g => x => f(g(x)), idG),
                idF
              ),
              m
            )
          ).toStrictEqual(maybe.ap(idG, maybe.ap(idF, m)))
        })
      )
    })
  })

  describe('instance of Chain', () => {
    it('should obey the associativity law', () => {
      const mf = (a: number) => maybe.of(f(a))
      const mg = (a: number) => maybe.of(g(a))

      fc.assert(
        fc.property(intOrUndefined, int => {
          const m = maybe.of(int)

          expect(m.chain(mf).chain(mg)).toStrictEqual(m.chain(x => mf(x).chain(mg)))
        })
      )

      fc.assert(
        fc.property(intOrUndefined, int => {
          const m = maybe.of(int)

          expect(maybe.chain(mg, maybe.chain(mf, m))).toStrictEqual(
            maybe.chain(x => maybe.chain(mg, mf(x)), m)
          )
        })
      )
    })
  })

  describe('instance of Applicative', () => {
    it('should obey the maybe law', () => {
      fc.assert(
        fc.property(intOrUndefined, int => {
          const m = Maybe.of(int)

          expect(m.ap(Maybe.of(x => x))).toStrictEqual(m)
        })
      )

      fc.assert(
        fc.property(intOrUndefined, int => {
          const m = maybe.of(int)

          expect(
            maybe.ap(
              maybe.of(x => x),
              m
            )
          ).toStrictEqual(m)
        })
      )
    })

    it('should obey the homomorphism law', () => {
      fc.assert(
        fc.property(intOrUndefined, int => {
          expect(Maybe.of(int).ap(Maybe.of(f))).toStrictEqual(Maybe.of(f(int)))
        })
      )

      fc.assert(
        fc.property(intOrUndefined, int => {
          expect(maybe.ap(maybe.of(f), maybe.of(int))).toStrictEqual(maybe.of(f(int)))
        })
      )
    })

    it('should obey the interchange law', () => {
      const mf = Maybe.of(f)

      fc.assert(
        fc.property(intOrUndefined, int => {
          const of = Maybe.of((x: (a: number) => number) => x(int))
          const ap = mf.ap(of)
          expect(Maybe.of(int).ap(mf)).toStrictEqual(mf.ap(Maybe.of(x => x(int))))
        })
      )

      fc.assert(
        fc.property(intOrUndefined, int => {
          expect(maybe.ap(mf, maybe.of(int))).toStrictEqual(
            maybe.ap(
              maybe.of(x => x(int)),
              mf
            )
          )
        })
      )
    })
  })

  describe('instance of Monad', () => {
    const mf = (a: number) => Maybe.of(f(a))

    it('should obey the left maybe law', () => {
      fc.assert(
        fc.property(intOrUndefined, int => {
          expect(Maybe.of(int).chain(mf)).toStrictEqual(mf(int))
        })
      )

      fc.assert(
        fc.property(intOrUndefined, int => {
          expect(maybe.chain(mf, maybe.of(int))).toStrictEqual(mf(int))
        })
      )
    })

    it('should obey the right maybe law', () => {
      fc.assert(
        fc.property(intOrUndefined, int => {
          const m = Maybe.of(int)

          expect(m.chain(Maybe.of)).toStrictEqual(m)
        })
      )

      fc.assert(
        fc.property(intOrUndefined, int => {
          const m = maybe.of(int)

          expect(maybe.chain(maybe.of, m)).toStrictEqual(m)
        })
      )
    })
  })
})
