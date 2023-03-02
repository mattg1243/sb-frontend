/// <reference types="Cypress" />

import { MemoryRouter } from 'react-router-dom';
import Navbar from '.';
import { mount } from 'cypress/react18';

describe('Navbar.test.tsx', () => {
  beforeEach(() => {
    mount(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
  });
  it('links to dash', () => {
    // need to verify there is an onClick fn that navigates to page
    cy.get('.dashNav').click();
  });
  it('upload beat modal', () => {
    cy.get('.uploadModal');
  });
  it('link to account page', () => {
    cy.get('.accountNav');
  });
  it('user avatar', () => {
    cy.get('.avatar');
  });
});
