export function getRandomDarkHexColor() {
  // Generate random RGB values, ensuring they are lower than 128 for darkness
  const r = Math.floor(Math.random() * 128);
  const g = Math.floor(Math.random() * 128);
  const b = Math.floor(Math.random() * 128);

  // Convert RGB to Hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  return rgbToHex(r, g, b);
}
