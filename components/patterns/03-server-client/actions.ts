'use server';

import { revalidatePath } from 'next/cache';

export interface AuditNote {
  id: string;
  author: string;
  note: string;
  timestamp: string;
}

export interface ActionState {
  error: string | null;
  success: boolean;
}

// Simulación de almacenamiento en servidor (en producción sería Prisma / PostgreSQL)
const serverAuditStore: AuditNote[] = [
  {
    id: 'init-1',
    author: 'System Architect',
    note: 'Initial RSC boundary established. Zero client bundle overhead for read-only logs.',
    timestamp: '2026-11-16 09:00 UTC',
  },
];

export async function getServerAuditNotes(): Promise<AuditNote[]> {
  // Simulamos una consulta rápida de lectura en el servidor
  return [...serverAuditStore];
}

export async function addAuditNoteAction(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const rawNote = formData.get('note');
  const note = typeof rawNote === 'string' ? rawNote.trim() : '';

  // Validación estricta en el servidor (nunca confiar solo en el cliente)
  if (note.length < 5) {
    return {
      error: 'La nota de auditoría debe tener al menos 5 caracteres.',
      success: false,
    };
  }

  // Simulamos latencia de escritura en base de datos (400ms)
  await new Promise((resolve) => setTimeout(resolve, 400));

  serverAuditStore.unshift({
    id: crypto.randomUUID(),
    author: 'Tech Lead',
    note,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
  });

  // Revalida la caché de Next.js para que el Server Component se actualice solo
  revalidatePath('/');

  return {
    error: null,
    success: true,
  };
}