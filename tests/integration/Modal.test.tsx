import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Modal } from '../../components/patterns/01-compound-components/Modal';

describe('Modal Compound Component - Integration Flow', () => {
  it('opens the modal window on trigger click and closes it on close button click', () => {
    const customClickSpy = vi.fn();

    render(
      <Modal>
        <Modal.Open windowName="confirm-delete">
          <button type="button" onClick={customClickSpy}>
            Delete Item
          </button>
        </Modal.Open>

        <Modal.Window name="confirm-delete">
          <h2>Confirm Deletion</h2>
          <p>Are you sure you want to delete this record?</p>
        </Modal.Window>
      </Modal>
    );

    // 1. Estado inicial: El contenido del modal NO debe estar en el documento
    expect(screen.queryByText('Confirm Deletion')).not.toBeInTheDocument();

    // 2. Interacción del usuario: Clic en el botón gatillador
    const triggerButton = screen.getByRole('button', { name: /delete item/i });
    fireEvent.click(triggerButton);

    // 3. Verificación: Se ejecutó el onClick original y se abrió la ventana correcta
    expect(customClickSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this record?')).toBeInTheDocument();

    // 4. Interacción de cierre: Clic en el botón con aria-label="Close modal"
    const closeButton = screen.getByRole('button', { name: /close modal/i });
    fireEvent.click(closeButton);

    // 5. Verificación final: El modal desaparece del DOM
    expect(screen.queryByText('Confirm Deletion')).not.toBeInTheDocument();
  });

  it('throws an error when sub-components are rendered outside the Modal provider', () => {
    // Silenciamos el console.error esperado de React para mantener limpia la salida del test
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() =>
      render(
        <Modal.Window name="orphan-modal">
          <p>Orphan content</p>
        </Modal.Window>
      )
    ).toThrow('Window must be used within a Modal');

    consoleErrorSpy.mockRestore();
  });
});