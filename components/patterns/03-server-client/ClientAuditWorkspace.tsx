'use client';

import { useState, useActionState, ReactNode } from 'react';
import { addAuditNoteAction } from './actions';

export function ClientAuditWorkspace({ children }: Readonly<{ children: ReactNode }>) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [state, formAction, isPending] = useActionState(addAuditNoteAction, null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">
          Client Boundary • Interactive
        </span>
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          {isExpanded ? 'Ocultar panel' : 'Mostrar panel'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-2">
          <form action={formAction} className="flex gap-2">
            <input
              type="text"
              name="note"
              aria-label="Nueva nota de auditoría"
              placeholder="Escribe una decisión arquitectónica..."
              disabled={isPending}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={isPending}
              className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition"
            >
              {isPending ? 'Guardando...' : 'Registrar'}
            </button>
          </form>

          {state?.error && (
            <p role="alert" className="text-sm text-red-600">
              {state.error}
            </p>
          )}

          {/* Slot del Donut Pattern: aquí se inserta el Server Component sin perder su naturaleza */}
          <div className="pt-2">{children}</div>
        </div>
      )}
    </div>
  );
}