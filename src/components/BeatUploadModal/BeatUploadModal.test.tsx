/// <reference types="Cypress" />

import UploadBeatModal from '.';
import { mount } from 'cypress/react18';

describe('Button opens modal', () => {
  beforeEach(() => {
    mount(<UploadBeatModal />);
  });
  it('opens', () => {
    cy.get('#open-modal-btn').click();
    cy.getBySel('modal');
  });
});

describe('Inputs populate correctly', () => {
  beforeEach(() => {
    mount(<UploadBeatModal />);
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
  it('flat / sharp', () => {
    // make sure all combinations result in only one value being checked
    cy.getBySel('flat').click().should('be.checked');
    cy.getBySel('sharp').should('not.be.checked');
    cy.getBySel('regular').should('not.be.checked');

    cy.getBySel('sharp').click().should('be.checked');
    cy.getBySel('flat').should('not.be.checked');
    cy.getBySel('regular').should('not.be.checked');

    cy.getBySel('regular').click().should('be.checked');
    cy.getBySel('sharp').should('not.be.checked');
    cy.getBySel('flat').should('not.be.checked');
  });
  it('major / minor', () => {
    cy.getBySel('major').click().should('be.checked');
    cy.getBySel('minor').should('not.be.checked');

    cy.getBySel('minor').click().should('be.checked');
    cy.getBySel('major').should('not.be.checked');
  });
});
