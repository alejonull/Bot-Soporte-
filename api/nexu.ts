import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    estadoCaso: {
      type: Type.STRING,
      enum: [
        "En diagnóstico",
        "Pendiente",
        "Resuelto",
        "Requiere revisión técnica",
        "Cita en proceso",
        "Cita agendada",
      ],
    },

    resumen: {
      type: Type.STRING,
    },

    problemaPrincipal: {
      type: Type.STRING,
    },

    tonoAparente: {
      type: Type.STRING,
      enum: [
        "Tranquilo",
        "Neutral",
        "Confundido",
        "Frustrado",
        "Molesto",
      ],
    },

    complejidad: {
      type: Type.STRING,
      enum: ["Baja", "Media", "Alta"],
    },

    cita: {
      type: Type.OBJECT,
      properties: {
        estado: {
          type: Type.STRING,
          enum: [
            "No requerida",
            "En proceso",
            "Agendada",
            "No agendada",
          ],
        },
        nombre: {
          type: Type.STRING,
          nullable: true,
        },
        correo: {
          type: Type.STRING,
          nullable: true,
        },
        fecha: {
          type: Type.STRING,
          nullable: true,
        },
        hora: {
          type: Type.STRING,
          nullable: true,
        },
        motivo: {
          type: Type.STRING,
          nullable: true,
        },
      },
      required: [
        "estado",
        "nombre",
        "correo",
        "fecha",
        "hora",
        "motivo",
      ],
    },

    datosRecolectados: {
      type: Type.OBJECT,
      properties: {
        nombre: { type: Type.BOOLEAN },
        correo: { type: Type.BOOLEAN },
        fecha: { type: Type.BOOLEAN },
        hora: { type: Type.BOOLEAN },
        motivo: { type: Type.BOOLEAN },
      },
      required: [
        "nombre",
        "correo",
        "fecha",
        "hora",
        "motivo",
      ],
    },

    siguienteAccion: {
      type: Type.STRING,
    },

    requiereRevisionTecnica: {
      type: Type.BOOLEAN,
    },
  },

  required: [
    "estadoCaso",
    "resumen",
    "problemaPrincipal",
    "tonoAparente",
    "complejidad",
    "cita",
    "datosRecolectados",
    "siguienteAccion",
    "requiereRevisionTecnica",
  ],
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método no permitido",
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: "GEMINI_API_KEY no está configurada",
    });
  }

  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "No se recibió una conversación válida",
      });
    }

    const conversation = messages
      .map((message: any) => {
        const role =
          message.role === "user"
            ? "CLIENTE"
            : "AGENTE DE SOPORTE";

        return `${role}: ${message.content}`;
      })
      .join("\n\n");

    const prompt = `
Eres NEXU, un analizador interno de conversaciones de soporte técnico.

Tu función es analizar la conversación actual entre un cliente y un agente de soporte.

NO hablas con el cliente.
NO ejecutas acciones.
NO agendas citas.
NO modificas citas.
NO cancelas citas.
NO utilizas herramientas externas.
NO inventes información.

Tu única función es analizar y clasificar la conversación para alimentar un panel interno.

CONVERSACIÓN:

${conversation}

REGLAS DE ANÁLISIS:

1. estadoCaso:
Selecciona únicamente uno de estos valores:
- En diagnóstico
- Pendiente
- Resuelto
- Requiere revisión técnica
- Cita en proceso
- Cita agendada

2. resumen:
Resume el estado actual del caso en máximo 2 a 4 líneas.
Incluye únicamente información presente en la conversación.

3. problemaPrincipal:
Describe el problema principal en una frase corta.

4. tonoAparente:
Selecciona únicamente:
- Tranquilo
- Neutral
- Confundido
- Frustrado
- Molesto

Evalúa únicamente el tono aparente del texto.
No afirmes estados emocionales como hechos.

5. complejidad:
Selecciona:
- Baja
- Media
- Alta

6. cita:
Analiza si actualmente existe intención o proceso de cita.

Los datos necesarios para una cita son:
- nombre
- correo
- fecha
- hora
- motivo

Si un dato no aparece claramente en la conversación, devuelve null.

Nunca inventes ni completes datos.

Estados permitidos de cita:
- No requerida
- En proceso
- Agendada
- No agendada

7. datosRecolectados:
Marca true únicamente cuando el dato correspondiente haya sido proporcionado claramente por el cliente o confirmado explícitamente durante la conversación.

No consideres un dato recolectado por inferencia.

8. siguienteAccion:
Describe en una frase corta cuál parece ser la siguiente acción lógica del caso.

Ejemplos:
- Continuar diagnóstico
- Esperar respuesta del cliente
- Solicitar correo electrónico
- Solicitar fecha y hora
- Recomendar revisión técnica
- Cita ya gestionada

Esto es únicamente informativo.
No ejecutes la acción.

9. requiereRevisionTecnica:
true únicamente cuando la conversación indique que probablemente hace falta una revisión técnica o física del equipo.

Devuelve únicamente la estructura solicitada.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.2,
      },
    });

    if (!response.text) {
      throw new Error("Gemini no devolvió contenido");
    }

    const analysis = JSON.parse(response.text);

    return res.status(200).json(analysis);

  } catch (error) {
    console.error("NEXU ERROR:", error);

    return res.status(500).json({
      error: "No fue posible analizar la conversación",
    });
  }
}