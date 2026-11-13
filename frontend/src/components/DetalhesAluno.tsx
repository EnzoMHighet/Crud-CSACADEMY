'use client';

import { useEffect, useState } from 'react';
import { buscarAluno } from '@/lib/api';
import { Aluno } from '@/types/aluno';
import Mensagem from './Mensagem';

export default function DetalhesAluno({ id }: { id: string }) {
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [erro, setErro] = useState('');

  // busca o aluno na API quando a janela abre
  useEffect(() => {
    async function carregar() {
      try {
        const dados = await buscarAluno(id);
        setAluno(dados);
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Erro inesperado');
      }
    }

    carregar();
  }, [id]);

  if (erro) return <Mensagem tipo="erro" texto={erro} />;
  if (!aluno) return <p>Carregando...</p>;

  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div>
        <dt className="text-sm text-gray-500">Nome</dt>
        <dd className="font-medium">{aluno.nome}</dd>
      </div>
      <div>
        <dt className="text-sm text-gray-500">Email</dt>
        <dd className="font-medium">{aluno.email}</dd>
      </div>
      <div>
        <dt className="text-sm text-gray-500">Telefone</dt>
        <dd className="font-medium">{aluno.telefone || '-'}</dd>
      </div>
      <div>
        <dt className="text-sm text-gray-500">Curso</dt>
        <dd className="font-medium">{aluno.curso}</dd>
      </div>
      <div>
        <dt className="text-sm text-gray-500">Status</dt>
        <dd className="font-medium">{aluno.ativo ? 'Ativo' : 'Inativo'}</dd>
      </div>
      <div>
        <dt className="text-sm text-gray-500">Cadastrado em</dt>
        <dd className="font-medium">
          {new Date(aluno.criado_em).toLocaleString('pt-BR')}
        </dd>
      </div>
    </dl>
  );
}