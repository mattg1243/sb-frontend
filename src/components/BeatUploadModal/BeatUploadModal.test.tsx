/// <reference types="Cypress" />

import { Provider } from 'react-redux';
import UploadBeatModal from '.';
import { mount } from 'cypress/react18';
import { store } from '../../store';
import { MemoryRouter } from 'react-router-dom';

describe('Button opens modal', () => {
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <UploadBeatModal />
      </Provider>
    );
  });
  it('opens', () => {
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
