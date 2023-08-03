/// <reference types="Cypress" />

import { mount } from 'cypress/react18';
import { MemoryRouter } from 'react-router-dom';
import MobileNav from '.';
import { Provider } from 'react-redux';
import { store } from '../../store';
import gatewayUrl from '../../config/routing';

const searchBarId = 'mobile-search-bar';
const searchBtnId = 'search-icon';

describe('MobileNav', () => {
  beforeEach(() => {
    cy.viewport(390, 840);
    <MobileNav />;
    mount(
      <MemoryRouter>
        <Provider store={store}>
          <MobileNav />
        </Provider>
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
  it('search bar', () => {
    // is hidden until user clicks on search button
    cy.getBySel('mobile-search-bar').should('have.css', 'visibility', 'hidden');
    cy.getBySel('search-icon').click();
    cy.getBySel('mobile-search-bar').should('have.css', 'visibility', 'visible');
    // goes away when close button is clicked
    cy.getBySel('mobile-search-bar-close').click();
    cy.getBySel('mobile-search-bar').should('have.css', 'visibility', 'hidden');
    // opens when user clicks search button and search bar is hidden
    cy.getBySel('search-icon').click();
    cy.getBySel('mobile-search-bar').should('have.css', 'visibility', 'visible');
    // goes away when user presses enter
    cy.getBySel('mobile-search-bar').click().type('{enter}');
    cy.getBySel('mobile-search-bar').should('have.css', 'visibility', 'hidden');
    // goes away when user presses search and search bar is visible
    cy.getBySel('search-icon').click();
    cy.getBySel('mobile-search-bar').should('have.css', 'visibility', 'visible');
    cy.getBySel('search-icon').click();
    cy.getBySel('mobile-search-bar').should('have.css', 'visibility', 'hidden');
  });
  describe('profile nav button', () => {
    it('highlighted properly', () => {
      // highlighted properly
      cy.getBySel('profile-icon').should('have.css', 'opacity', '0.5').click().should('have.css', 'opacity', '1');
      cy.getBySel('home-icon').should('have.css', 'opacity', '0.5');
      cy.getBySel('search-icon').should('have.css', 'opacity', '0.5');
    });
    it('contains profile nav and logout btns', () => {
      // contains profile page nav btn
      cy.intercept('GET', '/app/user/?id=*', { statusCode: 200 }).as('profileNavReq');
      cy.getBySel('profile-icon').click();
      cy.getBySel('mobile-logout-menu-opt');
      cy.getBySel('mobile-profile-menu-opt').click();
      cy.wait('@profileNavReq');
    });
  });
});
