'use client';

import { useEffect, useState } from 'react';
import DetalhesAluno from '@/components/DetalhesAluno';
import FormAluno from '@/components/FormAluno';
import Mensagem from '@/components/Mensagem';
import Modal from '@/components/Modal';
import { excluirAluno, listarAlunos } from '@/lib/api';
import { Aluno } from '@/types/aluno';

type Feedback = { tipo: 'sucesso' | 'erro'; texto: string };

const textoErro = (e: unknown) =>
  e instanceof Error ? e.message : 'Erro inesperado';

export default function Home() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  const [termo, setTermo] = useState('');
  const [versao, setVersao] = useState(0);
  const [mensagem, setMensagem] = useState<Feedback | null>(null);
  const [formAberto, setFormAberto] = useState(false);
  const [alunoEmEdicao, setAlunoEmEdicao] = useState<Aluno | null>(null);
  const [detalheId, setDetalheId] = useState<string | null>(null);

  // Espera 400 ms depois da última tecla antes de buscar (debounce)
  useEffect(() => {
    const t = setTimeout(() => setTermo(busca), 400);
    return () => clearTimeout(t);
  }, [busca]);

  // Carrega a lista ao abrir, ao mudar a busca e após qualquer alteração
  useEffect(() => {
    let cancelado = false;
    listarAlunos(termo)
      .then((dados) => {
        if (cancelado) return;
        setAlunos(dados);
        setErro('');
      })
      .catch((e) => {
        if (!cancelado) setErro(textoErro(e));
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });
    return () => {
      cancelado = true;
    };
  }, [termo, versao]);

  // Some com a mensagem depois de 4 segundos
  useEffect(() => {
    if (!mensagem) return;
    const t = setTimeout(() => setMensagem(null), 4000);
    return () => clearTimeout(t);
  }, [mensagem]);

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

  function aoSalvar(texto: string) {
    fecharForm();
    setMensagem({ tipo: 'sucesso', texto });
    setVersao((v) => v + 1);
  }

  async function excluir(aluno: Aluno) {
    if (!window.confirm(`Tem certeza que deseja excluir ${aluno.nome}?`)) return;
    try {
      await excluirAluno(aluno.id);
      setMensagem({ tipo: 'sucesso', texto: 'Aluno excluído com sucesso!' });
      setVersao((v) => v + 1);
    } catch (e) {
      setMensagem({ tipo: 'erro', texto: textoErro(e) });
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

        {mensagem && <Mensagem tipo={mensagem.tipo} texto={mensagem.texto} />}

        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome ou email"
          className="mb-4 w-full rounded border border-gray-300 bg-white px-3 py-2"
        />

        {erro && <Mensagem tipo="erro" texto={erro} />}

        {carregando ? (
          <p>Carregando...</p>
        ) : alunos.length === 0 ? (
          <p className="text-gray-600">Nenhum aluno encontrado.</p>
        ) : (
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