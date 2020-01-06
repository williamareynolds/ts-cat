import * as fc from 'fast-check'
import { Maybe, maybe } from '../src/ts-cat'

const maybeIdentity = (a: number) => a

const f = (a?: number): number | null | undefined => {
  if (a === undefined || a === null) return a
  return a * 2
}

const g = (a: number): number | null | undefined => {
  if (a === undefined || a === null) return a
  return a - 8
}

const intOrUndefined = fc.option(fc.integer(), 3)

const fOrUndefined = fc.frequency(
  {
    weight: 1,
    arbitrary: fc.constant(undefined)
  },
  {
    weight: 9,
    arbitrary: fc.func(fc.integer())
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

  describe('instance of functor', () => {
    it('should obey the identity law', () => {
      fc.assert(
        fc.property(intOrUndefined, int => {
          const m = Maybe.of(int)
          expect(m.map(maybeIdentity)).toStrictEqual(m)
        })
      )

      fc.assert(
        fc.property(intOrUndefined, int => {
          const m = maybe.of(int)
          expect(maybe.map(maybeIdentity, m)).toStrictEqual(m)
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
    it('should obey the identity law', () => {
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

    it('should obey the left identity law', () => {
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

  describe('instance of Alt', () => {
    it('should obey the law of associativity', () => {
      fc.assert(
        fc.property(intOrUndefined, intOrUndefined, intOrUndefined, (a, b, c) => {
          const x = Maybe.of(a)
          const y = Maybe.of(b)
          const z = Maybe.of(c)

          expect(x.alt(y).alt(z)).toStrictEqual(x.alt(y.alt(z)))
        })
      )

      fc.assert(
        fc.property(intOrUndefined, intOrUndefined, intOrUndefined, (a, b, c) => {
          const x = maybe.of(a)
          const y = maybe.of(b)
          const z = maybe.of(c)

          expect(maybe.alt(maybe.alt(x, y), z)).toStrictEqual(maybe.alt(x, maybe.alt(y, z)))
        })
      )
    })

    it('should obey the law of distributivity', () => {
      fc.assert(
        fc.property(intOrUndefined, intOrUndefined, (a, b) => {
          const x = Maybe.of(a)
          const y = Maybe.of(b)

          expect(x.alt(y).map(f)).toStrictEqual(x.map(f).alt(y.map(f)))
        })
      )

      fc.assert(
        fc.property(intOrUndefined, intOrUndefined, (a, b) => {
          const x = maybe.of(a) // 0
          const y = maybe.of(b) // 1

          expect(maybe.map(maybeIdentity, maybe.alt(y, x))).toStrictEqual(
            maybe.alt(maybe.map(maybeIdentity, y), maybe.map(maybeIdentity, x))
          )
        })
      )
    })
  })

  describe('instance of Plus', () => {
    it('should obey the law of right identity', () => {
      fc.assert(
        fc.property(intOrUndefined, intOrUndefined, (a, b) => {
          const x = Maybe.of(a)
          const y = Maybe.of(b)

          expect(x.alt(y.zero())).toStrictEqual(x)

          const r = maybe.of(a)
          const s = maybe.of(b)

          expect(maybe.alt(y.zero(), x)).toStrictEqual(x)
        })
      )
    })

    it('should obey the law of left identity', () => {
      fc.assert(
        fc.property(intOrUndefined, intOrUndefined, (a, b) => {
          const x = Maybe.of(a)
          const y = Maybe.of(b)

          expect(y.zero().alt(x)).toStrictEqual(x)

          const r = maybe.of(a)
          const s = maybe.of(b)

          expect(maybe.alt(r, maybe.zero(s))).toStrictEqual(r)
        })
      )
    })

    it('should obey the law of annihilation', () => {
      fc.assert(
        fc.property(intOrUndefined, a => {
          const x = Maybe.of(a)

          expect(x.zero().map(f)).toStrictEqual(x.zero())

          const r = maybe.of(a)

          expect(maybe.map(f, maybe.zero(x))).toStrictEqual(maybe.zero(x))
        })
      )
    })
  })

  describe('instance of Alternative', () => {
    it('should obey the law of distributivity', () => {
      fc.assert(
        fc.property(intOrUndefined, fOrUndefined, fOrUndefined, (x, f, g) => {
          const x1 = Maybe.of(x)
          const f1 = Maybe.of(f)
          const g1 = Maybe.of(g)

          expect(x1.ap(f1.alt(g1))).toStrictEqual(x1.ap(f1).alt(x1.ap(g1)))

          const x2 = maybe.of(x)
          const f2 = maybe.of(f)
          const g2 = maybe.of(g)

          expect(maybe.ap(maybe.alt(g2, f2), x2)).toStrictEqual(
            maybe.alt(maybe.ap(g2, x2), maybe.ap(f2, x2))
          )
        })
      )
    })

    it('should obey the law of annihilation', () => {
      fc.assert(
        fc.property(intOrUndefined, fOrUndefined, (x, f) => {
          const x1 = Maybe.of(x)
          const f1 = Maybe.of(f)

          expect(x1.ap(f1.zero())).toStrictEqual(f1.zero())

          const x2 = maybe.of(x)
          const f2 = maybe.of(f)

          expect(maybe.ap(maybe.zero(f2), x2)).toStrictEqual(maybe.zero(f2))
        })
      )
    })
  })
})
