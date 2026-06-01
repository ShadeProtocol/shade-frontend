import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { PaymentMethodTabs } from './PaymentMethodTabs';

describe('PaymentMethodTabs', () => {
  const walletContent = <div data-testid="wallet-content">Wallet Content</div>;
  const manualContent = <div data-testid="manual-content">Manual Content</div>;

  it('renders default tab (wallet)', () => {
    render(
      <PaymentMethodTabs
        walletContent={walletContent}
        manualTransferContent={manualContent}
      />
    );

    expect(screen.getByRole('tab', { name: 'Connect Wallet' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Manual Transfer' })).toBeInTheDocument();

    expect(screen.getByTestId('wallet-content')).toBeInTheDocument();
    expect(screen.queryByTestId('manual-content')).not.toBeInTheDocument();
  });

  it('switches to manual transfer tab', async () => {
    const user = userEvent.setup();
    render(
      <PaymentMethodTabs
        walletContent={walletContent}
        manualTransferContent={manualContent}
      />
    );

    const manualTab = screen.getByRole('tab', { name: 'Manual Transfer' });
    await user.click(manualTab);

    await waitFor(() => {
      expect(screen.getByTestId('manual-content')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('wallet-content')).not.toBeInTheDocument();
  });

  it('switches back to wallet tab', async () => {
    const user = userEvent.setup();
    render(
      <PaymentMethodTabs
        walletContent={walletContent}
        manualTransferContent={manualContent}
      />
    );

    const manualTab = screen.getByRole('tab', { name: 'Manual Transfer' });
    const walletTab = screen.getByRole('tab', { name: 'Connect Wallet' });

    // Switch to manual
    await user.click(manualTab);
    await waitFor(() => {
      expect(screen.getByTestId('manual-content')).toBeInTheDocument();
    });

    // Switch back to wallet
    await user.click(walletTab);
    await waitFor(() => {
      expect(screen.getByTestId('wallet-content')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('manual-content')).not.toBeInTheDocument();
  });
});
