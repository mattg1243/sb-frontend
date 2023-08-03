/// <reference types="Cypress" />

import { mount } from 'cypress/react18';
import { MemoryRouter } from 'react-router-dom';
import MobileNav from '.';

describe('MobileNav', () => {
  beforeEach(() => {
    mount(
      <MemoryRouter>
        <MobileNav />
      </MemoryRouter>
    );
  });
  it('home nav button', () => {
    cy.getBySel('home-icon').should('have.css', 'opacity', '1');
    cy.getBySel('search-icon').should('have.css', 'opacity', '0.5');
    cy.getBySel('profile-icon').should('have.css', 'opacity', '0.5');
  });
  it('search button', () => {
    cy.getBySel('search-icon').should('have.css', 'opacity', '0.5').click().should('have.css', 'opacity', '1');
    cy.getBySel('home-icon').should('have.css', 'opacity', '0.5');
    cy.getBySel('profile-icon').should('have.css', 'opacity', '0.5');
  });
  it('profile nav button', () => {
    cy.getBySel('profile-icon').should('have.css', 'opacity', '0.5').click().should('have.css', 'opacity', '1');
    cy.getBySel('home-icon').should('have.css', 'opacity', '0.5');
    cy.getBySel('search-icon').should('have.css', 'opacity', '0.5');
  });
});
