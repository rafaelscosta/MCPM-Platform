"use client";

import { useState } from "react";
import { muscles, techniqueInfo, regionNames } from "@/data/muscles";
import type { Technique, BodyRegion } from "@/types";
import Link from "next/link";

export default function ProtocolosPage() {
  const [filterTechnique, setFilterTechnique] = useState<Technique | "all">("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [search, setSearch] = useState("");

  const allProtocols = muscles.flatMap((m) =>
    m.protocols.map((p) => ({
      ...p,
      muscleName: m.name,
      region: m.region,
      muscleId: m.id,
    }))
  );

  const filtered = allProtocols.filter((p) => {
    if (filterTechnique !== "all" && p.technique !== filterTechnique) return false;
    if (filterDifficulty !== "all" && p.difficulty !== filterDifficulty) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.muscleName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Protocolos PEDALA</h1>
        <p className="text-gray-500 text-sm mt-1">
          Explore os 196+ protocolos clínicos organizados por técnica, região e dificuldade.
        </p>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar protocolo ou músculo..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Technique filter */}
        <button
          onClick={() => setFilterTechnique("all")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
            filterTechnique === "all" ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600"
          }`}
        >
          Todas técnicas
        </button>
        {(Object.entries(techniqueInfo) as [Technique, typeof techniqueInfo.LIFE][]).map(([key, info]) => (
          <button
            key={key}
            onClick={() => setFilterTechnique(key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
              filterTechnique === key ? "text-white" : "bg-white border border-gray-200 text-gray-600"
            }`}
            style={filterTechnique === key ? { backgroundColor: info.color } : {}}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: info.color }} />
            {info.name}
          </button>
        ))}

        <div className="w-px bg-gray-200 mx-1" />

        {/* Difficulty filter */}
        {[
          { value: "all", label: "Todos" },
          { value: "basico", label: "Básico" },
          { value: "intermediario", label: "Intermediário" },
          { value: "avancado", label: "Avançado" },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilterDifficulty(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              filterDifficulty === opt.value ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-400">{filtered.length} protocolo{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}</div>

      {/* Protocol Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map((protocol) => (
          <Link
            key={protocol.id}
            href="/plataforma/mapa-da-dor"
            className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary/30 hover:shadow-sm transition"
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
                style={{ backgroundColor: techniqueInfo[protocol.technique].color }}
              >
                {protocol.technique}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                protocol.difficulty === "basico" ? "bg-green-100 text-green-700" :
                protocol.difficulty === "intermediario" ? "bg-yellow-100 text-yellow-700" :
                "bg-red-100 text-red-700"
              }`}>
                {protocol.difficulty}
              </span>
            </div>
            <h3 className="font-bold">{protocol.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{protocol.description}</p>
            <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
              <span>{regionNames[protocol.region]}</span>
              <span>{protocol.duration}</span>
              <span>{protocol.pedalaSteps.length} passos</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
