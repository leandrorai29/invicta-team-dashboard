export async function POST(request: Request) {
  try {
    const { transcript, nombre, objecionActual } = await request.json();

    if (!transcript || typeof transcript !== "string" || transcript.trim().length < 20) {
      return Response.json(
        { error: "Pegá un transcript más completo antes de analizar." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "Falta configurar GEMINI_API_KEY en las variables de entorno de Vercel." },
        { status: 500 }
      );
    }

    const prompt = `Sos un coach de ventas experto en closing de servicios high-ticket (real estate performance / marketing). Analizá esta transcripción de una llamada de ventas${
      nombre ? ` con el lead "${nombre}"` : ""
    }${objecionActual ? ` (objeción ya tipificada: ${objecionActual})` : ""}.

Respondé ÚNICAMENTE con un JSON válido, sin texto antes ni después ni backticks, con esta forma exacta:
{
  "resumen": "2-3 líneas resumiendo qué pasó en la llamada",
  "objecionPrincipal": "la objeción principal detectada, en pocas palabras",
  "queSalioBien": ["punto 1", "punto 2"],
  "queMejorar": ["punto 1", "punto 2"],
  "proximoPasoSugerido": "una frase concreta de qué hacer en el próximo contacto"
}

Transcripción:
"""
${transcript.slice(0, 15000)}
"""`;

    async function callGemini() {
      return fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.4, maxOutputTokens: 1000 },
          }),
        }
      );
    }

    let resp = await callGemini();
    if (!resp.ok && resp.status === 503) {
      // El modelo gratuito puede saturarse en picos — reintenta una vez
      await new Promise((r) => setTimeout(r, 1500));
      resp = await callGemini();
    }

    if (!resp.ok) {
      const errText = await resp.text();
      return Response.json(
        { error: "Error llamando a la IA: " + errText.slice(0, 300) },
        { status: 502 }
      );
    }

    const data = await resp.json();
    const rawText: string =
      data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || "").join("\n") || "";
    const cleaned = rawText.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return Response.json(
        { error: "La IA no devolvió un formato válido. Probá de nuevo." },
        { status: 502 }
      );
    }

    return Response.json(parsed);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return Response.json({ error: "Error inesperado: " + message }, { status: 500 });
  }
}
