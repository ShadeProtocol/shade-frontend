import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProfileDetailsForm } from './ProfileDetailsForm';
import { mockMerchantProfile } from '@/mocks/merchantProfile';

describe('ProfileDetailsForm', () => {
  it('renders initial data correctly', () => {
    render(
      <ProfileDetailsForm
        initialData={mockMerchantProfile}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByLabelText('Business Name')).toHaveValue('Acme Corp');
    expect(screen.getByLabelText('Category')).toHaveValue('Software Services');
    expect(screen.getByLabelText('Description')).toHaveValue('Leading provider of excellent software solutions.');
  });

  it('updates input values when changed', () => {
    render(
      <ProfileDetailsForm
        initialData={mockMerchantProfile}
        onSubmit={vi.fn()}
      />
    );

    const businessNameInput = screen.getByLabelText('Business Name');
    fireEvent.change(businessNameInput, { target: { value: 'Globex Inc' } });

    expect(businessNameInput).toHaveValue('Globex Inc');
  });

  it('fires onSubmit with updated values when submitted', async () => {
    const handleSubmit = vi.fn();

    render(
      <ProfileDetailsForm
        initialData={mockMerchantProfile}
        onSubmit={handleSubmit}
      />
    );

    const categoryInput = screen.getByLabelText('Category');
    fireEvent.change(categoryInput, { target: { value: 'Hardware' } });

    const submitButton = screen.getByRole('button', { name: 'Save Changes' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        ...mockMerchantProfile,
        category: 'Hardware',
      });
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });

  it('shows loading state while submitting', async () => {
    let resolveSubmit: () => void;
    const handleSubmit = vi.fn(() => new Promise<void>((resolve) => {
      resolveSubmit = resolve;
    }));

    render(
      <ProfileDetailsForm
        initialData={mockMerchantProfile}
        onSubmit={handleSubmit}
      />
    );

    const submitButton = screen.getByRole('button', { name: 'Save Changes' });
    fireEvent.click(submitButton);

    expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled();

    // @ts-ignore - resolveSubmit is assigned synchronously in the mock
    resolveSubmit();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Save Changes' })).not.toBeDisabled();
    });
  });
});
