/// <reference types="Cypress" />

import { mount } from 'cypress/react18';
import AccountPage from '.';

describe('Account.test.tsx', () => {
  beforeEach('mounts', () => {
    mount(<AccountPage />);
  });
  it('contains page heading', () => {
    cy.get('h1.heading').contains('My Account');
  });
  it('displays bar chart of revenue over time', () => {
    cy.get('.revchart');
  });
});
