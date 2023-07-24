/// <reference types="Cypress" />

import { mount } from 'cypress/react18';
import AccountPage from '.';
import { Provider } from 'react-redux';
import { store } from '../../../store';

describe('Account.test.tsx', () => {
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <AccountPage />
      </Provider>
    );
  });
  it('contains page heading', () => {
    cy.get('h1.heading').contains('My Account');
  });
  // it('displays bar chart of revenue over time', () => {
  //   cy.get('.revchart');
  // });
});
