import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import type { VisualStyle } from "./types"

type SceneProps = {
  style: VisualStyle
}

export default function Scene({ style }: SceneProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uContrast: { value: 1 },
    uMetallic: { value: 0 },
    uSymmetry: { value: 6 },
    uPrimaryHue: { value: 0.6 },
    uSecondaryHue: { value: 0.8 },
    uSaturation: { value: 1.0 },
    uBrightness: { value: 1.0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
  }), [])

  useFrame(({ clock, mouse }) => {
  if (!materialRef.current) return

  const elapsed = clock.getElapsedTime()
  const duration = style.duration || 6
  const loopTime = (elapsed % duration) / duration

  const u = materialRef.current.uniforms

  u.uTime.value = loopTime

  // Smooth morph
  u.uContrast.value = THREE.MathUtils.lerp(u.uContrast.value, style.contrast, 0.05)
  u.uMetallic.value = THREE.MathUtils.lerp(u.uMetallic.value, style.metallic, 0.05)
  u.uSymmetry.value = THREE.MathUtils.lerp(u.uSymmetry.value, style.symmetry, 0.05)
  u.uPrimaryHue.value = THREE.MathUtils.lerp(u.uPrimaryHue.value, style.primaryHue, 0.05)
  u.uSecondaryHue.value = THREE.MathUtils.lerp(u.uSecondaryHue.value, style.secondaryHue, 0.05)

  u.uSaturation.value = style.saturation
  u.uBrightness.value = style.brightness

  // Mouse is normalized (-1 to 1)
  u.uMouse.value.set(mouse.x, mouse.y)
})

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  )
}

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform float uContrast;
  uniform float uMetallic;
  uniform float uSymmetry;

  uniform float uPrimaryHue;
  uniform float uSecondaryHue;
  uniform float uSaturation;
  uniform float uBrightness;

  uniform vec2 uMouse;

  varying vec2 vUv;

  const float PI = 3.14159265359;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
           (c - a) * u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
  }

  vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0., -1./3., 2./3., -1.);
    vec4 p = mix(vec4(c.bg, K.wz),
                 vec4(c.gb, K.xy),
                 step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r),
                 vec4(c.r, p.yzx),
                 step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6. * d + e)),
                d / (q.x + e),
                q.x);
  }

  vec3 hsv2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x*6. + vec3(0.,4.,2.),
                              6.)-3.)-1.,
                     0.,
                     1.);
    return c.z * mix(vec3(1.), rgb, c.y);
  }

  void main() {

  float angle = uTime * 2.0 * PI;

  vec2 uv = vUv - 0.5;

  float r = length(uv);
  float theta = atan(uv.y, uv.x);

  float symmetry = uSymmetry;
  float sectorAngle = 2.0 * PI / symmetry;

  theta = mod(theta, sectorAngle);
  theta = abs(theta - sectorAngle * 0.5);

  float mouseInfluence = 1.0 + (uMouse.x * 0.5);

float pattern = sin(r * (10.0 + uContrast * 10.0) * mouseInfluence 
               - angle * (2.0 + uMetallic * 3.0))
               * sin(theta * (5.0 + uSymmetry + uMouse.y * 5.0));
  float shape = smoothstep(0.2, 0.0, abs(pattern));

  // Blend between two hues based on radial position
  float colorMix = smoothstep(0.0, 0.6, r);

  vec3 colorA = hsv2rgb(vec3(uPrimaryHue, uSaturation, shape * uBrightness));
  vec3 colorB = hsv2rgb(vec3(uSecondaryHue, uSaturation, shape * uBrightness));

  vec3 finalColor = mix(colorA, colorB, colorMix);

  finalColor = pow(finalColor, vec3(1.0 / uContrast));

  float highlight = pow(shape, 8.0);
  finalColor += uMetallic * highlight * 1.2;

  gl_FragColor = vec4(finalColor, 1.0);
}
`