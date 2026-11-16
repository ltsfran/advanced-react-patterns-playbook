import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Modal, ModalOpen, ModalWindow } from '../../components/patterns/01-compound-components/Modal';

describe('Modal Compound Component - Integration Flow', () => {
  it('opens the matching window on trigger click and closes via the close button', () => {
    render(
      <Modal>
        <ModalOpen windowName="terms">Open Terms</ModalOpen>
        <ModalWindow name="terms">
          <p>Terms and Conditions Content</p>
        </ModalWindow>
      </Modal>
    );

    expect(screen.queryByText('Terms and Conditions Content')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /open terms/i }));
    expect(screen.getByText('Terms and Conditions Content')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /close modal/i }));
    expect(screen.queryByText('Terms and Conditions Content')).not.toBeInTheDocument();
  });

  it('isolates multiple modal windows so only the active one renders', () => {
    render(
      <Modal>
        <ModalOpen windowName="terms">Open Terms</ModalOpen>
        <ModalOpen windowName="privacy">Open Privacy</ModalOpen>

        <ModalWindow name="terms">
          <p>Terms Content</p>
        </ModalWindow>
        <ModalWindow name="privacy">
          <p>Privacy Policy Content</p>
        </ModalWindow>
      </Modal>
    );

    fireEvent.click(screen.getByRole('button', { name: /open privacy/i }));

    expect(screen.getByText('Privacy Policy Content')).toBeInTheDocument();
    expect(screen.queryByText('Terms Content')).not.toBeInTheDocument();
  });

  it('preserves custom onClick handlers passed to ModalOpen', () => {
    const handleCustomClick = vi.fn();

    render(
      <Modal>
        <ModalOpen windowName="terms" onClick={handleCustomClick}>
          Open Terms
        </ModalOpen>
        <ModalWindow name="terms">
          <p>Terms Content</p>
        </ModalWindow>
      </Modal>
    );

    fireEvent.click(screen.getByRole('button', { name: /open terms/i }));

    expect(handleCustomClick).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Terms Content')).toBeInTheDocument();
  });
});