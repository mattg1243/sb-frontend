/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// -- Custom commands --
Cypress.Commands.add('getBySel', (selector) => {
  return cy.get(`[data-cy=${selector}]`);
});

Cypress.Commands.add('multiSelect', (selector, text) => {
  cy.get(`.ant-select${selector} > .ant-select-selector > .ant-select-selection-overflow`).click();
  cy.get(`.ant-select${selector} .ant-select-selection-search input`).clear();
  cy.get(`.ant-select${selector} .ant-select-selection-search input`)
    .invoke('attr', 'id')
    .then((selElm) => {
      const dropDownSelector = `#${selElm}_list`;
      cy.get(`.ant-select${selector} .ant-select-selection-search input`).type(`${text}`);
      cy.get(dropDownSelector).next().find('.ant-select-item-option-content').click();
    });
});
