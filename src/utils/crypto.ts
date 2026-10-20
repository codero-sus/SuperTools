import * as CryptoES from 'crypto-es';

export const CryptoJS: any = {
  ...CryptoES,
  enc: {
    Utf8: CryptoES.Utf8,
    Hex: CryptoES.Hex,
    Base64: CryptoES.Base64,
    Latin1: CryptoES.Latin1,
    Utf16: CryptoES.Utf16,
  },
  lib: {
    WordArray: CryptoES.WordArray,
  },
};

export default CryptoJS;
