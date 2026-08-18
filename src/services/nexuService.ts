export interface NexuAnalysis {
  estadoCaso:
    | "En diagnóstico"
    | "Pendiente"
    | "Resuelto"
    | "Requiere revisión técnica"
    | "Cita en proceso"
    | "Cita agendada";

  resumen: string;

  problemaPrincipal: string;

  tonoAparente:
    | "Tranquilo"
    | "Neutral"
    | "Confundido"
    | "Frustrado"
    | "Molesto";

  complejidad:
    | "Baja"
    | "Media"
    | "Alta";

  cita: {
    estado:
      | "No requerida"
      | "En proceso"
      | "Agendada"
      | "No agendada";

    nombre: string | null;
    correo: string | null;
    fecha: string | null;
    hora: string | null;
    motivo: string | null;
  };

  datosRecolectados: {
    nombre: boolean;
    correo: boolean;
    fecha: boolean;
    hora: boolean;
    motivo: boolean;
  };

  siguienteAccion: string;

  requiereRevisionTecnica: boolean;
}

export interface NexuMessage {
  role: "user" | "assistant";
  content: string;
}

export async function analyzeConversation(
  messages: NexuMessage[]
): Promise<NexuAnalysis> {
  const response = await fetch("/api/nexu", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error("NEXU API error:", {
      status: response.status,
      body: errorText,
    });

    throw new Error("No fue posible analizar la conversación");
  }

  return response.json();
}