"use client";

import { useState } from "react";
import { muscles, regionNames, techniqueInfo } from "@/data/muscles";
import type { Muscle, BodyRegion, Technique } from "@/types";

// Body regions mapped to clickable zones on a front-view body outline
const bodyZones: { region: BodyRegion; label: string; x: number; y: number; w: number; h: number }[] = [
  { region: "cabeca", label: "Cabeça", x: 140, y: 10, w: 60, h: 40 },
  { region: "pescoco", label: "Pescoço", x: 150, y: 55, w: 40, h: 30 },
  { region: "ombro", label: "Ombro E", x: 95, y: 85, w: 45, h: 35 },
  { region: "ombro", label: "Ombro D", x: 200, y: 85, w: 45, h: 35 },
  { region: "torax", label: "Tórax", x: 135, y: 95, w: 70, h: 50 },
  { region: "braco", label: "Braço E", x: 80, y: 125, w: 35, h: 55 },
  { region: "braco", label: "Braço D", x: 225, y: 125, w: 35, h: 55 },
  { region: "antebraco", label: "Antebraço E", x: 65, y: 185, w: 30, h: 50 },
  { region: "antebraco", label: "Antebraço D", x: 245, y: 185, w: 30, h: 50 },
  { region: "abdomen", label: "Abdômen", x: 140, y: 150, w: 60, h: 40 },
  { region: "costas_superior", label: "Costas Sup.", x: 145, y: 100, w: 50, h: 35 },
  { region: "costas_media", label: "Costas Méd.", x: 145, y: 135, w: 50, h: 35 },
  { region: "lombar", label: "Lombar", x: 140, y: 195, w: 60, h: 35 },
  { region: "quadril", label: "Quadril", x: 120, y: 230, w: 100, h: 35 },
  { region: "coxa", label: "Coxa E", x: 115, y: 270, w: 45, h: 65 },
  { region: "coxa", label: "Coxa D", x: 180, y: 270, w: 45, h: 65 },
  { region: "joelho", label: "Joelho E", x: 120, y: 340, w: 35, h: 25 },
  { region: "joelho", label: "Joelho D", x: 185, y: 340, w: 35, h: 25 },
  { region: "perna", label: "Perna E", x: 118, y: 370, w: 38, h: 60 },
  { region: "perna", label: "Perna D", x: 183, y: 370, w: 38, h: 60 },
  { region: "pe", label: "Pé E", x: 115, y: 435, w: 40, h: 20 },
  { region: "pe", label: "Pé D", x: 185, y: 435, w: 40, h: 20 },
];

