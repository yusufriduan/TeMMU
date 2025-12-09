export default function LoadImage(imageHex) {
  function hexToUint8Array(hex) {
    // Remove leading \x if present
    if (hex.startsWith("\\x")) {
      hex = hex.slice(2);
    }
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return bytes;
  }

  function guessImageType(buffer) {
    if (
      buffer
        .slice(0, 8)
        .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    ) {
      return "png";
    }
    if (buffer.slice(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) {
      return "jpg";
    }
    return "bin";
  }

  const bytes = hexToUint8Array(imageHex);
  const imgType = guessImageType(Buffer.from(bytes));
  const blob = new Blob([bytes.buffer], {
    type: `image/${imgType}`,
  });
  console.log(blob);
  const url = URL.createObjectURL(blob);

  return url;
}
