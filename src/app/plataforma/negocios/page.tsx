"use client";

import { useState } from "react";
import { businessModules } from "@/data/achievements";
import { useStudent } from "@/hooks/useStudent";

const moduleContent: Record<string, { lessons: { title: string; content: string; duration: string }[] }> = {
  "biz-pricing": {
    lessons: [
      { title: "Fórmula de Precificação MCPM", content: "Calcule seu preço baseado em resultado: (Custo fixo + Margem) x Fator Especialização. Uma terapeuta LIFE cobra em média R$120-180/sessão. Com certificação SOFT, R$200-280.", duration: "12 min" },
      { title: "Pacotes de Tratamento", content: "Venda pacotes de 5 ou 10 sessões com desconto progressivo (10-20%). Isso garante recorrência e fideliza o paciente. Ex: Sessão avulsa R$150, pacote 5 R$675 (10% off), pacote 10 R$1.200 (20% off).", duration: "15 min" },
      { title: "Upsell com Técnicas Complementares", content: "Após dominar LIFE, ofereça SOFT como complemento. Sessão combinada LIFE+SOFT: R$250-350. O paciente percebe mais valor e você fatura mais por atendimento.", duration: "10 min" },
      { title: "Quando Aumentar Seu Preço", content: "Aumente 15-20% a cada certificação conquistada. Use seu portfólio MCPM como justificativa: mostre as estatísticas de redução de dor e depoimentos reais.", duration: "8 min" },
    ],
  },
  "biz-clients": {
    lessons: [
      { title: "Funil MCPM de Captação", content: "1) Conteúdo educativo no Instagram (dor referida, pontos gatilho) → 2) Sessão demonstrativa com desconto → 3) Pacote de tratamento → 4) Indicação. Cada aluna MCPM atrai em média 3 novos pacientes por indicação.", duration: "15 min" },
      { title: "Instagram para Terapeutas", content: "Poste 3x/semana: antes/depois (com autorização), dicas de autocuidado, bastidores do atendimento. Use hashtags: #massoterapiaclinica #pontosgatilho #dorlombar #mcpm. Bio: link para agendamento.", duration: "20 min" },
      { title: "Parcerias com Academias e Studios", content: "Ofereça sessões avaliativas para alunos de CrossFit, Pilates e musculação. Técnica FIT é perfeita para esse público. Proposta: sessão gratuita para os 5 primeiros → converta para pacote.", duration: "12 min" },
      { title: "Google Meu Negócio", content: "Cadastre-se com fotos profissionais, horários e especialidades. Peça avaliações 5 estrelas após cada sessão bem-sucedida. Terapeutas com 20+ avaliações recebem 3x mais contatos.", duration: "10 min" },
    ],
  },
  "biz-retention": {
    lessons: [
      { title: "Protocolo de Retenção MCPM", content: "Após cada sessão: 1) WhatsApp em 24h perguntando como está, 2) Lembrete 7 dias antes da próxima sessão, 3) Relatório mensal de evolução via portfólio MCPM. Taxa de retorno: 85%+.", duration: "12 min" },
      { title: "Programa de Indicação", content: "Para cada paciente indicado que fechar pacote, o paciente que indicou ganha 1 sessão grátis. Isso cria um ciclo virtuoso: paciente satisfeito → indica → novo paciente → mais indicações.", duration: "10 min" },
      { title: "Plano de Manutenção", content: "Após o tratamento inicial (5-10 sessões), ofereça manutenção mensal ou quinzenal. Preço reduzido (20% off) para manutenção. Isso garante receita previsível.", duration: "10 min" },
    ],
  },
  "biz-plans": {
    lessons: [
      { title: "Criando Planos de Tratamento", content: "Estruture planos em 3 fases: Fase 1 (2-4 sessões): alívio agudo. Fase 2 (4-8 sessões): tratamento da causa. Fase 3 (mensal): manutenção. Apresente ao paciente como um 'programa', não sessões avulsas.", duration: "18 min" },
      { title: "Documentação Clínica", content: "Use o Diário Clínico MCPM para documentar: escala de dor antes/depois, protocolo aplicado, observações. Isso aumenta a confiança do paciente e diferencia você de massagistas comuns.", duration: "12 min" },
      { title: "Relatório de Evolução", content: "A cada 5 sessões, gere um relatório mostrando a curva de redução de dor. Use o portfólio MCPM para compartilhar. Pacientes que veem dados concretos continuam o tratamento.", duration: "10 min" },
    ],
  },
  "biz-portfolio": {
    lessons: [
      { title: "Construindo Seu Portfólio Digital", content: "Seu portfólio MCPM mostra: número de atendimentos, média de redução de dor, certificações, depoimentos. Compartilhe o link nas redes sociais e no WhatsApp Business. É sua vitrine profissional.", duration: "15 min" },
      { title: "Cases de Sucesso", content: "Documente 3-5 casos completos: queixa inicial, protocolo aplicado, resultado final. Com autorização do paciente, inclua fotos e depoimentos. Cases são a melhor ferramenta de vendas.", duration: "12 min" },
      { title: "Marca Pessoal", content: "Defina: especialidade (lombalgia? cefaleia? atletas?), diferencial (método PEDALA, resultados mensuráveis), e posicionamento (preço premium justificado por resultados). Sua marca é seu ativo mais valioso.", duration: "15 min" },
    ],
  },
  "biz-scale": {
    lessons: [
      { title: "De Terapeuta Solo para Clínica", content: "Modelo de escala MCPM: 1) Terapeuta solo (R$5-10K/mês) → 2) Sala própria com agenda cheia (R$10-20K/mês) → 3) Mini-clínica com 2-3 terapeutas (R$20-40K/mês). Cada etapa requer investimento progressivo.", duration: "20 min" },
      { title: "Formando Equipe", content: "Treine outros terapeutas no método MCPM. Eles atendem na sua clínica com split 60/40 (terapeuta/clínica). Qualidade garantida pelo protocolo PEDALA padronizado.", duration: "15 min" },
      { title: "Diversificando Receita", content: "Além de atendimentos: workshops para empresas, aulas online, mentoria para novos terapeutas, venda de produtos (rolos, bolas, óleos). Cada nova fonte pode adicionar R$2-5K/mês.", duration: "15 min" },
    ],
  },
};

