import { render, screen } from '@testing-library/react';

import { App } from './App';

describe('App Test', () => {
  it('should test basic', () => {
    render(<App />);
    const message = screen.queryByText(/My Technical Notes/!);
    expect(message).toBeVisible();
  });
});
