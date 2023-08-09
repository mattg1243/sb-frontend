/// <reference types="Cypress" />

import { mount } from 'cypress/react18';
import BeatEditModal from '.';
import { testBeat } from '../../testFixtures/testBeat';
import gatewayUrl from '../../config/routing';

describe('BeatEditModal.test.tsx', () => {
  beforeEach(() => {
    mount(<BeatEditModal beat={testBeat} />);
    window.localStorage.setItem('sb-user', JSON.stringify({ id: '2f4f569c-d3ec-4329-a7a9-e656028d3ed0' }));
    cy.intercept(`${gatewayUrl}/auth?user=2f4f569c-d3ec-4329-a7a9-e656028d3ed0`, { statusCode: 200 });
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
