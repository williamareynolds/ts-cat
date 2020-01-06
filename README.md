# ts-cat

[![Build Status](https://travis-ci.org/williamareynolds/ts-cat.svg?branch=master)](https://travis-ci.org/williamareynolds/ts-cat)
[![Coverage Status](https://coveralls.io/repos/github/williamareynolds/ts-cat/badge.svg?branch=master)](https://coveralls.io/github/williamareynolds/ts-cat?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/f8a3e86101d4442fb8c6bace12318f09)](https://www.codacy.com/manual/williamareynolds/ts-cat?utm_source=github.com&utm_medium=referral&utm_content=williamareynolds/ts-cat&utm_campaign=Badge_Grade)
[![npm version](https://badge.fury.io/js/ts-cat.svg)](https://badge.fury.io/js/ts-cat)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

A static-land and fantasy-land compliant library containing interfaces for common type-classes and
common instances of them.

This library is currently in very active development. Be aware that changes will be frequent, but
that breaking changes will always incur a major version change.

## Limitations

### Static Interfaces

Be aware that Typescript simply does not support some typing behaviors that would make some things
work as expected. The most serious of these issues is that static methods cannot be specified in
interfaces. This means that a fantasy-land compliant interface for Applicative cannot be properly
created because `of` can't be enforced as a class method. There is currently an open issue for this
[here][ts-static-interface].

### Static Types

static-land implementations are limited in their ability to properly type results. This appears to
be an issue with typescript, rather than an issue with the implementation. Considering the following
demonstration with `Identity<number>`:

```typescript
import { identity } from './src/instance/Identity'

const sample = identity.of(5)
const mapped = identity.map(a => a + 5, sample)
```

In this case, typescript may think the type of `mapped` is `Identity<any>`, even though it's actually
`Identity<number>`. If we move the static functions from the `identity` object to the `Identity`
class as static functions, the type issues are resolved. Unfortunately, we would have to define
those static functions on the class, rather than setting them equal to the functions from the
`identity` object. Due to Typescript's lack of static interface declarations, this causes us to
lose the value of having an interface for the static functions.

## Documentation

[fantasy-land][fantasy-land-doc]

[static-land][static-land-doc]

[Theory and Usage][theory-doc]

[API Docs][api-doc]

[api-doc]: https://williamareynolds.github.io/ts-cat/

[fantasy-land-doc]: https://github.com/fantasyland/fantasy-land

[static-land-doc]: https://github.com/fantasyland/static-land

[theory-doc]: https://github.com/williamareynolds/ts-cat/wiki

[ts-static-interface]: https://github.com/microsoft/TypeScript/issues/33892
