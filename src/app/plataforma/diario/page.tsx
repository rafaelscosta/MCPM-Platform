"use client";

import { useState } from "react";
import { regionNames } from "@/data/muscles";
import type { BodyRegion, Technique } from "@/types";

interface SessionEntry {
  id: string;
  date: string;
  patientName: string;
  region: BodyRegion;
  technique: Technique;
  painBefore: number;
  painAfter: number;
  protocol: string;
  duration: number;
  chargedAmount: number;
  notes: string;
}

const demoSessions: SessionEntry[] = [
  { id: "1", date: "2026-03-04", patientName: "Maria Silva", region: "pescoco", technique: "LIFE", painBefore: 8, painAfter: 2, protocol: "Trapézio Superior - PEDALA", duration: 45, chargedAmount: 150, notes: "Paciente com dor cervical há 3 meses. Aplicado PEDALA completo. Alívio imediato." },
  { id: "2", date: "2026-03-03", patientName: "João Pereira", region: "lombar", technique: "LIFE", painBefore: 7, painAfter: 1, protocol: "Quadrado Lombar - PEDALA", duration: 50, chargedAmount: 180, notes: "Lombalgia crônica. Quadrado Lombar bilateral. Resultado excelente." },
  { id: "3", date: "2026-03-01", patientName: "Ana Carvalho", region: "ombro", technique: "LIFE", painBefore: 6, painAfter: 2, protocol: "Supraespinhoso - PEDALA", duration: 40, chargedAmount: 150, notes: "Dor no ombro direito. Impacto do supraespinhoso. Melhorou amplitude." },
  { id: "4", date: "2026-02-28", patientName: "Carlos Santos", region: "quadril", technique: "LIFE", painBefore: 9, painAfter: 3, protocol: "Piriforme - PEDALA", duration: 55, chargedAmount: 200, notes: "Falsa ciática. Piriforme muito ativo. Alívio significativo." },
  { id: "5", date: "2026-02-26", patientName: "Lucia Oliveira", region: "costas_superior", technique: "LIFE", painBefore: 5, painAfter: 1, protocol: "Rombóides - PEDALA", duration: 35, chargedAmount: 120, notes: "Dor interescapular. Postura cifótica. Orientada sobre ergonomia." },
];

const regions: BodyRegion[] = ["cabeca", "pescoco", "ombro", "braco", "antebraco", "torax", "lombar", "quadril", "coxa", "perna", "costas_superior", "costas_media"];
const techniques: Technique[] = ["LIFE", "SOFT", "FIT", "DETOX"];

