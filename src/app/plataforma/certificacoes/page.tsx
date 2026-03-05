"use client";

import { certifications, certificationOrder } from "@/data/certifications";

export default function CertificacoesPage() {
  const currentLevel = "praticante_pedala";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Certificações por Competência</h1>
        <p className="text-gray-500 text-sm mt-1">
          Certificamos por competência demonstrada, não por horas assistidas. Construa sua stack de certificações.
        </p>
      </div>

      {/* Current Status */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="text-4xl">{certifications[currentLevel].icon}</div>
          <div>
            <div className="text-sm text-gray-400">Nível Atual</div>
            <div className="text-xl font-bold">{certifications[currentLevel].name}</div>
            <div className="text-sm text-gray-500">{certifications[currentLevel].description}</div>
          </div>
        </div>
      </div>

      {/* Certification Stack */}
      <div className="space-y-4">
        {certificationOrder.filter(id => id !== "none").map((id, index) => {
          const cert = certifications[id];
          const isCurrent = id === currentLevel;
          const isPast = certificationOrder.indexOf(id) < certificationOrder.indexOf(currentLevel);
          const isNext = certificationOrder.indexOf(id) === certificationOrder.indexOf(currentLevel) + 1;

          return (
            <div
              key={id}
              className={`bg-white rounded-xl border-2 p-5 transition ${
                isCurrent ? "border-primary shadow-md" :
                isPast ? "border-green-200 bg-green-50" :
                isNext ? "border-yellow-200" :
                "border-gray-200 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{cert.icon}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{cert.name}</h3>
                      {isPast && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Conquistado</span>}
                      {isCurrent && <span className="text-xs bg-primary-light text-primary px-2 py-0.5 rounded-full">Atual</span>}
                      {isNext && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Próximo</span>}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{cert.description}</p>
                    <div className="inline-block bg-primary-light text-primary text-xs px-2 py-0.5 rounded-full mt-2 font-medium">
                      {cert.marketValue}
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              {(isCurrent || isNext) && cert.requirements.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                  {cert.requirements.map((req, i) => {
                    const progress = isCurrent ? Math.min(100, Math.random() * 100) : 0;
                    return (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">{req.description}</span>
                          <span className="font-medium">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${isPast || progress >= 100 ? "bg-green-500" : "bg-primary"}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
