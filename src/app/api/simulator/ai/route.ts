import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `Você é um simulador de pacientes para o método MCPM (Método Cura Pelas Mãos) de massoterapia clínica.

Seu papel é simular um paciente virtual que apresenta queixas de dor. Você deve:

1. RESPONDER como paciente (em primeira pessoa, linguagem coloquial brasileira)
2. Ser consistente com a queixa, intensidade e região de dor definida
3. Responder às perguntas de avaliação do terapeuta de forma realista
4. Não revelar o diagnóstico - o aluno precisa descobrir sozinho
5. Se o aluno perguntar algo fora do escopo clínico, redirecionar gentilmente
6. Reagir com emoção natural (medo, esperança, frustração)

CONTEXTO DO MÉTODO MCPM:
- Framework PEDALA: Posicionar, Eliminar (pontos gatilho), Descontrair, Alongar, Liberar (fáscia), Aconselhar
- 4 Técnicas: LIFE (dor física), SOFT (liberação miofascial), FIT (esportiva), DETOX (drenagem)
- As 5 perguntas de avaliação: 1) Onde dói? 2) Há quanto tempo? 3) Intensidade 0-10? 4) O que piora/melhora? 5) Irradia para algum lugar?

Mantenha respostas curtas e naturais (2-4 frases máximo).`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, patientContext } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Mensagens são obrigatórias" },
        { status: 400 }
      );
    }

    const contextMessage = patientContext
      ? `\n\nCONTEXTO DO PACIENTE ATUAL:\n- Nome: ${patientContext.name}\n- Idade: ${patientContext.age} anos\n- Queixa: ${patientContext.complaint}\n- Região da dor: ${patientContext.painRegion}\n- Intensidade: ${patientContext.painIntensity}/10\n- Duração: ${patientContext.duration}\n- Histórico: ${patientContext.history}\n- Músculo correto (NÃO REVELE): ${patientContext.correctMuscle}\n\nResponda APENAS como este paciente. Não mencione diagnósticos, músculos ou termos técnicos - você é um paciente leigo.`
      : "";

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      system: SYSTEM_PROMPT + contextMessage,
      messages: messages.map((msg: { role: string; content: string }) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    });

    const textContent = response.content.find((c) => c.type === "text");
    const reply = textContent ? textContent.text : "Desculpe, não entendi a pergunta.";

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error("AI Simulator error:", error);

    // If API key not configured, return a fallback response
    if (error instanceof Error && error.message?.includes("API key")) {
      return NextResponse.json({
        reply: "O simulador com IA está sendo configurado. Por enquanto, use o modo de simulação padrão.",
        fallback: true,
      });
    }

    return NextResponse.json(
      { error: "Erro no simulador de IA" },
      { status: 500 }
    );
  }
}
