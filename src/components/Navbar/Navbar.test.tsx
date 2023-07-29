/// <reference types="Cypress" />

import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Navbar from '.';
import { mount } from 'cypress/react18';
import { store } from '../../store';

describe('Navbar.test.tsx', () => {
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>
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
