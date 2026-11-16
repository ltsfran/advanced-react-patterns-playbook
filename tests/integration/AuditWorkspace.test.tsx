import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { revalidatePath } from 'next/cache';
import { ClientAuditWorkspace } from '../../components/patterns/03-server-client/ClientAuditWorkspace';
import { ServerAuditLogs } from '../../components/patterns/03-server-client/ServerAuditLogs';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Server vs. Client Components (Donut Pattern & Server Actions) - Integration Flow', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders server-fetched logs inside the interactive client wrapper without losing server content', async () => {
    const serverLogs = await ServerAuditLogs();

    render(<ClientAuditWorkspace>{serverLogs}</ClientAuditWorkspace>);

    // Verifica que el contenido del Server Component se renderiza dentro del slot children
    expect(screen.getByText(/Initial RSC boundary established/i)).toBeInTheDocument();

    // Verifica que la interactividad del Client Wrapper funciona sin desmontar la lógica previa
    const toggleButton = screen.getByRole('button', { name: /ocultar panel/i });
    fireEvent.click(toggleButton);

    expect(screen.queryByText(/Initial RSC boundary established/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mostrar panel/i })).toBeInTheDocument();
  });

  it('displays server-side validation errors via useActionState when input is too short', async () => {
    const serverLogs = await ServerAuditLogs();
    render(<ClientAuditWorkspace>{serverLogs}</ClientAuditWorkspace>);

    const input = screen.getByLabelText(/nueva nota de auditoría/i);
    const submitButton = screen.getByRole('button', { name: /registrar/i });

    fireEvent.change(input, { target: { value: 'abc' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(/debe tener al menos 5 caracteres/i);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it('handles pending state during mutation and calls revalidatePath on valid submission', async () => {
    const serverLogs = await ServerAuditLogs();
    render(<ClientAuditWorkspace>{serverLogs}</ClientAuditWorkspace>);

    const input = screen.getByLabelText(/nueva nota de auditoría/i);
    const submitButton = screen.getByRole('button', { name: /registrar/i });

    fireEvent.change(input, { target: { value: 'Adopted Donut Pattern for RSC boundaries' } });

    // Disparar el envío sin avanzar aún los 400ms simulados del servidor
    act(() => {
      fireEvent.click(submitButton);
    });

    expect(screen.getByRole('button', { name: /guardando/i })).toBeDisabled();

    // Avanzamos el reloj para completar la mutación en el servidor
    await act(async () => {
      vi.advanceTimersByTime(400);
    });

    expect(revalidatePath).toHaveBeenCalledWith('/');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrar/i })).toBeEnabled();
  });
});