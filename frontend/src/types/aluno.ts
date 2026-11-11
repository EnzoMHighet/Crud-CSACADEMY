export type Aluno = {
  id: string;
  nome: string;
  email: string;
  telefone?: string | null;
  curso: string;
  ativo: boolean;
  criado_em: string;
};

export type DadosAluno = {
  nome: string;
  email: string;
  telefone: string;
  curso: string;
  ativo: boolean;
};