export default function DiarioPage() {
  const [sessions, setSessions] = useState<SessionEntry[]>(demoSessions);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    patientName: "",
    region: "pescoco" as BodyRegion,
    technique: "LIFE" as Technique,
    painBefore: 5,
    painAfter: 0,
    protocol: "",
    duration: 45,
    chargedAmount: 150,
    notes: "",
  });

  const totalRevenue = sessions.reduce((sum, s) => sum + s.chargedAmount, 0);
  const avgReduction = sessions.length > 0
    ? Math.round(sessions.reduce((sum, s) => sum + ((s.painBefore - s.painAfter) / s.painBefore) * 100, 0) / sessions.length)
    : 0;
  const avgPainBefore = sessions.length > 0 ? (sessions.reduce((s, e) => s + e.painBefore, 0) / sessions.length).toFixed(1) : 0;
  const avgPainAfter = sessions.length > 0 ? (sessions.reduce((s, e) => s + e.painAfter, 0) / sessions.length).toFixed(1) : 0;

  const handleSubmit = () => {
    const newSession: SessionEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      ...form,
    };
    setSessions([newSession, ...sessions]);
    setShowForm(false);
    setForm({ patientName: "", region: "pescoco", technique: "LIFE", painBefore: 5, painAfter: 0, protocol: "", duration: 45, chargedAmount: 150, notes: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Diário Clínico</h1>
          <p className="text-gray-500 text-sm mt-1">Registre seus atendimentos e construa seu portfólio de resultados.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-dark transition"
        >
          {showForm ? "Cancelar" : "+ Novo Atendimento"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="text-xs text-gray-400">Total de Sessões</div>
          <div className="text-2xl font-bold mt-1">{sessions.length}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="text-xs text-gray-400">Faturamento Total</div>
          <div className="text-2xl font-bold text-green-600 mt-1">R${totalRevenue.toLocaleString("pt-BR")}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="text-xs text-gray-400">Redução Média de Dor</div>
          <div className="text-2xl font-bold text-primary mt-1">{avgReduction}%</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="text-xs text-gray-400">Dor Média (Antes → Depois)</div>
          <div className="text-2xl font-bold mt-1">
            <span className="text-red-400">{avgPainBefore}</span>
            <span className="text-gray-300 mx-1">→</span>
            <span className="text-green-500">{avgPainAfter}</span>
          </div>
        </div>
      </div>

      {/* New Session Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-bold text-lg">Registrar Atendimento</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Paciente</label>
              <input
                type="text"
                value={form.patientName}
                onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder="Ex: Maria Silva"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Região da Queixa</label>
              <select
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value as BodyRegion })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              >
                {regions.map((r) => (
                  <option key={r} value={r}>{regionNames[r]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Técnica Aplicada</label>
              <select
                value={form.technique}
                onChange={(e) => setForm({ ...form, technique: e.target.value as Technique })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              >
                {techniques.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Protocolo Aplicado</label>
              <input
                type="text"
                value={form.protocol}
                onChange={(e) => setForm({ ...form, protocol: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder="Ex: Trapézio Superior - PEDALA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dor Antes (0-10)</label>
              <input
                type="range"
                min="0"
                max="10"
                value={form.painBefore}
                onChange={(e) => setForm({ ...form, painBefore: Number(e.target.value) })}
                className="w-full accent-red-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0</span>
                <span className="font-bold text-red-500 text-lg">{form.painBefore}</span>
                <span>10</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dor Depois (0-10)</label>
              <input
                type="range"
                min="0"
                max="10"
                value={form.painAfter}
                onChange={(e) => setForm({ ...form, painAfter: Number(e.target.value) })}
                className="w-full accent-green-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0</span>
                <span className="font-bold text-green-500 text-lg">{form.painAfter}</span>
                <span>10</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duração (minutos)</label>
              <input
                type="number"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor Cobrado (R$)</label>
              <input
                type="number"
                value={form.chargedAmount}
                onChange={(e) => setForm({ ...form, chargedAmount: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
              placeholder="Detalhes do atendimento, observações importantes..."
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!form.patientName || !form.protocol}
            className="bg-primary text-white px-8 py-3 rounded-xl font-medium hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Registrar Atendimento
          </button>
        </div>
      )}

      {/* Sessions List */}
      <div className="space-y-3">
        {sessions.map((session) => {
          const reduction = Math.round(((session.painBefore - session.painAfter) / session.painBefore) * 100);
          return (
            <div key={session.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                    <span className="text-primary font-bold">{reduction}%</span>
                  </div>
                  <div>
                    <div className="font-semibold">{session.patientName}</div>
                    <div className="text-sm text-gray-500 mt-0.5">
                      {regionNames[session.region]} — {session.protocol}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>{session.date}</span>
                      <span>{session.duration} min</span>
                      <span className={`px-2 py-0.5 rounded-full ${
                        session.technique === "LIFE" ? "bg-red-50 text-life" :
                        session.technique === "SOFT" ? "bg-blue-50 text-soft" :
                        session.technique === "FIT" ? "bg-green-50 text-fit" :
                        "bg-yellow-50 text-detox"
                      }`}>{session.technique}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm">
                    <span className="text-red-400 font-semibold">{session.painBefore}</span>
                    <span className="text-gray-300 mx-1">→</span>
                    <span className="text-green-500 font-bold text-lg">{session.painAfter}</span>
                  </div>
                  <div className="text-green-600 font-semibold mt-1">R${session.chargedAmount}</div>
                </div>
              </div>
              {session.notes && (
                <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
                  {session.notes}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
