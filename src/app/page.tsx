"use client";

import Link from "next/link";
import { useState } from "react";

const techniques = [
  { id: "LIFE", name: "LIFE", subtitle: "Dor Física", description: "O carro-chefe. Resolva dores crônicas e agudas com o método mais eficaz do mercado.", color: "bg-life", icon: "💪" },
  { id: "SOFT", name: "SOFT", subtitle: "Liberação Miofascial", description: "Técnica suave para liberação de fáscia e tensões profundas.", color: "bg-soft", icon: "🧘" },
  { id: "FIT", name: "FIT", subtitle: "Esportiva", description: "Massagem funcional para atletas e praticantes de atividade física.", color: "bg-fit", icon: "⚡" },
  { id: "DETOX", name: "DETOX", subtitle: "Drenagem Terapêutica", description: "Drenagem linfática com base científica para resultados reais.", color: "bg-detox", icon: "💧" },
];

const pedalaSteps = [
  { letter: "P", name: "POSICIONAR", desc: "Paciente em posição adequada para o músculo alvo" },
  { letter: "E", name: "ELIMINAR", desc: "Localizar e trabalhar os pontos gatilho miofasciais" },
  { letter: "D", name: "DESCONTRAIR", desc: "Manobras de pressão no sentido das fibras musculares" },
  { letter: "A", name: "ALONGAR", desc: "Elongação da fibra muscular no sentido correto" },
  { letter: "L", name: "LIBERAR", desc: "Massagem transversal para liberação da fáscia" },
  { letter: "A", name: "ACONSELHAR", desc: "Orientação sobre hábitos, postura e prevenção" },
];

const stats = [
  { value: "5.000+", label: "Alunos formados" },
  { value: "97%", label: "Redução de dor na 1ª sessão" },
  { value: "196+", label: "Protocolos clínicos" },
  { value: "R$1.000", label: "Valor por sessão da criadora" },
];

const differentials = [
  {
    title: "Do Passivo ao Ativo",
    subtitle: "Aprendizado por Protocolo, não por Aula",
    description: "Ciclos de Aprender → Praticar → Documentar → Avançar. Cada protocolo é desbloqueado após prática real.",
    icon: "🔄",
  },
  {
    title: "Mapa da Dor Vivo",
    subtitle: "O coração interativo do método",
    description: "Corpo humano 2D interativo. Clique em qualquer região de dor e receba o protocolo PEDALA completo.",
    icon: "🗺️",
  },
  {
    title: "Portfólio de Resultados",
    subtitle: "A prova que você gera",
    description: "Cada atendimento vira registro no portfólio: dor antes/depois, protocolo aplicado, resultado comprovado.",
    icon: "📊",
  },
];

