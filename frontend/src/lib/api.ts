import { Aluno, DadosAluno } from '@/types/aluno.ts';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
const JSON_HEADERS = { 'Content-Type': 'application/json' };

async function requisicao<T>(caminho: string, opcoes?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API}${caminho}`, opcoes);
  } catch {
    throw new Error('Não foi possível conectar à API. Ela está ligada?');
  }

  if (!res.ok) {
    let texto = 'Erro inesperado. Tente novamente.';
    try {
      const corpo = await res.json();
      texto = Array.isArray(corpo.message)
        ? corpo.message.join(', ')
        : (corpo.message ?? texto);
    } catch {
      // resposta sem JSON: mantém a mensagem padrão
    }
    throw new Error(texto);
  }

  return res.json() as Promise<T>;
}

export const listarAlunos = (busca = '') =>
  requisicao<Aluno[]>(`/alunos?busca=${encodeURIComponent(busca)}`);

export const buscarAluno = (id: string) => requisicao<Aluno>(`/alunos/${id}`);

export const criarAluno = (dados: DadosAluno) =>
  requisicao<Aluno>('/alunos', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(dados),
  });

export const atualizarAluno = (id: string, dados: DadosAluno) =>
  requisicao<Aluno>(`/alunos/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(dados),
  });

export const excluirAluno = (id: string) =>
  requisicao<{ mensagem: string }>(`/alunos/${id}`, { method: 'DELETE' });