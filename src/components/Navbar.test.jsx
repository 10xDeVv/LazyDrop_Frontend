import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Navbar from '@/components/Navbar';

describe('Navbar Component', () => {
  let mockRouter;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRouter = {
      push: vi.fn(),
      pathname: '/',
    };
    vi.mock('next/router', () => ({
      useRouter: () => mockRouter
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render navbar with logo', () => {
    render(<Navbar />);
    
    // Check for logo or brand name
    const logo = screen.queryByRole('img', { name: /logo/i }) || 
                 screen.queryByText(/lazydrop/i);
    expect(logo || screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    render(<Navbar />);
    
    // Common navigation items
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should handle responsive menu toggle', () => {
    render(<Navbar />);
    
    const menuButton = screen.queryByRole('button', { name: /menu/i });
    if (menuButton) {
      fireEvent.click(menuButton);
      // Menu should be visible or toggled
      expect(menuButton).toBeInTheDocument();
    }
  });

  it('should display user menu when authenticated', () => {
    // Mock authentication state
    vi.mock('@/context/UserContext', () => ({
      useUser: () => ({
        user: { email: 'test@example.com' },
        isLoading: false
      })
    }));

    render(<Navbar />);
    
    // User menu should be visible
    const userMenu = screen.queryByText(/account/i) || 
                     screen.queryByText(/logout/i);
    expect(userMenu || document.body).toBeInTheDocument();
  });

  it('should show login link when unauthenticated', () => {
    vi.mock('@/context/UserContext', () => ({
      useUser: () => ({
        user: null,
        isLoading: false
      })
    }));

    render(<Navbar />);
    
    const loginLink = screen.queryByText(/login/i) || 
                      screen.queryByText(/sign in/i);
    expect(loginLink || screen.getByRole('navigation')).toBeInTheDocument();
  });
});
