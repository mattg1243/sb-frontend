/// <reference types="Cypress" />

import { mount } from 'cypress/react18';
import BeatEditModal from '.';
import { testBeat } from '../../testFixtures/testBeat';

describe('BeatEditModal.test.tsx', () => {
  beforeEach(() => {
    mount(<BeatEditModal beat={testBeat} />);
    cy.get('[data-cy="edit button"]').click();
  });
  it('contains title in correct input field', () => {
    cy.get('[data-cy="title input"]').should('have.value', 'Thriller');
  });
  it('contains description in the correct input field', () => {
    cy.get('[data-cy="description input"]').should('have.value', 'Hot ass beat clap');
  });
  it('displays tempo', () => {
    cy.get('[data-cy="tempo"]').should('be.visible');
  });
  it('spins while loading', () => {
    console.log('loading...');
  });
});
