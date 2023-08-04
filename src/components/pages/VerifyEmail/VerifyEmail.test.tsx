/// <reference types="Cypress" />

import { mount } from 'cypress/react18';
import VerifyEmail from '.';
import { MemoryRouter } from 'react-router-dom';
import gatewayUrl from '../../../config/routing';

describe('VerifyEmail', () => {
  beforeEach(() => {
    mount(
      <MemoryRouter>
        <VerifyEmail />
      </MemoryRouter>
    );
  });
  it('instructs user to verify email', () => {
    cy.getBySel('verify-email-instruct').contains('Click the link in your email to verify your account');
  });
  it('resends email', () => {
    cy.intercept('GET', `${gatewayUrl}/user/resend-verification-email?user=*`, { statusCode: 200 }).as(
      'resendEmailReq'
    );
    cy.getBySel('resend-email-btn').click();
    cy.wait('@resendEmailReq');
  });
  it('contains spam folder warning', () => {
    cy.getBySel('verify-email-cont').contains('spam folder');
  });
  it('manual redirect link', () => {
    cy.intercept('GET', '/login', { statusCode: 200 }).as('loginRedir');
    cy.getBySel('verify-email-login-link').should('have.attr', 'href', '/login').click();
    cy.wait('@loginRedir');
  });
});