export default function HomePage() {
  const [activeTechnique, setActiveTechnique] = useState("LIFE");

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">MCPM</span>
              <span className="text-sm text-gray-500 hidden sm:block">Academy</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#metodo" className="text-sm text-gray-600 hover:text-primary transition">O Método</a>
              <a href="#pedala" className="text-sm text-gray-600 hover:text-primary transition">PEDALA</a>
              <a href="#plataforma" className="text-sm text-gray-600 hover:text-primary transition">Plataforma</a>
              <a href="#certificacoes" className="text-sm text-gray-600 hover:text-primary transition">Certificações</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-gray-600 hover:text-primary transition">Entrar</Link>
              <Link href="/diagnostico" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition">
                Começar Agora
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="gradient-hero text-white pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm mb-6">
              Certificado reconhecido pelo MEC
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Transforme suas mãos em{" "}
              <span className="text-primary">ferramentas de cura</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed">
              A primeira plataforma de ensino de massoterapia clínica que transforma alunos em profissionais
              <strong className="text-white"> ainda dentro do curso</strong>. Aprenda, pratique, documente e seja pago para cuidar de pessoas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/diagnostico" className="bg-primary text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-dark transition text-center shadow-lg shadow-primary/30">
                Comece Seu Diagnóstico Gratuito
              </Link>
              <a href="#metodo" className="border border-white/30 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition text-center">
                Conheça o Método
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Techniques */}
      <section id="metodo" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Os 4 Pilares do Método</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Domine 4 técnicas completas com 196+ protocolos clínicos e transforme qualquer tipo de dor.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {techniques.map((tech) => (
              <button
                key={tech.id}
                onClick={() => setActiveTechnique(tech.id)}
                className={`p-6 rounded-2xl border-2 transition-all text-left ${
                  activeTechnique === tech.id
                    ? "border-primary bg-white shadow-lg shadow-primary/10"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="text-3xl mb-3">{tech.icon}</div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-3 h-3 rounded-full ${tech.color}`} />
                  <h3 className="font-bold text-lg">{tech.name}</h3>
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">{tech.subtitle}</div>
                <p className="text-sm text-gray-600">{tech.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PEDALA Framework */}
      <section id="pedala" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">O Método PEDALA</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">O coração operacional do MCPM. Um framework de 6 passos replicável por qualquer aluno, com base fisiológica comprovada.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pedalaSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-4 p-6 rounded-xl bg-gray-50 hover:bg-primary-light transition group">
                <div className="w-12 h-12 rounded-xl gradient-primary text-white flex items-center justify-center text-xl font-bold shrink-0 group-hover:scale-110 transition">
                  {step.letter}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{step.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Differentials */}
      <section id="plataforma" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-primary-light text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              Plataforma Disruptiva
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">3 Diferenciais Que Mudam Tudo</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Não é um curso online comum. É uma plataforma que te transforma em profissional.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {differentials.map((diff) => (
              <div key={diff.title} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100">
                <div className="text-4xl mb-4">{diff.icon}</div>
                <h3 className="font-bold text-xl mb-1">{diff.title}</h3>
                <div className="text-sm text-primary font-medium mb-3">{diff.subtitle}</div>
                <p className="text-gray-600">{diff.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section id="certificacoes" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Certificação por Competência</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Não certificamos por horas assistidas. Certificamos por competência demonstrada com resultados reais.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Praticante PEDALA", req: "5 atendimentos + simulação", value: "Atende casualmente", icon: "🤲" },
              { name: "Terapeuta LIFE", req: "20 atendimentos + 70% efetividade", value: "R$120-180/sessão", icon: "💪" },
              { name: "Terapeuta SOFT", req: "15 atendimentos SOFT", value: "Serviços diferenciados", icon: "🧘" },
              { name: "Terapeuta FIT", req: "15 atendimentos + caso esportivo", value: "Nicho esportivo", icon: "⚡" },
              { name: "Terapeuta DETOX", req: "15 atendimentos + protocolo", value: "Clínicas e spas", icon: "💧" },
              { name: "Especialista Completo", req: "60 atendimentos + 4 módulos", value: "R$200-300+/sessão", icon: "👑" },
            ].map((cert) => (
              <div key={cert.name} className="p-6 rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-sm transition">
                <div className="text-3xl mb-3">{cert.icon}</div>
                <h3 className="font-bold text-lg mb-2">{cert.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{cert.req}</p>
                <div className="inline-block bg-primary-light text-primary text-sm px-3 py-1 rounded-full font-medium">
                  {cert.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="gradient-hero text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Não vendemos um curso de massagem
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Vendemos a transformação mais rápida e comprovada de quem quer{" "}
            <strong className="text-white">cuidar de pessoas em sofrimento — e ser pago para isso.</strong>
          </p>
          <Link
            href="/diagnostico"
            className="inline-block bg-primary text-white px-10 py-5 rounded-xl text-xl font-semibold hover:bg-primary-dark transition shadow-lg shadow-primary/30"
          >
            Comece Seu Diagnóstico Gratuito
          </Link>
          <p className="text-sm text-gray-400 mt-4">Descubra seu perfil e receba uma trilha personalizada</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-white text-xl font-bold mb-3">MCPM Academy</div>
              <p className="text-sm">Instituto Brasileiro de Cura Pelas Mãos. Método criado por Natália Tanaka.</p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3">Plataforma</h4>
              <div className="space-y-2 text-sm">
                <div><Link href="/mapa-da-dor" className="hover:text-white transition">Mapa da Dor</Link></div>
                <div><Link href="/protocolos" className="hover:text-white transition">Protocolos</Link></div>
                <div><Link href="/simulador" className="hover:text-white transition">Simulador</Link></div>
                <div><Link href="/diario" className="hover:text-white transition">Diário Clínico</Link></div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3">Método</h4>
              <div className="space-y-2 text-sm">
                <div><a href="#pedala" className="hover:text-white transition">PEDALA</a></div>
                <div><a href="#metodo" className="hover:text-white transition">4 Técnicas</a></div>
                <div><a href="#certificacoes" className="hover:text-white transition">Certificações</a></div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3">Contato</h4>
              <div className="space-y-2 text-sm">
                <div>contato@mcpmacademy.com.br</div>
                <div>Natália Tanaka - Criadora</div>
                <div>Rafael Costa - Tecnologia</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2026 MCPM Academy. Todos os direitos reservados. Certificado reconhecido pelo MEC.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
