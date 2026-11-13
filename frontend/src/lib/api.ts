import { Aluno, DadosAluno } from '@/types/aluno';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';


async function chamarApi(caminho: string, opcoes?: RequestInit) {
  let resposta: Response;

  try {
    resposta = await fetch(`${API}${caminho}`, opcoes);
  } catch {
    throw new Error('Não foi possível conectar à API. Ela está ligada?');
  }


  if (!resposta.ok) {
    let mensagem = 'Erro inesperado. Tente novamente.';
    try {
      const corpo = await resposta.json();
      
      if (Array.isArray(corpo.message)) {
        mensagem = corpo.message.join(', ');
      } else if (corpo.message) {
        mensagem = corpo.message;
      }
    } catch {
      
    }
    throw new Error(mensagem);
  }

  return resposta;
}

export async function listarAlunos(busca = ''): Promise<Aluno[]> {
  const resposta = await chamarApi(`/alunos?busca=${encodeURIComponent(busca)}`);
  return resposta.json();
}

export async function buscarAluno(id: string): Promise<Aluno> {
  const resposta = await chamarApi(`/alunos/${id}`);
  return resposta.json();
}

export async function criarAluno(dados: DadosAluno): Promise<Aluno> {
  const resposta = await chamarApi('/alunos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  return resposta.json();
}

export async function atualizarAluno(
  id: string,
  dados: DadosAluno,
): Promise<Aluno> {
  const resposta = await chamarApi(`/alunos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  return resposta.json();
}

export async function excluirAluno(id: string) {
  const resposta = await chamarApi(`/alunos/${id}`, { method: 'DELETE' });
  return resposta.json();
}