export default function NegociosPage() {
  const { data } = useStudent();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  const stats = data?.stats;
  const totalSessions = stats?.totalSessions || 0;
  const totalRevenue = stats?.totalRevenue || 0;
  const ticketMedio = totalSessions > 0 ? Math.round(totalRevenue / totalSessions) : 0;

  // Unlock logic based on real data
  const unlockedModules = businessModules.map((m) => {
    let isUnlocked = false;
    if (m.id === "biz-pricing") isUnlocked = true; // Always available
    if (m.id === "biz-clients") isUnlocked = totalSessions >= 3;
    if (m.id === "biz-retention") isUnlocked = totalSessions >= 10;
    if (m.id === "biz-plans") isUnlocked = totalSessions >= 15;
    if (m.id === "biz-portfolio") isUnlocked = totalSessions >= 20;
    if (m.id === "biz-scale") isUnlocked = totalSessions >= 30;
    return { ...m, isUnlocked };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Modulo de Negocios</h1>
        <p className="text-gray-500 text-sm mt-1">
          Negocios integrado a sua progressao tecnica. A cada marco de atendimentos, novos conteudos sao desbloqueados.
        </p>
      </div>

      {/* Revenue Overview - Real Data */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-card-enter">
        <h2 className="font-bold mb-4">Seu Faturamento</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">R${totalRevenue.toLocaleString("pt-BR")}</div>
            <div className="text-xs text-gray-400">Total acumulado</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{totalSessions}</div>
            <div className="text-xs text-gray-400">Atendimentos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">R${ticketMedio}</div>
            <div className="text-xs text-gray-400">Ticket medio</div>
          </div>
        </div>

        {/* Revenue projection */}
        {totalSessions > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-400 mb-1">Projecao mensal (4 atendimentos/semana)</div>
            <div className="text-lg font-bold text-accent">
              R${(ticketMedio * 16).toLocaleString("pt-BR")}/mes
            </div>
          </div>
        )}
      </div>

      {/* Business Modules */}
      <div className="space-y-4">
        {unlockedModules.map((module, index) => {
          const lessons = moduleContent[module.id]?.lessons || [];
          const isExpanded = expandedModule === module.id;

          return (
            <div
              key={module.id}
              className={`bg-white rounded-xl border-2 overflow-hidden transition animate-card-enter ${
                module.isUnlocked
                  ? "border-gray-200 hover:border-primary/30"
                  : "border-gray-100 opacity-50"
              }`}
            >
              <button
                onClick={() => module.isUnlocked && setExpandedModule(isExpanded ? null : module.id)}
                className="w-full p-5 text-left"
                disabled={!module.isUnlocked}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0 ${
                      module.isUnlocked ? "gradient-primary text-white" : "bg-gray-100 text-gray-400"
                    }`}>
                      {module.isUnlocked ? index + 1 : "🔒"}
                    </div>
                    <div>
                      <h3 className="font-bold">{module.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{module.description}</p>
                      <div className="text-xs text-gray-400 mt-1">
                        {module.isUnlocked ? `${lessons.length} aulas` : module.unlockCondition}
                      </div>
                    </div>
                  </div>
                  {module.isUnlocked && (
                    <span className={`text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  )}
                </div>
              </button>

              {/* Expanded lesson content */}
              {isExpanded && module.isUnlocked && (
                <div className="px-5 pb-5 border-t border-gray-100">
                  <div className="space-y-2 mt-4">
                    {lessons.map((lesson, i) => {
                      const lessonKey = `${module.id}-${i}`;
                      const isLessonOpen = expandedLesson === lessonKey;

                      return (
                        <div key={i} className="border border-gray-100 rounded-lg overflow-hidden">
                          <button
                            onClick={() => setExpandedLesson(isLessonOpen ? null : lessonKey)}
                            className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs font-bold">
                                {i + 1}
                              </span>
                              <div>
                                <div className="font-medium text-sm">{lesson.title}</div>
                                <div className="text-xs text-gray-400">{lesson.duration}</div>
                              </div>
                            </div>
                            <span className={`text-xs text-gray-400 transition-transform ${isLessonOpen ? "rotate-180" : ""}`}>
                              ▼
                            </span>
                          </button>
                          {isLessonOpen && (
                            <div className="px-4 pb-4 pt-1">
                              <p className="text-sm text-gray-600 leading-relaxed">{lesson.content}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
