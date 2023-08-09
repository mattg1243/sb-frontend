import CustomAlert from '.';
import { mount } from 'cypress/react18';

describe('CustomAlert.cy.tsx', () => {
  beforeEach(() => {
    mount(<CustomAlert status="success" message="Component does mount" />);
  });
  it('displays correct message', () => {
    cy.getBySel('custom-alert').contains('Component does mount');
  });
});
