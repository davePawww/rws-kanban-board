import App from '@/App';
import { render, screen } from '@testing-library/react';

describe('App', () => {
  it('renders the h1 - test', () => {
    render(<App />);

    expect(screen.getByText(/test/i)).toBeInTheDocument();
  });
});
