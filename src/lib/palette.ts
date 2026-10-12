// Mirrors the CSS variables in src/app/globals.css for code that can't read CSS (canvas).
export const PALETTE = {
  bg: '#f1f2f5',
  ink: '#0b0f1a',
  ink2: '#3b4152',
  acc: '#2b4bff',
  acc2: '#0096e6',
  card: '#e7e9f0',
  card2: '#dcdfe8',
}

export const inkA = (a: number) => {
  const n = parseInt(PALETTE.ink.slice(1), 16)
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`
}
