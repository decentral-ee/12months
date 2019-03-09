const hw = window.hwcrypto;

export async function sign(hash) {
  const cert = await hw.getCertificate({lang: 'en'});
  // console.log("Using certificate:\n" + cert);
  const signature = await hw.sign(cert, {type: 'SHA-256', hex: hash}, {lang: 'en'});
  return signature;
}
