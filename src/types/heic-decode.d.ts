declare module 'heic-decode' {
  interface DecodeOptions {
    buffer: Buffer | ArrayBuffer
  }

  interface DecodedImage {
    width: number
    height: number
    data: Uint8ClampedArray
  }

  function decode(options: DecodeOptions): Promise<DecodedImage>

  export = decode
}
