'use client';

import { useEffect, useState } from 'react';
import DetalhesAluno from '@/components/DetalhesAluno';
import FormAluno from '@/components/FormAluno';
import Mensagem from '@/components/Mensagem';
import Modal from '@/components/Modal';
import { excluirAluno, listarAlunos } from '@/lib/api';
import { Aluno } from '@/types/aluno';

export default function Home() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');

  // aviso verde (sucesso) ou vermelho (erro) que aparece no topo
  const [avisoTipo, setAvisoTipo] = useState<'sucesso' | 'erro'>('sucesso');
  const [avisoTexto, setAvisoTexto] = useState('');

  // controle das janelas que aparecem por cima da tela
  const [formAberto, setFormAberto] = useState(false);
  const [alunoEmEdicao, setAlunoEmEdicao] = useState<Aluno | null>(null);
  const [detalheId, setDetalheId] = useState<string | null>(null);

  // busca a lista de alunos na API
  async function carregarAlunos() {
    try {
      const dados = await listarAlunos(busca);
      setAlunos(dados);
      setErro('');
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro inesperado');
    } finally {
      setCarregando(false);
    }
  }

  // carrega a lista quando a página abre e sempre que a busca muda
  useEffect(() => {
    carregarAlunos();
  }, [busca]);

  // mostra o aviso e some com ele depois de 4 segundos
  function mostrarAviso(tipo: 'sucesso' | 'erro', texto: string) {
    setAvisoTipo(tipo);
    setAvisoTexto(texto);
    setTimeout(() => setAvisoTexto(''), 4000);
  }

  function abrirNovo() {
    setAlunoEmEdicao(null);
    setFormAberto(true);
  }

  function abrirEdicao(aluno: Aluno) {
    setAlunoEmEdicao(aluno);
    setFormAberto(true);
  }

  function fecharForm() {
    setFormAberto(false);
    setAlunoEmEdicao(null);
  }

  // o formulário chama essa função quando salva com sucesso
  function aoSalvar(texto: string) {
    fecharForm();
    mostrarAviso('sucesso', texto);
    carregarAlunos();
  }

  async function excluir(aluno: Aluno) {
    const confirmou = window.confirm(
      `Tem certeza que deseja excluir ${aluno.nome}?`,
    );
    if (!confirmou) return;

    try {
      await excluirAluno(aluno.id);
      mostrarAviso('sucesso', 'Aluno excluído com sucesso!');
      carregarAlunos();
    } catch (e) {
      mostrarAviso('erro', e instanceof Error ? e.message : 'Erro inesperado');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <main className="mx-auto max-w-5xl p-4 sm:p-6">
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Cadastro de alunos</h1>
          <button
            onClick={abrirNovo}
            className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Novo aluno
          </button>
        </header>

        {avisoTexto && <Mensagem tipo={avisoTipo} texto={avisoTexto} />}

        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome ou email"
          className="mb-4 w-full rounded border border-gray-300 bg-white px-3 py-2"
        />

        {erro && <Mensagem tipo="erro" texto={erro} />}

        {carregando && <p>Carregando...</p>}

        {!carregando && alunos.length === 0 && (
          <p className="text-gray-600">Nenhum aluno encontrado.</p>
        )}

        {!carregando && alunos.length > 0 && (
          <div className="overflow-x-auto rounded border border-gray-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Nome</th>
                  <th className="p-3">Email</th>
                  <th className="hidden p-3 md:table-cell">Curso</th>
                  <th className="hidden p-3 md:table-cell">Status</th>
                  <th className="p-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {alunos.map((aluno) => (
                  <tr key={aluno.id} className="border-t border-gray-200">
                    <td className="p-3">{aluno.nome}</td>
                    <td className="p-3">{aluno.email}</td>
                    <td className="hidden p-3 md:table-cell">{aluno.curso}</td>
                    <td className="hidden p-3 md:table-cell">
                      {aluno.ativo ? 'Ativo' : 'Inativo'}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setDetalheId(aluno.id)}
                          className="rounded border border-gray-300 px-2 py-1 hover:bg-gray-100"
                        >
                          Detalhes
                        </button>
                        <button
                          onClick={() => abrirEdicao(aluno)}
                          className="rounded border border-blue-300 px-2 py-1 text-blue-700 hover:bg-blue-50"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => excluir(aluno)}
                          className="rounded border border-red-300 px-2 py-1 text-red-700 hover:bg-red-50"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {formAberto && (
        <Modal
          titulo={alunoEmEdicao ? 'Editar aluno' : 'Novo aluno'}
          onFechar={fecharForm}
        >
          <FormAluno
            aluno={alunoEmEdicao ?? undefined}
            onSalvo={aoSalvar}
            onCancelar={fecharForm}
          />
        </Modal>
      )}

      {detalheId && (
        <Modal titulo="Detalhes do aluno" onFechar={() => setDetalheId(null)}>
          <DetalhesAluno id={detalheId} />
        </Modal>
      )}
    </div>
  );
}