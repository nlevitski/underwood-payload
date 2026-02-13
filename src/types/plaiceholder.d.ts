declare module 'plaiceholder' {
  import type { Buffer } from 'node:buffer'

  export interface GetPlaiceholderResult {
    base64: string
  }

  export function getPlaiceholder(src: Buffer): Promise<GetPlaiceholderResult>
}
