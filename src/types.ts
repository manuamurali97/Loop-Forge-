export type VisualStyle = {
  noiseScale: number
  distortion: number
  hue: number
  duration: number
  flowIntensity: number
  contrast: number
  metallic: number
  symmetry: number
  primaryHue: number
  secondaryHue: number
  saturation: number
  brightness: number
  background: string
}

export const defaultStyle: VisualStyle = {
  noiseScale: 4,
  distortion: 0.3,
  hue: 0.0,
  duration: 6,
  flowIntensity: 0.05,
  contrast: 1.0,
  metallic: 0.0,
  symmetry: 6,
  primaryHue: 0.6,
  secondaryHue: 0.8,
  saturation: 1.0,
  brightness: 1.0,
  background: "#0e0e11",
}