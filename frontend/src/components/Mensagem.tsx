type Props = { tipo: 'sucesso' | 'erro'; texto: string };

export default function Mensagem({ tipo, texto }: Props) {
  const cores =
    tipo === 'sucesso'
      ? 'border-green-300 bg-green-100 text-green-800'
      : 'border-red-300 bg-red-100 text-red-800';

  return (
    <div role="alert" className={`mb-4 rounded border p-3 ${cores}`}>
      {texto}
    </div>
  );
}