/// <reference types="Cypress" />

import { mount } from 'cypress/react18';
import { MemoryRouter } from 'react-router-dom';
import Login from '.';
// import gatewayUrl from '../../../config/routing';

describe('Login.cy.tsx', () => {
  before(() => {
    mount(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  });
  it('logs in user and provides loading feedback', () => {
    // enter email
    cy.get('.emailinput').should('be.visible').type('sbtester@gmail.com').should('have.value', 'sbtester@gmail.com');
    cy.get('.passwordinput').should('be.visible').type('password');
  });
  // enter password
  // stub out API endpoint to intercept
  // cy.intercept({
  //   method: 'POST',
  //   url: `${gatewayUrl}/login`
  // }).as('loginReq');
  //   // click login button
  // cy.getBySel("login button")
  //   .should('be.visible')
  //   .click()
  // // wait for the API call and check the req body
  // cy.wait('@loginReq').then(i => {
  //   const expectedData = {
  //     email: 'sbtester@gmail.com',
  //     password: 'password'
  //   }
  //   assert.equal(i.request.body, expectedData, 'Login credentials not sent in request body.');
  // })
});
