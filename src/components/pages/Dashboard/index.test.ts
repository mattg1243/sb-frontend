import { render, screen, cleanup } from "@testing-library/react";
import Dashboard from './index';

test('Renders', async () => {
  render(Dashboard());
  const dashboard = await screen.findByTestId('dashboard');
  expect(dashboard).toBeInTheDocument()
  cleanup();
})