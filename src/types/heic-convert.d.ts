declare module 'heic-convert' {
  interface ConvertOptions {
    /** Input HEIC/HEIF buffer */
    buffer: Buffer | ArrayBuffer
    /** Output format */
    format: 'JPEG' | 'PNG' | 'WEBP'
    /** Quality between 0 and 1 (JPEG/WEBP only) */
    quality?: number
  }

  function convert(options: ConvertOptions): Promise<ArrayBuffer>

  export = convert
}
