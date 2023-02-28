/// <reference types="Cypress" />

import { mount } from 'cypress/react18';
import BaseLayout from '.';
// import gatewayUrl from '../../../config/routing';

describe('BaseLayout.test.tsx', () => {
  before(() => {
    mount(<BaseLayout />);
  });
  it('contains AntD Layout, custom Navbar, and AntD Content components', () => {
    cy.getBySel('layout');
    cy.getBySel('navbar');
    cy.getBySel('content');
  });
  it('contains React Router Outlet component for router', () => {
    cy.getBySel('outlet');
  });
});
