"use client";

import { useState, useRef, useEffect } from "react";
import { virtualPatients, assessmentQuestions } from "@/data/simulator";
import { muscles, regionNames } from "@/data/muscles";
import type { VirtualPatient, SimulatorDifficulty } from "@/types";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const difficultyColors: Record<SimulatorDifficulty, string> = {
  facil: "bg-green-100 text-green-700",
  medio: "bg-yellow-100 text-yellow-700",
  dificil: "bg-orange-100 text-orange-700",
  complexo: "bg-red-100 text-red-700",
};

const difficultyLabels: Record<SimulatorDifficulty, string> = {
  facil: "Fácil", medio: "Médio", dificil: "Difícil", complexo: "Complexo",
};

export default function SimuladorIAPage() {
  const [patient, setPatient] = useState<VirtualPatient | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"select" | "chat" | "diagnosis" | "result">("select");
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [score, setScore] = useState(0);
  const [aiAvailable, setAiAvailable] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startChat = (p: VirtualPatient) => {
    setPatient(p);
    setPhase("chat");
    setMessages([]);
    setSelectedMuscle("");
    setScore(0);

    // Initial patient message
    const initial: ChatMessage = {
      role: "assistant",
      content: p.complaint,
    };
    setMessages([initial]);
  };

  const sendMessage = async () => {
    if (!input.trim() || !patient || loading) return;

    const userMsg: ChatMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/simulator/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          patientContext: patient,
        }),
      });

      const data = await res.json();

      if (data.fallback) {
        setAiAvailable(false);
        // Use static responses
        const staticResponse = getStaticResponse(patient, input, updatedMessages.length);
        setMessages([...updatedMessages, { role: "assistant", content: staticResponse }]);
      } else {
        setMessages([...updatedMessages, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setAiAvailable(false);
      const staticResponse = getStaticResponse(patient, input, updatedMessages.length);
      setMessages([...updatedMessages, { role: "assistant", content: staticResponse }]);
    } finally {
      setLoading(false);
    }
  };

  const goToDiagnosis = () => {
    setPhase("diagnosis");
  };

  const submitDiagnosis = () => {
    if (!patient) return;
    let totalScore = 0;

    // Score based on number of assessment questions asked
    const questionsAsked = messages.filter((m) => m.role === "user").length;
    totalScore += Math.min(questionsAsked * 5, 30);

    // Muscle identification
    if (selectedMuscle === patient.correctMuscle) {
      totalScore += 70;
    } else {
      const correctMuscle = muscles.find((m) => m.id === patient.correctMuscle);
      const chosen = muscles.find((m) => m.id === selectedMuscle);
      if (correctMuscle && chosen && correctMuscle.region === chosen.region) {
        totalScore += 25;
      }
    }

    setScore(totalScore);
    setPhase("result");
  };

  const reset = () => {
    setPhase("select");
    setPatient(null);
    setMessages([]);
  };

  const correctMuscle = patient ? muscles.find((m) => m.id === patient.correctMuscle) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Simulador com IA</h1>
        <p className="text-gray-500 text-sm mt-1">
          Converse com pacientes virtuais alimentados por inteligência artificial. Pratique suas habilidades de avaliação.
        </p>
        {!aiAvailable && (
          <div className="mt-2 bg-yellow-50 text-yellow-700 text-xs px-3 py-1.5 rounded-lg inline-block">
            Modo offline — respostas pré-programadas ativas
          </div>
        )}
      </div>

      {/* Patient Selection */}
      {phase === "select" && (
        <div className="grid sm:grid-cols-2 gap-4">
          {virtualPatients.map((p) => (
            <button
              key={p.id}
              onClick={() => startChat(p)}
              className="bg-white rounded-xl border border-gray-200 p-5 text-left hover:border-primary/30 hover:shadow-sm transition"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{p.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${difficultyColors[p.difficulty]}`}>
                  {difficultyLabels[p.difficulty]}
                </span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2">{p.complaint}</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                <span>{regionNames[p.painRegion]}</span>
                <span>Dor: {p.painIntensity}/10</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Chat Interface */}
      {phase === "chat" && patient && (
        <div className="max-w-2xl mx-auto">
          {/* Patient Header */}
          <div className="bg-white rounded-t-2xl border border-gray-200 border-b-0 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-lg">🧑</div>
              <div>
                <div className="font-semibold">{patient.name}</div>
                <div className={`text-xs px-2 py-0.5 rounded-full inline-block ${difficultyColors[patient.difficulty]}`}>
                  {difficultyLabels[patient.difficulty]}
                </div>
              </div>
            </div>
            <button
              onClick={goToDiagnosis}
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition"
            >
              Fazer Diagnóstico
            </button>
          </div>

          {/* Suggested Questions */}
          <div className="bg-accent-light border-x border-gray-200 px-4 py-2">
            <div className="text-xs text-accent font-medium mb-1.5">Perguntas sugeridas (As 5 do Método):</div>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {assessmentQuestions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => setInput(q.question)}
                  className="bg-white text-xs px-3 py-1.5 rounded-full border border-accent/20 text-accent whitespace-nowrap hover:bg-accent hover:text-white transition"
                >
                  {q.question.substring(0, 30)}...
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="bg-gray-50 border-x border-gray-200 h-[400px] overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-white rounded-tr-sm"
                    : "bg-white border border-gray-200 rounded-tl-sm"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-gray-400">
                  Digitando...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="bg-white rounded-b-2xl border border-gray-200 border-t-0 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Faça sua pergunta ao paciente..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-dark transition disabled:opacity-50"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Diagnosis Phase */}
      {phase === "diagnosis" && patient && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-bold text-lg mb-2">Qual músculo é responsável?</h3>
          <p className="text-sm text-gray-500 mb-4">Baseado na sua conversa com o paciente, identifique o músculo principal.</p>

          <div className="space-y-2 max-h-72 overflow-y-auto mb-4">
            {muscles.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMuscle(m.id)}
                className={`w-full text-left p-3 rounded-lg border transition text-sm ${
                  selectedMuscle === m.id
                    ? "border-primary bg-primary-light"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{m.name}</span>
                  <span className="text-xs text-gray-400">{regionNames[m.region]}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setPhase("chat")} className="flex-1 py-3 rounded-xl border border-gray-200 font-medium text-gray-600">
              Voltar ao Chat
            </button>
            <button
              onClick={submitDiagnosis}
              disabled={!selectedMuscle}
              className="flex-1 bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition disabled:opacity-50"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}

      {/* Result Phase */}
      {phase === "result" && patient && correctMuscle && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className={`p-8 text-center text-white ${score >= 80 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500"}`}>
            <div className="text-6xl font-bold">{score}</div>
            <div className="text-xl font-medium mt-1">
              {score >= 80 ? "Excelente!" : score >= 50 ? "Bom trabalho!" : "Continue praticando"}
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className={`p-4 rounded-xl ${selectedMuscle === patient.correctMuscle ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
              <div className="flex items-center gap-2">
                <span>{selectedMuscle === patient.correctMuscle ? "✅" : "❌"}</span>
                <span className="font-medium">Músculo correto: {correctMuscle.name}</span>
              </div>
              {selectedMuscle !== patient.correctMuscle && (
                <div className="text-sm text-red-600 mt-1">
                  Você escolheu: {muscles.find((m) => m.id === selectedMuscle)?.name || "Nenhum"}
                </div>
              )}
            </div>

            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-medium text-blue-800 mb-1">Explicação:</h4>
              <p className="text-sm text-blue-700">{correctMuscle.description}</p>
            </div>

            {/* Chat Review */}
            <div>
              <h4 className="font-medium mb-2">Resumo da conversa ({messages.filter(m => m.role === "user").length} perguntas feitas):</h4>
              <div className="bg-gray-50 rounded-xl p-3 max-h-40 overflow-y-auto space-y-1">
                {messages.filter(m => m.role === "user").map((msg, i) => (
                  <div key={i} className="text-xs text-gray-600">
                    <span className="text-primary font-medium">Você:</span> {msg.content}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={reset} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium">
                Voltar
              </button>
              <button onClick={() => startChat(patient)} className="flex-1 bg-primary text-white py-3 rounded-xl font-medium">
                Tentar Novamente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Static responses when AI is not available
function getStaticResponse(patient: VirtualPatient, question: string, msgCount: number): string {
  const q = question.toLowerCase();

  if (q.includes("onde") || q.includes("local") || q.includes("região") || q.includes("dói")) {
    return patient.complaint.split(".")[0] + ".";
  }
  if (q.includes("quanto tempo") || q.includes("há quanto") || q.includes("quando começou")) {
    return `Já faz ${patient.duration} que estou assim.`;
  }
  if (q.includes("intensidade") || q.includes("0 a 10") || q.includes("nota")) {
    return `Agora está uns ${patient.painIntensity} de 10. Tem dias que fica pior.`;
  }
  if (q.includes("piora") || q.includes("melhora") || q.includes("agrava")) {
    return "Piora quando fico muito tempo na mesma posição. Melhora um pouco quando coloco compressa quente.";
  }
  if (q.includes("irradia") || q.includes("espalha") || q.includes("outro lugar")) {
    if (patient.difficulty === "facil") {
      return "Não, fica mais nessa região mesmo.";
    }
    return "Às vezes parece que a dor vai para outro lugar sim, mas o principal é aqui.";
  }
  if (q.includes("trabalho") || q.includes("profissão") || q.includes("faz")) {
    return patient.history.split(".")[0] + ".";
  }
  if (q.includes("remédio") || q.includes("medicamento") || q.includes("tratamento")) {
    return "Já tomei anti-inflamatório, melhora na hora mas depois volta.";
  }

  // Generic responses based on message count
  const generics = [
    "Pode me explicar melhor?",
    "Hmm, acho que é isso mesmo.",
    "Será que tem solução? Já estou ficando desanimado(a).",
    "Você acha que consegue me ajudar?",
  ];
  return generics[msgCount % generics.length];
}
