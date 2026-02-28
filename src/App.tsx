import { Canvas } from "@react-three/fiber"
import { Suspense, useState } from "react"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import Scene from "./Scene"

import { defaultStyle } from "./types"
import type { VisualStyle } from "./types"
import { generateStyleFromPrompt } from "./ai"

export default function App() {
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState<VisualStyle>(defaultStyle)
  const [presentationMode, setPresentationMode] = useState(false)

  const examplePrompts = [
    "Metallic blue cyber sigil with 8 fold symmetry",
    "Dark mechanical emblem with 6 symmetry",
    "Neon purple mandala with 12 fold symmetry",
    "Pastel green geometric emblem",
    "Intense red cyber symbol with sharp contrast"
  ]

  const applyPrompt = (text: string) => {
    const newStyle = generateStyleFromPrompt(text)
    setStyle({ ...defaultStyle, ...newStyle })
  }

  const exportPNG = () => {
    const canvas = document.querySelector("canvas")
    if (!canvas) return

    const dataURL = (canvas as HTMLCanvasElement).toDataURL("image/png")
    const a = document.createElement("a")
    a.href = dataURL
    a.download = "loopforge.png"
    a.click()
  }

  const exportLoop = () => {
    const canvas = document.querySelector("canvas")
    if (!canvas) return

    const duration = style.duration || 6
    const stream = (canvas as HTMLCanvasElement).captureStream(60)
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" })
    const chunks: BlobPart[] = []

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data)
    }

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "loopforge.webm"
      a.click()
      URL.revokeObjectURL(url)
    }

    recorder.start()
    setTimeout(() => recorder.stop(), duration * 1000)
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: style.background,
        transition: "background 0.4s ease",
        color: "#ffffff",
        fontFamily: "system-ui",
        display: presentationMode ? "block" : "flex"
      }}
    >
      {/* Sidebar */}
      {!presentationMode && (
        <div
          style={{
            flex: "0 0 320px",
            padding: "30px",
            background: "#15151a",
            height: "100vh",
            overflowY: "auto",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: "20px"
          }}
        >
          <h2>LoopForge</h2>

          <button
            onClick={() => setPresentationMode(true)}
            style={{
              width: "100%",
              padding: "8px",
              background: "#222",
              border: "1px solid #444",
              color: "white",
              cursor: "pointer"
            }}
          >
            Presentation Mode
          </button>

          <div>
            <textarea
              placeholder="Describe your emblem..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              style={{
                width: "100%",
                resize: "none",
                background: "#1c1c22",
                border: "1px solid #2a2a33",
                borderRadius: "8px",
                padding: "12px",
                color: "white",
                fontSize: "14px"
              }}
            />

            <button
              onClick={() => applyPrompt(prompt)}
              style={{
                marginTop: "10px",
                width: "100%",
                background:
                  "linear-gradient(135deg, #3a6cff, #7c4dff)",
                border: "none",
                borderRadius: "6px",
                padding: "10px",
                color: "white",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Generate Emblem
            </button>
          </div>

          {/* Examples */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {examplePrompts.map((example, i) => (
              <div
                key={i}
                onClick={() => {
                  setPrompt(example)
                  applyPrompt(example)
                }}
                style={{
                  padding: "6px 10px",
                  fontSize: "12px",
                  borderRadius: "20px",
                  background: "#24242d",
                  border: "1px solid #333",
                  cursor: "pointer"
                }}
              >
                {example}
              </div>
            ))}
          </div>

          {/* Surprise */}
          <button
            onClick={() => {
              const colors = ["red", "blue", "green", "purple", "cyan"]
              const moods = ["metallic", "dark", "neon", "sharp"]
              const sym = Math.floor(Math.random() * 10) + 5

              const randomPrompt =
                `${moods[Math.floor(Math.random() * moods.length)]} ` +
                `${colors[Math.floor(Math.random() * colors.length)]} emblem ` +
                `with ${sym} fold symmetry`

              setPrompt(randomPrompt)
              applyPrompt(randomPrompt)
            }}
            style={{
              width: "100%",
              background: "#2a2a33",
              border: "1px solid #444",
              borderRadius: "6px",
              padding: "8px",
              color: "white",
              cursor: "pointer"
            }}
          >
            🎲 Surprise Me
          </button>

          {/* Palette */}
          <div>
            <div style={{ fontSize: "12px", opacity: 0.6, marginBottom: "8px" }}>
              Active Palette
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              {[style.primaryHue, style.secondaryHue].map((hue, i) => {
                const color = `hsl(${hue * 360}, ${
                  style.saturation * 100
                }%, 50%)`
                return (
                  <div
                    key={i}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: color,
                      border: "2px solid #333"
                    }}
                  />
                )
              })}
            </div>
          </div>

          <button
            onClick={exportLoop}
            style={{
              width: "100%",
              padding: "10px",
              background: "#2a2a33",
              border: "1px solid #444",
              color: "white",
              cursor: "pointer"
            }}
          >
            🎥 Export Loop
          </button>

          <button
            onClick={exportPNG}
            style={{
              width: "100%",
              padding: "10px",
              background: "#2a2a33",
              border: "1px solid #444",
              color: "white",
              cursor: "pointer"
            }}
          >
            🖼 Export PNG
          </button>
        </div>
      )}

      {/* Canvas */}
      <div
        style={
          presentationMode
            ? { position: "fixed", inset: 0 }
            : { flex: 1 }
        }
      >
        {presentationMode && (
          <button
            onClick={() => setPresentationMode(false)}
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              zIndex: 10,
              padding: "8px 12px",
              background: "#222",
              border: "1px solid #444",
              color: "white",
              cursor: "pointer"
            }}
          >
            Exit Presentation
          </button>
        )}

        <Canvas
          gl={{ preserveDrawingBuffer: true }}
          style={{ width: "100%", height: "100%" }}
          camera={{ position: [0, 0, 1] }}
        >
          <Suspense fallback={null}>
            <Scene style={style} />
            <EffectComposer>
              <Bloom
                intensity={1.2}
                luminanceThreshold={0.3}
                luminanceSmoothing={0.9}
              />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}