"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-primary">MCPM</Link>
          <div className="text-gray-400 text-sm">Academy</div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h1 className="text-xl font-bold mb-6">
            {isRegister ? "Criar sua conta" : "Acessar plataforma"}
          </h1>

          <div className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="Seu nome"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder="Sua senha"
              />
            </div>
            <Link
              href="/plataforma"
              className="block w-full bg-primary text-white py-3 rounded-xl font-semibold text-center hover:bg-primary-dark transition"
            >
              {isRegister ? "Criar conta" : "Entrar"}
            </Link>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-sm text-gray-500 hover:text-primary transition"
            >
              {isRegister ? "Já tem conta? Entrar" : "Não tem conta? Cadastrar"}
            </button>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-gray-400">
          &copy; 2026 MCPM Academy — Instituto Brasileiro de Cura Pelas Mãos
        </div>
      </div>
    </div>
  );
}
