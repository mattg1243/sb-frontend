/// <reference types="Cypress" />

import { Provider } from 'react-redux';
import UploadBeatModal from '.';
import { mount } from 'cypress/react18';
import { store } from '../../store';
import gatewayUrl from '../../config/routing';

describe('Button opens modal', () => {
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <UploadBeatModal />
      </Provider>
    );
  });
  it('opens', () => {
    window.localStorage.setItem('sb-user', JSON.stringify({ id: '2f4f569c-d3ec-4329-a7a9-e656028d3ed0' }));
    cy.intercept(`${gatewayUrl}/auth?user=2f4f569c-d3ec-4329-a7a9-e656028d3ed0`, { statusCode: 200 });
    cy.get('#open-modal-btn').click();
    cy.getBySel('modal');
  });
});

describe('Inputs populate correctly', () => {
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <UploadBeatModal />
      </Provider>
    );
    window.localStorage.setItem('sb-user', JSON.stringify({ id: '2f4f569c-d3ec-4329-a7a9-e656028d3ed0' }));
    cy.intercept(`${gatewayUrl}/auth?user=2f4f569c-d3ec-4329-a7a9-e656028d3ed0`, { statusCode: 200 });
    cy.get('#open-modal-btn').click();
  });
  it('title', () => {
    cy.getBySel('title-input').type('supa fire').should('have.value', 'supa fire');
  });
  it('genres', () => {
    // need to find a way to test this...
    cy.getBySel('genre-select').click();
  });
  it('bpm', () => {
    cy.getBySel('bpm-input').type('135').should('have.value', 135);
  });
  it('major / minor', () => {
    cy.getBySel('major').click().should('be.checked');
    cy.getBySel('minor').should('not.be.checked');

    cy.getBySel('minor').click().should('be.checked');
    cy.getBySel('major').should('not.be.checked');
  });
});
