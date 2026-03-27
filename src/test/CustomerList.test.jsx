import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CustomerList from '../pages/customers/CustomerList';
import { DataProvider } from '../context/DataContext';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderWithRouter() {
  return render(
    <MemoryRouter>
      <DataProvider>
        <CustomerList />
      </DataProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  localStorage.clear();
  mockNavigate.mockClear();
});

describe('CustomerList', () => {
  it('renders empty state when no customers', () => {
    renderWithRouter();
    expect(screen.getByText('No customers yet')).toBeInTheDocument();
  });

  it('renders page title', () => {
    renderWithRouter();
    // When empty, shows "Customers" heading
    expect(screen.getByRole('heading', { name: 'Customers' })).toBeInTheDocument();
  });

  it('shows add customer button in empty state', () => {
    renderWithRouter();
    // Empty state has "Add your first customer" button
    expect(screen.getByRole('button', { name: /Add your first customer/i })).toBeInTheDocument();
  });
});
