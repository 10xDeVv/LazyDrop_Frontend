import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Toast from '@/components/Toast';

describe('Toast Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render toast message', () => {
    render(
      <Toast
        message="Test message"
        type="info"
        onClose={() => {}}
      />
    );

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should render with correct type class', () => {
    const { container } = render(
      <Toast
        message="Error message"
        type="error"
        onClose={() => {}}
      />
    );

    const toast = container.querySelector('[class*="error"]');
    expect(toast).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Toast
        message="Test message"
        type="success"
        onClose={onClose}
      />
    );

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('should auto-close after timeout', async () => {
    const onClose = vi.fn();
    render(
      <Toast
        message="Test message"
        type="info"
        autoClose={true}
        timeout={1000}
        onClose={onClose}
      />
    );

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    }, { timeout: 2000 });
  });

  it('should display different toast types', () => {
    const types = ['success', 'error', 'warning', 'info'];

    types.forEach(type => {
      const { unmount } = render(
        <Toast
          message={`${type} message`}
          type={type}
          onClose={() => {}}
        />
      );

      expect(screen.getByText(`${type} message`)).toBeInTheDocument();
      unmount();
    });
  });
});
