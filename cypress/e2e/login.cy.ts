/// <reference types="Cypress" />
// this spec file tests a basic user login flow

const GATEWAY_URL = 'http://localhost:8000';

describe('User can reach login page from the splash page', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it('Renders splash page at the base route', () => {
    cy.get('#splash-page');
  });
  it('Redirects user to login page when login button is clicked', () => {
    cy.get('#login-btn').click({ force: true });
    cy.url().should('include', '/login');
  });
});

describe('Logs in users properly', () => {
  it('Sends a valid POST request to the server when credentials are submitted and redirects to dash', () => {
    // stub server response
    cy.intercept('POST', GATEWAY_URL + '/login', { fixture: 'userLoginRes.json' }).as('loginUserReq');

    cy.visit('/login');
    cy.get('#email-input').type('sbtester@gmail.com', { force: true }).and('have.value', 'sbtester@gmail.com');
    cy.get('#password-input').type('password', { force: true }).and('have.value', 'password');
    cy.get('#login-btn').click({ force: true });
    cy.wait('@loginUserReq').its('request.body').should('have.all.key', 'email', 'password');
    cy.url().should('include', '/app/dash');
  });
});

describe('Handles invalid credentials properly', () => {
  it('Displays error message when invalid credentials are entered and does not redirect', () => {
    // stub server response
    cy.intercept('POST', GATEWAY_URL + '/login', {
      statusCode: 401,
      body: {
        message: 'intercepted login req',
      },
    }).as('badUserLoginReq');

    cy.visit('/login');
    cy.get('#email-input').type('aslkduichilour@gmail.com', { force: true });
    cy.get('#password-input').type('asdlkf', { force: true });
    cy.get('#login-btn').click({ force: true });
    cy.wait('@badUserLoginReq').then(() => {
      cy.getBySel('custom-alert');
    });
    cy.url().should('include', '/login');
  });
});