export default function MapaDaDorPage() {
  const [selectedRegion, setSelectedRegion] = useState<BodyRegion | null>(null);
  const [selectedMuscle, setSelectedMuscle] = useState<Muscle | null>(null);
  const [filterTechnique, setFilterTechnique] = useState<Technique | "all">("all");
  const [activeStep, setActiveStep] = useState(0);

  const regionMuscles = selectedRegion
    ? muscles.filter((m) => m.region === selectedRegion && (filterTechnique === "all" || m.technique === filterTechnique))
    : [];

  const stepNames = ["P - Posicionar", "E - Eliminar", "D - Descontrair", "A - Alongar", "L - Liberar", "A - Aconselhar"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mapa da Dor Interativo</h1>
        <p className="text-gray-500 text-sm mt-1">
          Clique em qualquer região do corpo para explorar músculos, pontos gatilho e protocolos PEDALA.
        </p>
      </div>

      {/* Technique Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterTechnique("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filterTechnique === "all" ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
          }`}
        >
          Todos
        </button>
        {(Object.entries(techniqueInfo) as [Technique, typeof techniqueInfo.LIFE][]).map(([key, info]) => (
          <button
            key={key}
            onClick={() => setFilterTechnique(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
              filterTechnique === key
                ? "text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
            style={filterTechnique === key ? { backgroundColor: info.color } : {}}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: info.color }} />
            {info.name}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Body Map - 2 cols */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sticky top-4">
            <svg viewBox="0 0 340 470" className="w-full max-w-sm mx-auto">
              {/* Body outline */}
              <ellipse cx="170" cy="30" rx="28" ry="30" fill="#FDE8E9" stroke="#E5E5E5" strokeWidth="1" />
              <rect x="155" y="58" width="30" height="25" rx="5" fill="#FDE8E9" stroke="#E5E5E5" strokeWidth="1" />
              <path d="M 140 85 Q 170 80 200 85 L 215 85 Q 230 90 240 130 L 240 180 Q 235 185 225 180 L 210 120 Q 205 95 200 92 L 200 200 Q 200 235 210 270 L 215 340 Q 215 370 210 430 L 210 450 Q 200 460 190 450 L 185 370 Q 180 340 170 340 Q 160 340 155 370 L 150 450 Q 140 460 130 450 L 130 430 Q 125 370 125 340 L 130 270 Q 140 235 140 200 L 140 92 Q 135 95 130 120 L 115 180 Q 105 185 100 180 L 100 130 Q 110 90 125 85 Z" fill="#FDE8E9" stroke="#E5E5E5" strokeWidth="1" />

              {/* Clickable regions */}
              {bodyZones.map((zone, i) => {
                const isActive = selectedRegion === zone.region;
                const hasMuscles = muscles.some(
                  (m) => m.region === zone.region && (filterTechnique === "all" || m.technique === filterTechnique)
                );
                return (
                  <g key={i}>
                    <rect
                      x={zone.x}
                      y={zone.y}
                      width={zone.w}
                      height={zone.h}
                      rx={6}
                      fill={isActive ? "rgba(230, 57, 70, 0.3)" : hasMuscles ? "rgba(230, 57, 70, 0.08)" : "transparent"}
                      stroke={isActive ? "#E63946" : hasMuscles ? "rgba(230, 57, 70, 0.3)" : "transparent"}
                      strokeWidth={isActive ? 2 : 1}
                      className="cursor-pointer transition-all"
                      style={{ pointerEvents: "all" }}
                      onClick={() => {
                        setSelectedRegion(zone.region);
                        setSelectedMuscle(null);
                        setActiveStep(0);
                      }}
                    >
                      <title>{zone.label}</title>
                    </rect>
                    {hasMuscles && (
                      <text
                        x={zone.x + zone.w / 2}
                        y={zone.y + zone.h / 2 + 3}
                        textAnchor="middle"
                        fontSize="7"
                        fill={isActive ? "#E63946" : "#A3A3A3"}
                        fontWeight={isActive ? "bold" : "normal"}
                        className="pointer-events-none select-none"
                      >
                        {zone.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Trigger points for selected muscle */}
              {selectedMuscle?.triggerPoints.map((tp) => (
                <g key={tp.id}>
                  <circle cx={tp.x} cy={tp.y} r="5" fill="#E63946" opacity="0.8" className="trigger-point" />
                  <circle cx={tp.x} cy={tp.y} r="2" fill="white" />
                </g>
              ))}
            </svg>

            {!selectedRegion && (
              <div className="text-center text-sm text-gray-400 mt-4">
                Toque em uma região do corpo para começar
              </div>
            )}
          </div>
        </div>

        {/* Muscle List + Protocol Detail - 3 cols */}
        <div className="lg:col-span-3 space-y-4">
          {/* Region muscles */}
          {selectedRegion && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg">
                  {regionNames[selectedRegion]} — {regionMuscles.length} músculo{regionMuscles.length !== 1 ? "s" : ""}
                </h2>
                <button onClick={() => { setSelectedRegion(null); setSelectedMuscle(null); }} className="text-sm text-gray-400 hover:text-gray-600">
                  Limpar
                </button>
              </div>

              {regionMuscles.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
                  Nenhum músculo cadastrado para esta região{filterTechnique !== "all" ? ` com a técnica ${filterTechnique}` : ""}.
                </div>
              ) : (
                <div className="space-y-3">
                  {regionMuscles.map((muscle) => (
                    <button
                      key={muscle.id}
                      onClick={() => { setSelectedMuscle(muscle); setActiveStep(0); }}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selectedMuscle?.id === muscle.id
                          ? "border-primary bg-primary-light"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: techniqueInfo[muscle.technique].color }}
                          />
                          <span className="font-semibold">{muscle.name}</span>
                        </div>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{muscle.technique}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{muscle.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        <span>{muscle.triggerPoints.length} ponto{muscle.triggerPoints.length !== 1 ? "s" : ""} gatilho</span>
                        <span>{muscle.protocols.length} protocolo{muscle.protocols.length !== 1 ? "s" : ""}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Selected Muscle Detail */}
          {selectedMuscle && (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {/* Trigger Points */}
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-bold mb-3">Pontos Gatilho</h3>
                <div className="space-y-2">
                  {selectedMuscle.triggerPoints.map((tp) => (
                    <div key={tp.id} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                      <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs shrink-0">PG</span>
                      <div>
                        <div className="font-medium text-sm">{tp.name}</div>
                        <div className="text-xs text-gray-500">Dor referida: {tp.referredPainZone}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contraindications */}
              <div className="p-5 border-b border-gray-100 bg-yellow-50">
                <h3 className="font-bold mb-2 text-yellow-800">Contraindicações</h3>
                <ul className="space-y-1">
                  {selectedMuscle.contraindications.map((c, i) => (
                    <li key={i} className="text-sm text-yellow-700 flex items-center gap-2">
                      <span className="text-yellow-500">⚠</span> {c}
                    </li>
                  ))}
                </ul>
              </div>

              {/* PEDALA Protocol */}
              {selectedMuscle.protocols.map((protocol) => (
                <div key={protocol.id} className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold">{protocol.name}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        <span className={`px-2 py-0.5 rounded-full ${
                          protocol.difficulty === "basico" ? "bg-green-100 text-green-700" :
                          protocol.difficulty === "intermediario" ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {protocol.difficulty}
                        </span>
                        <span>{protocol.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* PEDALA Steps Navigator */}
                  <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
                    {protocol.pedalaSteps.map((ps, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveStep(i)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                          activeStep === i
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {stepNames[i]}
                      </button>
                    ))}
                  </div>

                  {/* Active Step Detail */}
                  {protocol.pedalaSteps[activeStep] && (
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl gradient-primary text-white flex items-center justify-center text-lg font-bold">
                          {protocol.pedalaSteps[activeStep].step === "A2" ? "A" : protocol.pedalaSteps[activeStep].step}
                        </div>
                        <div>
                          <div className="font-semibold">{stepNames[activeStep]}</div>
                          <div className="text-xs text-gray-400">{protocol.pedalaSteps[activeStep].duration}</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {protocol.pedalaSteps[activeStep].instruction}
                      </p>
                      {protocol.pedalaSteps[activeStep].tips.length > 0 && (
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-gray-500">Dicas:</div>
                          {protocol.pedalaSteps[activeStep].tips.map((tip, j) => (
                            <div key={j} className="text-xs text-accent flex items-start gap-1.5">
                              <span className="mt-0.5">💡</span> {tip}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Navigation between steps */}
                      <div className="flex justify-between pt-2">
                        <button
                          onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                          disabled={activeStep === 0}
                          className="text-sm text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          ← Anterior
                        </button>
                        <button
                          onClick={() => setActiveStep(Math.min(protocol.pedalaSteps.length - 1, activeStep + 1))}
                          disabled={activeStep === protocol.pedalaSteps.length - 1}
                          className="text-sm text-primary font-medium hover:underline disabled:opacity-30"
                        >
                          Próximo →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!selectedRegion && (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <div className="text-5xl mb-4">🗺️</div>
              <h2 className="text-xl font-bold mb-2">Explore o Mapa da Dor</h2>
              <p className="text-gray-500 max-w-md mx-auto">
                Clique em qualquer região do corpo humano à esquerda para ver os músculos, pontos gatilho e protocolos PEDALA disponíveis.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {(["pescoco", "lombar", "ombro", "quadril"] as BodyRegion[]).map((region) => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    className="px-4 py-2 bg-primary-light text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition"
                  >
                    {regionNames[region]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
