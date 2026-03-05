"use client";

import { useState, useEffect, useCallback } from "react";
import { regionNames } from "@/data/muscles";
import type { BodyRegion, Technique } from "@/types";

interface SessionEntry {
  id: string;
  date: string;
  patientName: string;
  region: BodyRegion;
  technique: Technique;
  muscleId: string;
  protocolId: string;
  painBefore: number;
  painAfter: number;
  duration: number;
  chargedAmount: number;
  notes: string;
  isPublic: boolean;
}

const regions: BodyRegion[] = ["cabeca", "pescoco", "ombro", "braco", "antebraco", "torax", "abdomen", "lombar", "quadril", "coxa", "joelho", "perna", "pe", "costas_superior", "costas_media", "costas_inferior"];
const techniques: Technique[] = ["LIFE", "SOFT", "FIT", "DETOX"];

export default function DiarioPage() {
  const [sessions, setSessions] = useState<SessionEntry[]>([]);
  const [stats, setStats] = useState({ totalSessions: 0, totalRevenue: 0, avgReduction: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    patientName: "",
    region: "pescoco" as BodyRegion,
    technique: "LIFE" as Technique,
    muscleId: "trapezio_superior",
    protocolId: "prot-trap-sup-life",
    painBefore: 5,
    painAfter: 0,
    duration: 45,
    chargedAmount: 150,
    notes: "",
    isPublic: false,
  });

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch("/api/sessions");
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions);
        setStats(data.stats);
      }
    } catch {
      // Demo fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        await fetchSessions();
        setShowForm(false);
        setForm({ patientName: "", region: "pescoco", technique: "LIFE", muscleId: "trapezio_superior", protocolId: "prot-trap-sup-life", painBefore: 5, painAfter: 0, duration: 45, chargedAmount: 150, notes: "", isPublic: false });
      }
    } catch {
      const newSession: SessionEntry = { id: Date.now().toString(), date: new Date().toISOString(), ...form };
      setSessions([newSession, ...sessions]);
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const shareToWhatsApp = (session: SessionEntry) => {
    const reduction = session.painBefore > 0 ? Math.round(((session.painBefore - session.painAfter) / session.painBefore) * 100) : 0;
    const text = encodeURIComponent(
      `Resultado do atendimento com Método MCPM:\n\nRegião: ${regionNames[session.region] || session.region}\nDor antes: ${session.painBefore}/10\nDor depois: ${session.painAfter}/10\nRedução: ${reduction}%\n\nMétodo Cura Pelas Mãos - Certificado pelo MEC\nAgende sua sessão!`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const totalRevenue = sessions.reduce((sum, s) => sum + s.chargedAmount, 0);
  const avgReduction = sessions.length > 0 ? Math.round(sessions.reduce((sum, s) => sum + ((s.painBefore - s.painAfter) / Math.max(s.painBefore, 1)) * 100, 0) / sessions.length) : 0;
  const avgPainBefore = sessions.length > 0 ? (sessions.reduce((s, e) => s + e.painBefore, 0) / sessions.length).toFixed(1) : "0";
  const avgPainAfter = sessions.length > 0 ? (sessions.reduce((s, e) => s + e.painAfter, 0) / sessions.length).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Diário Clínico</h1>
          <p className="text-gray-500 text-sm mt-1">Registre atendimentos e construa seu portfólio de resultados.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-primary text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-dark transition">
          {showForm ? "Cancelar" : "+ Novo Atendimento"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 animate-card-enter"><div className="text-xs text-gray-400">Sessões</div><div className="text-2xl font-bold mt-1">{stats.totalSessions || sessions.length}</div></div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 animate-card-enter"><div className="text-xs text-gray-400">Faturamento</div><div className="text-2xl font-bold text-green-600 mt-1">R${(stats.totalRevenue || totalRevenue).toLocaleString("pt-BR")}</div></div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 animate-card-enter"><div className="text-xs text-gray-400">Redução de Dor</div><div className="text-2xl font-bold text-primary mt-1">{stats.avgReduction || avgReduction}%</div></div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 animate-card-enter"><div className="text-xs text-gray-400">Dor (Antes → Depois)</div><div className="text-2xl font-bold mt-1"><span className="text-red-400">{avgPainBefore}</span><span className="text-gray-300 mx-1">→</span><span className="text-green-500">{avgPainAfter}</span></div></div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 animate-slide-up">
          <h2 className="font-bold text-lg">Registrar Atendimento</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label><input type="text" value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Nome" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Região</label><select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value as BodyRegion })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary outline-none">{regions.map((r) => (<option key={r} value={r}>{regionNames[r]}</option>))}</select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Técnica</label><select value={form.technique} onChange={(e) => setForm({ ...form, technique: e.target.value as Technique })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary outline-none">{techniques.map((t) => (<option key={t} value={t}>{t}</option>))}</select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Músculo</label><input type="text" value={form.muscleId} onChange={(e) => setForm({ ...form, muscleId: e.target.value, protocolId: `prot-${e.target.value}` })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary outline-none" placeholder="trapezio_superior" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Dor Antes: <span className="text-red-500 font-bold text-lg">{form.painBefore}</span></label><input type="range" min="0" max="10" value={form.painBefore} onChange={(e) => setForm({ ...form, painBefore: Number(e.target.value) })} className="w-full accent-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Dor Depois: <span className="text-green-500 font-bold text-lg">{form.painAfter}</span></label><input type="range" min="0" max="10" value={form.painAfter} onChange={(e) => setForm({ ...form, painAfter: Number(e.target.value) })} className="w-full accent-green-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Duração (min)</label><input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label><input type="number" value={form.chargedAmount} onChange={(e) => setForm({ ...form, chargedAmount: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary outline-none" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Observações</label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary outline-none resize-none" /></div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isPublic} onChange={(e) => setForm({ ...form, isPublic: e.target.checked })} className="accent-primary w-4 h-4" /><span className="text-sm text-gray-600">Incluir no portfólio público</span></label>
          </div>
          <button onClick={handleSubmit} disabled={!form.patientName || saving} className="bg-primary text-white px-8 py-3 rounded-xl font-medium hover:bg-primary-dark transition disabled:opacity-50">
            {saving ? "Salvando..." : "Registrar Atendimento"}
          </button>
        </div>
      )}

      {/* Sessions */}
      {loading ? (
        <div className="text-center text-gray-400 py-12">Carregando...</div>
      ) : sessions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-3">📝</div>
          <h2 className="font-bold text-lg mb-1">Nenhum atendimento</h2>
          <p className="text-sm text-gray-400">Registre seu primeiro atendimento para começar.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const reduction = session.painBefore > 0 ? Math.round(((session.painBefore - session.painAfter) / session.painBefore) * 100) : 0;
            return (
              <div key={session.id} className="bg-white rounded-xl border border-gray-200 p-5 animate-card-enter">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center"><span className="text-primary font-bold">{reduction}%</span></div>
                    <div>
                      <div className="font-semibold">{session.patientName}</div>
                      <div className="text-sm text-gray-500 mt-0.5">{regionNames[session.region] || session.region}</div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        <span>{new Date(session.date).toLocaleDateString("pt-BR")}</span>
                        <span>{session.duration}min</span>
                        <span className={`px-2 py-0.5 rounded-full ${session.technique === "LIFE" ? "bg-red-50 text-life" : session.technique === "SOFT" ? "bg-blue-50 text-soft" : session.technique === "FIT" ? "bg-green-50 text-fit" : "bg-yellow-50 text-detox"}`}>{session.technique}</span>
                        {session.isPublic && <span className="text-accent">Portfólio</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div><span className="text-red-400 font-semibold">{session.painBefore}</span><span className="text-gray-300 mx-1">→</span><span className="text-green-500 font-bold text-lg">{session.painAfter}</span></div>
                    <div className="text-green-600 font-semibold mt-1">R${session.chargedAmount}</div>
                    <button onClick={() => shareToWhatsApp(session)} className="text-xs text-green-600 mt-2 hover:underline flex items-center gap-1 justify-end">📱 Compartilhar</button>
                  </div>
                </div>
                {session.notes && <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">{session.notes}</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
