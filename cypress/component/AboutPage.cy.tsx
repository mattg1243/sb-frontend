/// <reference types="Cypress" />

import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import AboutPage from "../../src/components/pages/About";

describe('AboutPage.cy.tsx', () => {
  beforeEach(() => {
    cy.mount(
      <MemoryRouter><AboutPage /></MemoryRouter>
    )
  })
  it('contains title', () => {
    cy.get('[data-cy="title"]').contains("About Us")
  })
})