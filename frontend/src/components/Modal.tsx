import { ReactNode } from 'react';

type Props = { titulo: string; onFechar: () => void; children: ReactNode };

export default function Modal({ titulo, onFechar, children }: Props) {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 text-gray-900 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{titulo}</h2>
          <button
            onClick={onFechar}
            aria-label="Fechar"
            className="text-gray-500 hover:text-gray-900"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}