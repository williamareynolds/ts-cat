export interface HKT<URI, A> {
  _URI: URI
  _A: A
}

export interface URItoHKT<A> {}

export type URIs = keyof URItoHKT<any>

export type Type<URI extends URIs, A> = URItoHKT<A>[URI]

export interface HKT2<URI, A, B> {
  _URI: URI
  _A: A
}

export interface URItoHKT2<A, B> {}

export type URI2s = keyof URItoHKT2<any, any>

export type Type2<URI extends URI2s, A, B> = URItoHKT2<A, B>[URI]
