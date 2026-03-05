"use client";

import { useState } from "react";
import { muscles, regionNames, techniqueInfo } from "@/data/muscles";
import type { Muscle, BodyRegion } from "@/types";

type AttendancePhase = "assessment" | "map" | "protocol" | "timer" | "result";

const bodyRegionOptions: { region: BodyRegion; label: string }[] = [
  { region: "cabeca", label: "Cabeça" },
  { region: "pescoco", label: "Pescoço" },
  { region: "ombro", label: "Ombro" },
  { region: "costas_superior", label: "Costas Superior" },
  { region: "costas_media", label: "Costas Média" },
  { region: "lombar", label: "Lombar" },
  { region: "quadril", label: "Quadril" },
  { region: "coxa", label: "Coxa" },
  { region: "perna", label: "Perna" },
  { region: "braco", label: "Braço" },
  { region: "antebraco", label: "Antebraço" },
  { region: "torax", label: "Tórax" },
];

export default function AtendimentoPage() {
  const [phase, setPhase] = useState<AttendancePhase>("assessment");
  const [painRegion, setPainRegion] = useState<BodyRegion | null>(null);
  const [painBefore, setPainBefore] = useState(5);
  const [painAfter, setPainAfter] = useState(0);
  const [selectedMuscle, setSelectedMuscle] = useState<Muscle | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [chargedAmount, setChargedAmount] = useState(150);

  const regionMuscles = painRegion ? muscles.filter((m) => m.region === painRegion) : [];
  const protocol = selectedMuscle?.protocols[0];
  const stepNames = ["P", "E", "D", "A", "L", "A"];

  // Simple timer
  const startTimer = () => {
    setTimerRunning(true);
    setTimerSeconds(0);
  };

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-lg mx-auto space-y-4">
      {/* Header - Modo Atendimento */}
      <div className="bg-primary rounded-2xl p-4 text-white text-center">
        <div className="text-xs uppercase tracking-wider opacity-80">Modo Atendimento</div>
        <div className="text-lg font-bold">Assistente Clínico MCPM</div>
      </div>

      {/* Phase 1: Assessment */}
      {phase === "assessment" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-bold mb-4">Ficha de Avaliação Rápida</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Paciente</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-lg"
                  placeholder="Nome"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Onde dói?</label>
                <div className="grid grid-cols-3 gap-2">
                  {bodyRegionOptions.map((opt) => (
                    <button
                      key={opt.region}
                      onClick={() => setPainRegion(opt.region)}
                      className={`p-3 rounded-xl text-sm font-medium transition border-2 ${
                        painRegion === opt.region
                          ? "border-primary bg-primary-light text-primary"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intensidade da Dor: <span className="text-primary text-2xl font-bold">{painBefore}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={painBefore}
                  onChange={(e) => setPainBefore(Number(e.target.value))}
                  className="w-full accent-red-500 h-3"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Sem dor</span>
                  <span>Máxima</span>
                </div>
              </div>

              <button
                onClick={() => setPhase("map")}
                disabled={!painRegion}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition disabled:opacity-50"
              >
                Ver Protocolo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Phase 2: Muscle Selection (Simplified Map) */}
      {phase === "map" && painRegion && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">{regionNames[painRegion]} — Músculos</h2>
              <button onClick={() => setPhase("assessment")} className="text-sm text-gray-400">Voltar</button>
            </div>
            <div className="space-y-2">
              {regionMuscles.map((muscle) => (
                <button
                  key={muscle.id}
                  onClick={() => { setSelectedMuscle(muscle); setPhase("protocol"); setActiveStep(0); }}
                  className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-primary/30 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{muscle.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{muscle.triggerPoints.length} pontos gatilho</div>
                    </div>
                    <span
                      className="text-xs px-2 py-1 rounded-full text-white"
                      style={{ backgroundColor: techniqueInfo[muscle.technique].color }}
                    >
                      {muscle.technique}
                    </span>
                  </div>
                </button>
              ))}
              {regionMuscles.length === 0 && (
                <div className="text-center text-gray-400 py-8">Nenhum músculo cadastrado para esta região.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Phase 3: Protocol Steps (PEDALA) */}
      {phase === "protocol" && selectedMuscle && protocol && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold">{selectedMuscle.name}</h2>
              <button onClick={() => setPhase("map")} className="text-sm text-gray-400">Trocar</button>
            </div>

            {/* Step indicators */}
            <div className="flex gap-1 mb-4">
              {protocol.pedalaSteps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className={`flex-1 h-12 rounded-lg flex flex-col items-center justify-center transition font-bold ${
                    activeStep === i
                      ? "bg-primary text-white"
                      : i < activeStep
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <span className="text-lg">{stepNames[i]}</span>
                </button>
              ))}
            </div>

            {/* Active Step */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3 min-h-[200px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary text-white flex items-center justify-center text-lg font-bold">
                  {stepNames[activeStep]}
                </div>
                <div>
                  <div className="font-bold text-lg">
                    {["Posicionar", "Eliminar", "Descontrair", "Alongar", "Liberar", "Aconselhar"][activeStep]}
                  </div>
                  <div className="text-xs text-gray-400">{protocol.pedalaSteps[activeStep].duration}</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed">{protocol.pedalaSteps[activeStep].instruction}</p>
              {protocol.pedalaSteps[activeStep].tips.length > 0 && (
                <div className="space-y-1">
                  {protocol.pedalaSteps[activeStep].tips.map((tip, j) => (
                    <div key={j} className="text-xs text-accent flex items-start gap-1.5 bg-accent-light p-2 rounded-lg">
                      <span>💡</span> {tip}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                disabled={activeStep === 0}
                className="flex-1 py-3 rounded-xl border border-gray-200 font-medium text-gray-600 disabled:opacity-30"
              >
                Anterior
              </button>
              {activeStep < protocol.pedalaSteps.length - 1 ? (
                <button
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="flex-1 py-3 rounded-xl bg-primary text-white font-medium"
                >
                  Próximo
                </button>
              ) : (
                <button
                  onClick={() => setPhase("result")}
                  className="flex-1 py-3 rounded-xl bg-green-500 text-white font-medium"
                >
                  Finalizar
                </button>
              )}
            </div>
          </div>

          {/* Contraindications Alert */}
          {selectedMuscle.contraindications.length > 0 && (
            <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
              <div className="font-medium text-yellow-800 text-sm mb-1">Contraindicações:</div>
              {selectedMuscle.contraindications.map((c, i) => (
                <div key={i} className="text-xs text-yellow-700">⚠ {c}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Phase 4: Result Registration */}
      {phase === "result" && selectedMuscle && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h2 className="font-bold text-lg text-center">Registrar Resultado</h2>

            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-sm text-green-600 mb-1">Protocolo aplicado:</div>
              <div className="font-bold text-green-800">{selectedMuscle.name} — PEDALA</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dor DEPOIS: <span className="text-green-500 text-2xl font-bold">{painAfter}</span>
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={painAfter}
                onChange={(e) => setPainAfter(Number(e.target.value))}
                className="w-full accent-green-500 h-3"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Sem dor</span>
                <span>Máxima</span>
              </div>
            </div>

            {/* Before/After comparison */}
            <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-xs text-gray-400">Antes</div>
                <div className="text-3xl font-bold text-red-400">{painBefore}</div>
              </div>
              <div className="text-2xl text-gray-300">→</div>
              <div className="text-center">
                <div className="text-xs text-gray-400">Depois</div>
                <div className="text-3xl font-bold text-green-500">{painAfter}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400">Redução</div>
                <div className="text-3xl font-bold text-primary">
                  {painBefore > 0 ? Math.round(((painBefore - painAfter) / painBefore) * 100) : 0}%
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor Cobrado (R$)</label>
              <input
                type="number"
                value={chargedAmount}
                onChange={(e) => setChargedAmount(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-lg text-center"
              />
            </div>

            <button
              onClick={() => {
                // In a real app, save to diary
                alert(`Atendimento registrado!\n${patientName} — ${selectedMuscle.name}\nDor: ${painBefore} → ${painAfter}\nValor: R$${chargedAmount}`);
                // Reset
                setPhase("assessment");
                setPainRegion(null);
                setPainBefore(5);
                setPainAfter(0);
                setSelectedMuscle(null);
                setPatientName("");
              }}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition"
            >
              Salvar e Compartilhar
            </button>

            <button
              onClick={() => {
                setPhase("assessment");
                setPainRegion(null);
                setPainBefore(5);
                setPainAfter(0);
                setSelectedMuscle(null);
                setPatientName("");
              }}
              className="w-full text-gray-400 text-sm"
            >
              Novo atendimento
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
