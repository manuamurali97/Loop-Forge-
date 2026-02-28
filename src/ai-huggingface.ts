export async function generateStyleFromPrompt(prompt: string) {

  const response = await fetch("http://localhost:3001/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt })
  })

  const result = await response.json()
  console.log("HF RAW RESPONSE:", result)

  const text = result.choices?.[0]?.message?.content || ""
  console.log("HF GENERATED TEXT:", text)

  const jsonMatch = text.match(/\{[\s\S]*\}/)

  if (!jsonMatch) throw new Error("Invalid AI output")

  return JSON.parse(jsonMatch[0])
}