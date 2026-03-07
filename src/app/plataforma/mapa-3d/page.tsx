"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { muscles, musclesByRegion, regionNames } from "@/data/muscles";
import type { BodyRegion, Muscle } from "@/types";

// Dynamic import to avoid SSR issues with Three.js
const BodyModel3D = dynamic(() => import("@/components/BodyModel3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-200">
      <p className="text-gray-400">Carregando modelo 3D...</p>
    </div>
  ),
});

const pedalaLabels: Record<string, { name: string; color: string }> = {
  P: { name: "Posicionar", color: "bg-blue-100 text-blue-700" },
  E: { name: "Eliminar", color: "bg-red-100 text-red-700" },
  D: { name: "Descontrair", color: "bg-orange-100 text-orange-700" },
  A: { name: "Alongar", color: "bg-green-100 text-green-700" },
  L: { name: "Liberar", color: "bg-purple-100 text-purple-700" },
  A2: { name: "Aconselhar", color: "bg-teal-100 text-teal-700" },
};

export default function Mapa3DPage() {
  const [selectedRegion, setSelectedRegion] = useState<BodyRegion | null>(null);
  const [selectedMuscle, setSelectedMuscle] = useState<Muscle | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const muscleCountByRegion = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const m of muscles) {
      counts[m.region] = (counts[m.region] || 0) + 1;
    }
    return counts;
  }, []);

  const regionMuscles = selectedRegion ? (musclesByRegion[selectedRegion] || []) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mapa da Dor 3D</h1>
          <p className="text-gray-500 text-sm mt-1">
            Modelo interativo 3D — clique nas regioes para explorar musculos e protocolos PEDALA
          </p>
        </div>
        <div className="text-sm text-gray-400">
          {muscles.length} musculos mapeados
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* 3D Model */}
        <div className="lg:col-span-3 relative">
          <BodyModel3D
            selectedRegion={selectedRegion}
            onRegionSelect={(region) => {
              setSelectedRegion(region);
              setSelectedMuscle(null);
              setActiveStep(0);
            }}
            muscleCountByRegion={muscleCountByRegion}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2 space-y-4">
          {!selectedRegion ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className="text-4xl mb-3">🗺️</div>
              <h3 className="font-bold mb-2">Selecione uma regiao</h3>
              <p className="text-sm text-gray-500">
                Clique em qualquer regiao do corpo 3D para ver os musculos, pontos gatilho e protocolos PEDALA.
              </p>

              {/* Quick region list */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {Object.entries(regionNames).map(([id, name]) => {
                  const count = muscleCountByRegion[id] || 0;
                  if (count === 0) return null;
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        setSelectedRegion(id as BodyRegion);
                        setSelectedMuscle(null);
                      }}
                      className="text-left px-3 py-2 rounded-lg border border-gray-100 hover:border-primary/30 transition text-sm"
                    >
                      <span className="font-medium">{name}</span>
                      <span className="text-gray-400 ml-1">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              {/* Region Header */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{regionNames[selectedRegion]}</h3>
                    <p className="text-sm text-gray-400">{regionMuscles.length} musculos nesta regiao</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedRegion(null);
                      setSelectedMuscle(null);
                    }}
                    className="text-sm text-gray-400 hover:text-gray-600"
                  >
                    ← Voltar
                  </button>
                </div>
              </div>

              {/* Muscle List */}
              {!selectedMuscle ? (
                <div className="space-y-2">
                  {regionMuscles.map((muscle) => (
                    <button
                      key={muscle.id}
                      onClick={() => {
                        setSelectedMuscle(muscle);
                        setActiveStep(0);
                      }}
                      className="w-full bg-white rounded-xl border border-gray-200 p-4 text-left hover:border-primary/30 hover:shadow-sm transition"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm">{muscle.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          muscle.technique === "LIFE" ? "bg-red-100 text-red-700" :
                          muscle.technique === "SOFT" ? "bg-blue-100 text-blue-700" :
                          muscle.technique === "FIT" ? "bg-green-100 text-green-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {muscle.technique}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{muscle.description}</p>
                      <div className="flex gap-2 mt-2 text-xs text-gray-400">
                        <span>{muscle.triggerPoints.length} PGs</span>
                        <span>{muscle.protocols[0]?.duration}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  {/* Muscle Detail */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <button
                      onClick={() => setSelectedMuscle(null)}
                      className="text-xs text-gray-400 hover:text-gray-600 mb-2 block"
                    >
                      ← Musculos
                    </button>
                    <h3 className="font-bold">{selectedMuscle.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{selectedMuscle.description}</p>

                    {/* Trigger Points */}
                    <div className="mt-3 space-y-2">
                      <h4 className="text-xs font-bold text-gray-400 uppercase">Pontos Gatilho</h4>
                      {selectedMuscle.triggerPoints.map((tp) => (
                        <div key={tp.id} className="bg-red-50 rounded-lg p-2">
                          <div className="font-medium text-sm text-red-700">{tp.name}</div>
                          <div className="text-xs text-red-500">{tp.referredPainZone}</div>
                        </div>
                      ))}
                    </div>

                    {/* Contraindications */}
                    <div className="mt-3">
                      <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Contraindicacoes</h4>
                      <ul className="text-xs text-gray-500 space-y-0.5">
                        {selectedMuscle.contraindications.map((c, i) => (
                          <li key={i} className="flex items-center gap-1">
                            <span className="text-red-400">⚠</span> {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* PEDALA Protocol */}
                  {selectedMuscle.protocols[0] && (
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                      <h4 className="font-bold text-sm mb-3">{selectedMuscle.protocols[0].name}</h4>

                      {/* Step tabs */}
                      <div className="flex gap-1 mb-4">
                        {selectedMuscle.protocols[0].pedalaSteps.map((step, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveStep(i)}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
                              activeStep === i
                                ? pedalaLabels[step.step]?.color || "bg-gray-100 text-gray-700"
                                : "bg-gray-50 text-gray-400"
                            }`}
                          >
                            {step.step === "A2" ? "A" : step.step}
                          </button>
                        ))}
                      </div>

                      {/* Active step detail */}
                      {(() => {
                        const step = selectedMuscle.protocols[0].pedalaSteps[activeStep];
                        if (!step) return null;
                        const label = pedalaLabels[step.step];
                        return (
                          <div className={`rounded-xl p-4 ${label?.color || "bg-gray-100"}`}>
                            <div className="font-bold text-sm mb-1">
                              {step.step === "A2" ? "A" : step.step} — {label?.name}
                            </div>
                            <div className="text-xs opacity-60 mb-2">{step.duration}</div>
                            <p className="text-sm leading-relaxed">{step.instruction}</p>
                            {step.tips.length > 0 && (
                              <ul className="mt-2 space-y-1">
                                {step.tips.map((tip, i) => (
                                  <li key={i} className="text-xs opacity-75 flex items-start gap-1">
                                    <span>💡</span> {tip}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })()}

                      {/* Nav buttons */}
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                          disabled={activeStep === 0}
                          className="flex-1 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 disabled:opacity-30"
                        >
                          ← Anterior
                        </button>
                        <button
                          onClick={() => setActiveStep(Math.min(5, activeStep + 1))}
                          disabled={activeStep === 5}
                          className="flex-1 py-2 rounded-lg text-sm font-medium bg-primary text-white disabled:opacity-30"
                        >
                          Proximo →
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
