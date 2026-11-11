'use client';

import { FormEvent, useState } from 'react';
import { atualizarAluno, criarAluno } from '@/lib/api';
import { Aluno } from '@/types/aluno';
import Mensagem from './Mensagem';

type Props = {
  aluno?: Aluno;
  onSalvo: (mensagem: string) => void;
  onCancelar: () => void;
};

const campo =
  'w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900';

export default function FormAluno({ aluno, onSalvo, onCancelar }: Props) {
  const [nome, setNome] = useState(aluno?.nome ?? '');
  const [email, setEmail] = useState(aluno?.email ?? '');
  const [telefone, setTelefone] = useState(aluno?.telefone ?? '');
  const [curso, setCurso] = useState(aluno?.curso ?? '');
  const [ativo, setAtivo] = useState(aluno?.ativo ?? true);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    const dados = { nome, email, telefone, curso, ativo };
    try {
      if (aluno) {
        await atualizarAluno(aluno.id, dados);
        onSalvo('Aluno atualizado com sucesso!');
      } else {
        await criarAluno(dados);
        onSalvo('Aluno cadastrado com sucesso!');
      }
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {erro && (
        <div className="sm:col-span-2">
          <Mensagem tipo="erro" texto={erro} />
        </div>
      )}

      <label className="sm:col-span-2">
        <span className="mb-1 block text-sm font-medium">Nome *</span>
        <input className={campo} value={nome} onChange={(e) => setNome(e.target.value)} />
      </label>

      <label className="sm:col-span-2">
        <span className="mb-1 block text-sm font-medium">Email *</span>
        <input className={campo} value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>

      <label>
        <span className="mb-1 block text-sm font-medium">Telefone</span>
        <input className={campo} value={telefone} onChange={(e) => setTelefone(e.target.value)} />
      </label>

      <label>
        <span className="mb-1 block text-sm font-medium">Curso *</span>
        <input className={campo} value={curso} onChange={(e) => setCurso(e.target.value)} />
      </label>

      <label className="flex items-center gap-2 sm:col-span-2">
        <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} />
        <span className="text-sm font-medium">Aluno ativo</span>
      </label>

      <div className="flex gap-2 sm:col-span-2">
        <button
          type="submit"
          disabled={enviando}
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {enviando ? 'Salvando...' : 'Salvar'}
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="rounded border border-gray-300 px-4 py-2 font-medium hover:bg-gray-100"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}