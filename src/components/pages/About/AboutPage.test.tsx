/// <reference types="Cypress" />

import { mount } from 'cypress/react18';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import AboutPage from '.';

describe('AboutPage.cy.tsx', () => {
  beforeEach(() => {
    mount(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );
  });
  it('contains title', () => {
    cy.get('[data-cy="title"]').contains('About Us');
  });
  it('contains footer', () => {
    cy.get('[data-cy="footer"]').contains('Questions? info@orangemusicent.com');
  });
});
