/// <reference types="Cypress" />
import { mount } from 'cypress/react18';
import RecAlgoMenu from '.';
import { RecAlgos } from './index';
import { useState } from 'react';

// create mock parent component with RecAlgoMenu mounted
function MockParent() {
  const [currentAlgo, setCurrentAlgo] = useState<RecAlgos>('Recommended');
  return <RecAlgoMenu currentAlgo={currentAlgo} setCurrentAlgo={setCurrentAlgo} />;
}
describe('RecAlgoMenu', () => {
  beforeEach(() => {
    mount(<MockParent />);
  });
  it('Displays the correct algorithm.', () => {
    cy.get('.rec-algo-menu').contains('Recommended').click();
    cy.get('#fol-opt').click();
    cy.get('.rec-algo-menu').contains('Following');
  });
});
