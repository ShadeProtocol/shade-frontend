import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { InvoiceRowActions } from './InvoiceRowActions';

describe('InvoiceRowActions', () => {
  const mockInvoiceId = 'inv_123';

  it('renders the dropdown trigger button', () => {
    render(
      <InvoiceRowActions
        invoiceId={mockInvoiceId}
        onViewDetails={vi.fn()}
        onCopyPaymentLink={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /invoice actions/i })).toBeInTheDocument();
  });

  it('opens dropdown and fires callbacks on click', async () => {
    const user = userEvent.setup();
    const handleViewDetails = vi.fn();
    const handleCopyLink = vi.fn();

    render(
      <InvoiceRowActions
        invoiceId={mockInvoiceId}
        onViewDetails={handleViewDetails}
        onCopyPaymentLink={handleCopyLink}
      />
    );

    const triggerButton = screen.getByRole('button', { name: /invoice actions/i });
    
    // Open dropdown
    await user.click(triggerButton);
    
    const viewDetailsOption = await screen.findByText('View Details');
    const copyLinkOption = await screen.findByText('Copy Payment Link');
    
    expect(viewDetailsOption).toBeInTheDocument();
    expect(copyLinkOption).toBeInTheDocument();

    // Click view details
    await user.click(viewDetailsOption);
    expect(handleViewDetails).toHaveBeenCalledWith(mockInvoiceId);
    expect(handleViewDetails).toHaveBeenCalledTimes(1);

    // Click copy link (re-open first)
    await user.click(triggerButton);
    const copyLinkOption2 = await screen.findByText('Copy Payment Link');
    await user.click(copyLinkOption2);
    expect(handleCopyLink).toHaveBeenCalledWith(mockInvoiceId);
    expect(handleCopyLink).toHaveBeenCalledTimes(1);
  });
});
