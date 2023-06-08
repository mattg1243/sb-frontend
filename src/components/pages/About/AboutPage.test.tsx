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
  it('contains link to change log', () => {
    cy.getBySel('changelog-link').should(
      'have.attr',
      'href',
      'https://intriguing-pantry-2a7.notion.site/Sweatshop-Beats-Change-Logs-8ddd377bd31e41908536cea6761ab622?pvs=4'
    );
  });
  it('contains footer', () => {
    cy.get('[data-cy="footer"]').contains('Questions? info@orangemusicent.com');
  });
});
