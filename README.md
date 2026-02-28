# LoopForge

LoopForge is a prompt-driven generative visual engine built in the browser using React, Three.js, and custom GLSL shaders.

Type a structured prompt like:

> "metallic blue cyber sigil with 8-fold symmetry"

The system translates the prompt into visual parameters — color palette, symmetry, contrast, motion intensity — and renders everything in real time on the GPU.

---

## Demo Features

- Prompt-driven visual generation
- Rule-based prompt interpreter (runs locally)
- Real-time shader rendering (WebGL)
- Smooth morph transitions between styles
- Mouse interaction
- Bloom postprocessing
- PNG export
- Loop video export (WebM)
- Presentation mode
- Surprise Me generator
- Helper prompt suggestions

---

## 🏗 Architecture

The system is intentionally layered:

Text Interpretation Layer  
→ Converts prompt into structured visual parameters

Style Engine  
→ Maps parameters to animation, color, symmetry, motion logic

GPU Rendering Layer  
→ Custom GLSL fragment shader renders visuals in real time

This separation allows the prompt interpreter to be swapped with an OpenAI model or other LLM without changing the rendering layer.

---

## 🛠 Tech Stack

Frontend:
- React
- TypeScript
- React Three Fiber
- Three.js
- GLSL (custom fragment shader)

Rendering:
- WebGL
- Shader-based procedural generation
- Postprocessing with Bloom

---

## 🔮 Future Directions

- LLM-based prompt refinement
- Brand-safe visual modes
- Accessibility / low-intensity mode
- Save & share visual configurations
- SVG / vector export
- AI-assisted prompt development

---

## 📦 Installation

```bash
git clone https://github.com/yourusername/loopforge.git
cd loopforge
npm install
npm run dev
