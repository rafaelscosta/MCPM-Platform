"use client";

import { useState } from "react";
import Link from "next/link";

type Step = "experience" | "goal" | "focus" | "availability" | "result";

interface QuizAnswer {
  experience: string;
  goal: string;
  focus: string;
  availability: string;
}

const profiles = {
  iniciante: {
    title: "Perfil Iniciante",
    description: "Sua trilha começa pelo PEDALA + 2 músculos fundamentais (Trapézio Superior e Quadrado Lombar).",
    focus: "Foco: seu primeiro atendimento pago em 14 dias.",
    modules: ["PEDALA Framework Completo", "Trapézio Superior - Protocolo Life", "Quadrado Lombar - Protocolo Life", "Script de Captação", "Precificação Básica"],
    color: "bg-accent",
    timeline: "8-12 semanas para Praticante PEDALA",
  },
  intermediario: {
    title: "Perfil Intermediário",
    description: "Sua trilha foca na técnica de maior gap e na fidelização de pacientes.",
    focus: "Foco: aumentar precificação e fidelização.",
    modules: ["Avaliação de Gaps Técnicos", "Protocolos Avançados LIFE", "Técnicas de Fidelização", "Planos de Tratamento", "Precificação Premium"],
    color: "bg-secondary-light",
    timeline: "6-8 semanas para Terapeuta MCPM Life",
  },
  avancado: {
    title: "Perfil Avançado",
    description: "Acesso direto a protocolos avançados e casos complexos com dor referida.",
    focus: "Foco: especialização e certificação completa.",
    modules: ["Protocolos de Dor Referida", "Casos Complexos", "Todas as 4 Técnicas", "Gestão de Agenda Avançada", "Posicionamento Digital"],
    color: "bg-primary",
    timeline: "4-6 semanas para Especialista Completo",
  },
};

export default function DiagnosticoPage() {
  const [step, setStep] = useState<Step>("experience");
  const [answers, setAnswers] = useState<QuizAnswer>({
    experience: "",
    goal: "",
    focus: "",
    availability: "",
  });

  const setAnswer = (key: keyof QuizAnswer, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const getProfile = () => {
    if (answers.experience === "zero") return "iniciante";
    if (answers.experience === "alguma") return "intermediario";
    return "avancado";
  };

  const steps: Step[] = ["experience", "goal", "focus", "availability", "result"];
  const currentIndex = steps.indexOf(step);
  const progress = ((currentIndex + 1) / steps.length) * 100;

  const next = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) setStep(steps[nextIndex]);
  };

  const back = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) setStep(steps[prevIndex]);
  };

  const profile = profiles[getProfile()];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-primary font-bold text-lg">MCPM</Link>
          <div className="text-sm text-gray-500">Diagnóstico Inicial</div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div className="h-full bg-primary transition-all duration-500 progress-animated" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Step: Experience */}
        {step === "experience" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Qual seu nível de experiência com massagem?</h1>
              <p className="text-gray-500">Isso nos ajuda a personalizar sua trilha de aprendizado.</p>
            </div>
            <div className="space-y-3">
              {[
                { value: "zero", label: "Começando do zero", desc: "Nunca fiz massagem profissionalmente" },
                { value: "alguma", label: "Alguma experiência", desc: "Já atendo mas quero me especializar" },
                { value: "avancada", label: "Experiência avançada", desc: "Sou profissional e quero o método MCPM" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => { setAnswer("experience", option.value); next(); }}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                    answers.experience === option.value
                      ? "border-primary bg-primary-light"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-sm text-gray-500 mt-1">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Goal */}
        {step === "goal" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Qual seu objetivo principal?</h1>
              <p className="text-gray-500">Entender seu objetivo nos permite focar no que importa para você.</p>
            </div>
            <div className="space-y-3">
              {[
                { value: "renda_extra", label: "Renda extra", desc: "Quero uma fonte adicional de renda com massagem" },
                { value: "profissao_principal", label: "Profissão principal", desc: "Quero viver 100% de massoterapia clínica" },
                { value: "complementar_formacao", label: "Complementar formação", desc: "Sou profissional de saúde e quero agregar o método" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => { setAnswer("goal", option.value); next(); }}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                    answers.goal === option.value
                      ? "border-primary bg-primary-light"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-sm text-gray-500 mt-1">{option.desc}</div>
                </button>
              ))}
            </div>
            <button onClick={back} className="text-sm text-gray-400 hover:text-gray-600 transition">Voltar</button>
          </div>
        )}

        {/* Step: Focus */}
        {step === "focus" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Onde pretende atuar?</h1>
              <p className="text-gray-500">Cada ambiente tem suas particularidades no atendimento.</p>
            </div>
            <div className="space-y-3">
              {[
                { value: "clinicas", label: "Clínicas e consultórios", desc: "Atendimento fixo em local profissional" },
                { value: "domicilio", label: "Atendimento domiciliar", desc: "Atender na casa do paciente" },
                { value: "eventos", label: "Eventos e empresas", desc: "Quick massage e eventos corporativos" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => { setAnswer("focus", option.value); next(); }}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                    answers.focus === option.value
                      ? "border-primary bg-primary-light"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-sm text-gray-500 mt-1">{option.desc}</div>
                </button>
              ))}
            </div>
            <button onClick={back} className="text-sm text-gray-400 hover:text-gray-600 transition">Voltar</button>
          </div>
        )}

        {/* Step: Availability */}
        {step === "availability" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Quanto tempo tem para estudar por semana?</h1>
              <p className="text-gray-500">Adaptamos o ritmo da trilha à sua disponibilidade.</p>
            </div>
            <div className="space-y-3">
              {[
                { value: "pouco", label: "Até 3 horas/semana", desc: "Estudo nos intervalos, ritmo suave" },
                { value: "moderado", label: "3-7 horas/semana", desc: "Estudo regular, ritmo moderado" },
                { value: "intenso", label: "7+ horas/semana", desc: "Dedicação intensa, ritmo acelerado" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => { setAnswer("availability", option.value); next(); }}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                    answers.availability === option.value
                      ? "border-primary bg-primary-light"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-sm text-gray-500 mt-1">{option.desc}</div>
                </button>
              ))}
            </div>
            <button onClick={back} className="text-sm text-gray-400 hover:text-gray-600 transition">Voltar</button>
          </div>
        )}

        {/* Result */}
        {step === "result" && (
          <div className="space-y-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Sua Trilha Personalizada</h1>
              <p className="text-gray-500">Com base nas suas respostas, montamos o caminho ideal para você.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className={`${profile.color} p-6 text-white`}>
                <h2 className="text-2xl font-bold">{profile.title}</h2>
                <p className="text-white/80 mt-1">{profile.timeline}</p>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-gray-700">{profile.description}</p>
                <p className="font-semibold text-primary">{profile.focus}</p>
                <div>
                  <h3 className="font-semibold mb-2">Sua trilha inclui:</h3>
                  <ul className="space-y-2">
                    {profile.modules.map((mod, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <span className="w-5 h-5 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs">&#10003;</span>
                        {mod}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/plataforma"
                className="bg-primary text-white py-4 px-8 rounded-xl text-center font-semibold text-lg hover:bg-primary-dark transition shadow-lg shadow-primary/30"
              >
                Acessar Minha Plataforma
              </Link>
              <button onClick={back} className="text-sm text-gray-400 hover:text-gray-600 transition">Voltar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
