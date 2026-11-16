import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { UserSearch } from '../../components/patterns/02-custom-hooks/UserSearch';

const MOCK_USERS = [
  { id: 1, name: 'Leanne Graham', email: 'Sincere@april.biz' },
  { id: 2, name: 'Ervin Howell', email: 'Shanna@melissa.tv' },
];

describe('UserSearch & useUserSearch - Integration Flow', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('debounces user input and renders fetched users after 300ms', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_USERS,
    } as Response);

    render(<UserSearch />);

    const searchInput = screen.getByLabelText(/search directory/i);

    // 1. El usuario escribe rápido: NO debe disparar fetch inmediatamente
    fireEvent.change(searchInput, { target: { value: 'Lea' } });
    expect(fetch).not.toHaveBeenCalled();

    // 2. Avanzamos el reloj 299ms: sigue esperando el debounce
    await act(async () => {
      vi.advanceTimersByTime(299);
    });
    expect(fetch).not.toHaveBeenCalled();

    // 3. Completamos los 300ms: dispara fetch y resuelve la promesa
    await act(async () => {
      vi.advanceTimersByTime(1);
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('name_like=Lea'),
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );

    // 4. Verificamos que los resultados se renderizan en pantalla
    expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
    expect(screen.getByText('Sincere@april.biz')).toBeInTheDocument();
  });

  it('cancels previous in-flight request via AbortController when query changes', async () => {
    let capturedSignal: AbortSignal | undefined;

    vi.mocked(fetch).mockImplementation((_url, options) => {
      capturedSignal = options?.signal as AbortSignal;
      // Simulamos una petición lenta que nunca resuelve antes del siguiente cambio
      return new Promise(() => {});
    });

    render(<UserSearch />);
    const searchInput = screen.getByLabelText(/search directory/i);

    // Primera búsqueda
    fireEvent.change(searchInput, { target: { value: 'Leanne' } });
    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(capturedSignal?.aborted).toBe(false);

    // El usuario cambia la búsqueda antes de que responda la red
    fireEvent.change(searchInput, { target: { value: 'Leanne G' } });

    // El cleanup del efecto debe haber abortado la señal anterior inmediatamente
    expect(capturedSignal?.aborted).toBe(true);
  });

  it('displays an accessible alert message when the API fails', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
    } as Response);

    render(<UserSearch />);
    const searchInput = screen.getByLabelText(/search directory/i);

    fireEvent.change(searchInput, { target: { value: 'ErrorCase' } });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    const alertMessage = screen.getByRole('alert');
    expect(alertMessage).toHaveTextContent('Failed to fetch users');
  });

  it('immediately clears results without firing network calls when input is cleared', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_USERS,
    } as Response);

    render(<UserSearch />);
    const searchInput = screen.getByLabelText(/search directory/i);

    // Cargamos resultados iniciales
    fireEvent.change(searchInput, { target: { value: 'Leanne' } });
    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByText('Leanne Graham')).toBeInTheDocument();

    // Limpiamos el input: debe limpiar la UI en el mismo render sin esperar 300ms
    fireEvent.change(searchInput, { target: { value: '   ' } });
    expect(screen.queryByText('Leanne Graham')).not.toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});