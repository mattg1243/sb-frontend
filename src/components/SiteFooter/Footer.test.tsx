/// <reference types="Cypress" />
import { mount } from 'cypress/react18';
import SiteFooter from '.';

describe('SiteFooter', () => {
  beforeEach(() => {
    mount(<SiteFooter />);
  });
  it('has copyright notice', () => {
    cy.get('#copyright-notice').contains('Copyright').and('contain.text', 'Orange Music Entertainment');
  });
  it('has link to about page', () => {
    cy.get('#about-link').contains('About').should('have.attr', 'href', '/app/about');
  });
  it('has link to contact / support page', () => {
    cy.get('#contact-link').contains('Contact').should('have.attr', 'href', '/contact');
  });
  it('has link to privacy policy document', () => {
    cy.get('#privacy-policy-link').contains('Privacy Policy').should('have.attr', 'href', '/PRIVACYPOLICY.html');
  });
  it('has link to terms and conditions document', () => {
    cy.get('#terms-link').contains('Terms & Conditions').should('have.attr', 'href', '/TERMSANDCONDITIONS.html');
  });
});
