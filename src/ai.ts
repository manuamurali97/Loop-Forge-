import { defaultStyle } from "./types"
import type { VisualStyle } from "./types"

export function generateStyleFromPrompt(prompt: string): VisualStyle {
  const lower = prompt.toLowerCase()
  let style: VisualStyle = { ...defaultStyle }

  // SYMMETRY NUMBER DETECTION
  const symmetryMatch = lower.match(/(\d+)\s*(fold|symmetry)?/)
  if (symmetryMatch) {
    const value = parseInt(symmetryMatch[1])
    if (!isNaN(value)) {
      style.symmetry = Math.min(Math.max(value, 3), 20)
    }
  }

  // KEYWORDS
  if (lower.includes("metallic") || lower.includes("chrome")) {
    style.metallic = 1
    style.contrast = 1.6
  }
  // PASTEL
if (lower.includes("pastel")) {
  style.saturation = 0.35
  style.brightness = 1.1
  style.contrast = 0.8
  style.metallic = 0
}

  if (lower.includes("sharp")) {
    style.contrast = 1.8
  }

  // DARK
if (lower.includes("dark")) {
  style.saturation = 0.7
  style.brightness = 0.5
  style.contrast = 1.2
  style.metallic = 0.2
}


  // NEON
if (lower.includes("neon")) {
  style.saturation = 1.2
  style.brightness = 1.4
  style.contrast = 1.6
  style.metallic = 0.4
}

  // COLORS
  if (lower.includes("red")) {
    style.primaryHue = 0.0
    style.secondaryHue = 0.05
  }

  if (lower.includes("green")) {
    style.primaryHue = 0.33
    style.secondaryHue = 0.38
  }

  if (lower.includes("blue")) {
    style.primaryHue = 0.6
    style.secondaryHue = 0.65
  }

  

  if (lower.includes("purple")) {
    style.primaryHue = 0.8
    style.secondaryHue = 0.85
  }

  if (lower.includes("cyan")) {
    style.primaryHue = 0.5
    style.secondaryHue = 0.55
  }

  

  if (lower.includes("white background")) {
  style.background = "#ffffff"
}

if (lower.includes("light background")) {
  style.background = "#f5f5f5"
}

if (lower.includes("black background")) {
  style.background = "#000000"
}

  return style
}