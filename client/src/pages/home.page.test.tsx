import Home from '@/pages/home.page';
import { render, screen } from '@testing-library/react';

describe('Home', () => {
  it('displays the Home text in the home page', () => {
    render(<Home />);
    expect(screen.getByText(/home/i)).toBeInTheDocument();
  });
});
