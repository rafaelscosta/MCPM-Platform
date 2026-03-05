"use client";

import { useState } from "react";
import { virtualPatients, assessmentQuestions } from "@/data/simulator";
import { muscles, regionNames } from "@/data/muscles";
import type { VirtualPatient, SimulatorDifficulty } from "@/types";

type SimPhase = "select" | "assessment" | "diagnosis" | "protocol" | "result";

const difficultyColors: Record<SimulatorDifficulty, string> = {
  facil: "bg-green-100 text-green-700",
  medio: "bg-yellow-100 text-yellow-700",
  dificil: "bg-orange-100 text-orange-700",
  complexo: "bg-red-100 text-red-700",
};

const difficultyLabels: Record<SimulatorDifficulty, string> = {
  facil: "Fácil",
  medio: "Médio",
  dificil: "Difícil",
  complexo: "Complexo",
};

export default function SimuladorPage() {
  const [phase, setPhase] = useState<SimPhase>("select");
  const [patient, setPatient] = useState<VirtualPatient | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [selectedProtocol, setSelectedProtocol] = useState("");
  const [score, setScore] = useState(0);
  const [filterDifficulty, setFilterDifficulty] = useState<SimulatorDifficulty | "all">("all");

  const filteredPatients = filterDifficulty === "all"
    ? virtualPatients
    : virtualPatients.filter((p) => p.difficulty === filterDifficulty);

  const startSimulation = (p: VirtualPatient) => {
    setPatient(p);
    setPhase("assessment");
    setQuestionIndex(0);
    setAnswers([]);
    setSelectedMuscle("");
    setSelectedProtocol("");
    setScore(0);
  };

  const nextQuestion = () => {
    if (questionIndex < assessmentQuestions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setPhase("diagnosis");
    }
  };

  const submitDiagnosis = () => {
    setPhase("protocol");
  };

  const submitProtocol = async () => {
    if (!patient) return;
    let totalScore = 0;

    // Check assessment (did they ask all 5 questions?)
    totalScore += 20; // Base score for completing assessment

    // Check muscle identification
    if (selectedMuscle === patient.correctMuscle) {
      totalScore += 40;
    } else {
      // Partial credit for same region
      const correctMuscle = muscles.find((m) => m.id === patient.correctMuscle);
      const chosen = muscles.find((m) => m.id === selectedMuscle);
      if (correctMuscle && chosen && correctMuscle.region === chosen.region) {
        totalScore += 15;
      }
    }

    // Check protocol
    if (selectedProtocol === patient.correctProtocol) {
      totalScore += 40;
    } else if (selectedMuscle === patient.correctMuscle) {
      totalScore += 20; // Right muscle, wrong protocol variant
    }

    setScore(totalScore);
    setPhase("result");

    // Save result to API
    try {
      await fetch("/api/simulator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          virtualPatientId: patient.id,
          difficulty: patient.difficulty,
          selectedMuscle,
          correctMuscle: patient.correctMuscle,
          selectedProtocol,
          correctProtocol: patient.correctProtocol,
          score: totalScore,
        }),
      });
    } catch {
      // Silently fail - result still shown to user
    }
  };

  const reset = () => {
    setPhase("select");
    setPatient(null);
  };

  const correctMuscle = patient ? muscles.find((m) => m.id === patient.correctMuscle) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Simulador de Atendimento</h1>
        <p className="text-gray-500 text-sm mt-1">
          Pratique com pacientes virtuais antes de atender pessoas reais. IA gera casos clínicos progressivos.
        </p>
      </div>

      {/* Patient Selection */}
      {phase === "select" && (
        <>
          <div className="flex gap-2 flex-wrap">
            {(["all", "facil", "medio", "dificil", "complexo"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setFilterDifficulty(d)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filterDifficulty === d
                    ? "bg-gray-900 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {d === "all" ? "Todos" : difficultyLabels[d]}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {filteredPatients.map((p) => (
              <button
                key={p.id}
                onClick={() => startSimulation(p)}
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
                  <span>{p.duration}</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Assessment Phase */}
      {phase === "assessment" && patient && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-xl">🧑</div>
              <div>
                <div className="font-semibold">{patient.name}</div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[patient.difficulty]}`}>
                  {difficultyLabels[patient.difficulty]}
                </span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="text-xs text-gray-400 mb-1">Queixa do paciente:</div>
              <p className="text-sm text-gray-700 leading-relaxed italic">&ldquo;{patient.complaint}&rdquo;</p>
            </div>
            {patient.history && (
              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <div className="text-xs text-blue-400 mb-1">Histórico:</div>
                <p className="text-sm text-blue-700">{patient.history}</p>
              </div>
            )}
          </div>

          {/* Assessment Questions Progress */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Avaliação — As 5 Perguntas</h3>
              <span className="text-sm text-gray-400">{questionIndex + 1}/5</span>
            </div>
            <div className="flex gap-1 mb-6">
              {assessmentQuestions.map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= questionIndex ? "bg-primary" : "bg-gray-100"}`} />
              ))}
            </div>

            <div className="space-y-4">
              <div className="bg-accent-light rounded-xl p-4">
                <div className="text-xs text-accent font-medium mb-1">Pergunta {questionIndex + 1}:</div>
                <p className="font-semibold">{assessmentQuestions[questionIndex].question}</p>
                <p className="text-xs text-gray-500 mt-1">{assessmentQuestions[questionIndex].purpose}</p>
              </div>

              {/* Simulated patient response */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs text-gray-400 mb-1">Resposta do paciente:</div>
                <p className="text-sm text-gray-700 italic">
                  {questionIndex === 0 && `"${patient.complaint.split('.')[0]}."`}
                  {questionIndex === 1 && `"Há ${patient.duration}."`}
                  {questionIndex === 2 && `"Agora está uns ${patient.painIntensity} de 10."`}
                  {questionIndex === 3 && `"Piora quando fico muito tempo na mesma posição. Melhora um pouco com calor."`}
                  {questionIndex === 4 && (patient.difficulty === "facil"
                    ? `"Fica só nesse ponto mesmo."`
                    : `"Às vezes parece que irradia para outra região, mas a dor principal é aqui."`
                  )}
                </p>
              </div>

              <button
                onClick={nextQuestion}
                className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition"
              >
                {questionIndex < assessmentQuestions.length - 1 ? "Próxima Pergunta" : "Fazer Diagnóstico"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Diagnosis Phase */}
      {phase === "diagnosis" && patient && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-bold text-lg mb-4">Qual músculo é responsável pela dor?</h3>
            <p className="text-sm text-gray-500 mb-4">Baseado na avaliação, identifique o músculo principal.</p>

            <div className="space-y-2 max-h-80 overflow-y-auto">
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

            <button
              onClick={submitDiagnosis}
              disabled={!selectedMuscle}
              className="w-full mt-4 bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition disabled:opacity-50"
            >
              Confirmar Diagnóstico
            </button>
          </div>
        </div>
      )}

      {/* Protocol Phase */}
      {phase === "protocol" && patient && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-bold text-lg mb-4">Qual protocolo PEDALA aplicar?</h3>

            <div className="space-y-2">
              {muscles
                .flatMap((m) => m.protocols)
                .map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProtocol(p.id)}
                    className={`w-full text-left p-3 rounded-lg border transition text-sm ${
                      selectedProtocol === p.id
                        ? "border-primary bg-primary-light"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{p.description} — {p.duration}</div>
                  </button>
                ))}
            </div>

            <button
              onClick={submitProtocol}
              disabled={!selectedProtocol}
              className="w-full mt-4 bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition disabled:opacity-50"
            >
              Finalizar Simulação
            </button>
          </div>
        </div>
      )}

      {/* Result Phase */}
      {phase === "result" && patient && correctMuscle && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Score Header */}
            <div className={`p-8 text-center text-white ${score >= 80 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500"}`}>
              <div className="text-6xl font-bold">{score}</div>
              <div className="text-xl font-medium mt-1">
                {score >= 80 ? "Excelente!" : score >= 50 ? "Bom, mas pode melhorar" : "Precisa praticar mais"}
              </div>
              <div className="text-sm opacity-80 mt-1">de 100 pontos</div>
            </div>

            <div className="p-6 space-y-4">
              {/* Correct Answer */}
              <div className="space-y-3">
                <h3 className="font-bold">Resposta Correta:</h3>

                <div className={`p-4 rounded-xl ${selectedMuscle === patient.correctMuscle ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                  <div className="flex items-center gap-2">
                    <span>{selectedMuscle === patient.correctMuscle ? "✅" : "❌"}</span>
                    <span className="font-medium">Músculo: {correctMuscle.name}</span>
                  </div>
                  {selectedMuscle !== patient.correctMuscle && (
                    <div className="text-sm text-red-600 mt-1">
                      Você selecionou: {muscles.find((m) => m.id === selectedMuscle)?.name || "Nenhum"}
                    </div>
                  )}
                </div>

                <div className={`p-4 rounded-xl ${selectedProtocol === patient.correctProtocol ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                  <div className="flex items-center gap-2">
                    <span>{selectedProtocol === patient.correctProtocol ? "✅" : "❌"}</span>
                    <span className="font-medium">
                      Protocolo: {correctMuscle.protocols[0]?.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Explanation */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-medium text-blue-800 mb-2">Explicação Detalhada:</h4>
                <p className="text-sm text-blue-700 leading-relaxed">
                  {correctMuscle.description}
                </p>
                <p className="text-sm text-blue-700 mt-2">
                  <strong>Pontos gatilho:</strong>{" "}
                  {correctMuscle.triggerPoints.map((tp) => `${tp.name} (${tp.referredPainZone})`).join("; ")}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={reset}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition"
                >
                  Voltar ao Menu
                </button>
                <button
                  onClick={() => startSimulation(patient)}
                  className="flex-1 bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
