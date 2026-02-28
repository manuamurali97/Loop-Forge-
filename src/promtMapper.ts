import type { VisualStyle } from "./types"
import { defaultStyle } from "./types"

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function generateStyleFromPrompt(prompt: string): VisualStyle {
  const lower = prompt.toLowerCase()

  let style: VisualStyle = { ...defaultStyle }

  // --- SYMMETRY ---
  const symmetryMatch = lower.match(/(\d+)[- ]?(fold|symmetry)?/)
  if (symmetryMatch) {
    const value = parseInt(symmetryMatch[1])
    if (!isNaN(value)) {
      style.symmetry = clamp(value, 3, 20)
    }
  }

  if (lower.includes("mandala")) style.symmetry = 12
  if (lower.includes("sigil")) style.symmetry = 8
  if (lower.includes("emblem")) style.symmetry = 6

  // --- ENERGY ---
  if (lower.includes("high energy") || lower.includes("intense")) {
    style.duration = 4
    style.contrast = 1.6
  }

  if (lower.includes("slow") || lower.includes("cinematic")) {
    style.duration = 10
    style.contrast = 1.2
  }

  // --- MATERIAL ---
  if (lower.includes("metallic") || lower.includes("chrome")) {
    style.metallic = 1.0
    style.contrast = 1.8
  }

  if (lower.includes("dark")) {
    style.contrast = 0.8
  }

  if (lower.includes("sharp")) {
    style.contrast = clamp(style.contrast + 0.5, 0.5, 2)
  }

  // --- COLOR HINTS ---
  if (lower.includes("blue")) style.hue = 0.6
  if (lower.includes("purple")) style.hue = 0.8
  if (lower.includes("green")) style.hue = 0.3
  if (lower.includes("red")) style.hue = 0.0

  return style
}