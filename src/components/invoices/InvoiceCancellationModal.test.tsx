import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { InvoiceCancellationModal } from './InvoiceCancellationModal';

describe('InvoiceCancellationModal', () => {
  it('renders modal when open is true', () => {
    render(
      <InvoiceCancellationModal
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
      />
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Cancel Invoice')).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure you want to cancel this invoice? This cannot be undone.')
    ).toBeInTheDocument();
  });

  it('does not render modal when open is false', () => {
    render(
      <InvoiceCancellationModal
        open={false}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
      />
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    const handleConfirm = vi.fn();
    const handleOpenChange = vi.fn();

    render(
      <InvoiceCancellationModal
        open={true}
        onOpenChange={handleOpenChange}
        onConfirm={handleConfirm}
      />
    );

    const confirmButton = screen.getByRole('button', { name: /confirm cancellation/i });
    fireEvent.click(confirmButton);

    expect(handleConfirm).toHaveBeenCalledTimes(1);
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it('calls onOpenChange with false when cancel button is clicked', () => {
    const handleOpenChange = vi.fn();

    render(
      <InvoiceCancellationModal
        open={true}
        onOpenChange={handleOpenChange}
        onConfirm={vi.fn()}
      />
    );

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelButton);

    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it('calls onOpenChange with false when Escape key is pressed', () => {
    const handleOpenChange = vi.fn();

    render(
      <InvoiceCancellationModal
        open={true}
        onOpenChange={handleOpenChange}
        onConfirm={vi.fn()}
      />
    );

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape', code: 'Escape' });
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });
});
