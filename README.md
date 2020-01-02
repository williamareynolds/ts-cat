# ts-cat

[![Build Status](https://travis-ci.org/williamareynolds/ts-cat.svg?branch=master)](https://travis-ci.org/williamareynolds/ts-cat)
[![Coverage Status](https://coveralls.io/repos/github/williamareynolds/ts-cat/badge.svg?branch=master)](https://coveralls.io/github/williamareynolds/ts-cat?branch=master)

A static-land and fantasy-land compliant library containing interfaces for common type-classes and
common instances of them.

This library is currently in very active development. Be aware that changes will be frequent, but
that breaking changes will always incur a major version change.

## Limitations

Be aware that Typescript simply does not support some typing behaviors that would make some things
work as expected. The most serious of these issues is that static methods cannot be specified in
interfaces. This means that a fantasy-land compliant interface for Applicative cannot be properly
created because `of` can't be enforced as a class method. There is currently an open issue for this
[here][ts-static-interface].

## Documentation

[Theory and Usage][theory-doc]

[API Docs][api-doc]

[api-doc]: https://williamareynolds.github.io/ts-cat/
[theory-doc]: https://github.com/williamareynolds/ts-cat/wiki
[ts-static-interface]: https://github.com/microsoft/TypeScript/issues/33892
