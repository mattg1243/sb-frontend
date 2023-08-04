/// <reference types="Cypress" />

import { mount } from 'cypress/react18';
import { MemoryRouter } from 'react-router-dom';
import BeatPage from '.';
import gatewayUrl from '../../../config/routing';
import { Provider } from 'react-redux';
import { store } from '../../../store';
import { testBeat } from '../../../testFixtures/testBeat';

describe('BeatPage', () => {
  beforeEach(() => {
    cy.intercept('GET', `${gatewayUrl}/beats?id=*`, { statusCode: 200 });
    cy.intercept(`${gatewayUrl}/beats/user-likes?beatId=*`, { statusCode: 200 });
    mount(
      <Provider store={store}>
        <MemoryRouter>
          <BeatPage testBeat={testBeat} />
        </MemoryRouter>
      </Provider>
    );
  });
  // it('gets beat', () => {});
  it('displays artist', () => {
    cy.getBySel('beat-page-title').contains(testBeat.title);
  });
  // TODO make this intercept api call
  // it('like btn', () => {
  //   cy.intercept('GET', ``)
  //   cy.getBySel('beat-page-unlike-btn').click();
  //   cy.getBySel('beat-page-like-btn');
  // });
  // it('share btn', () => {});
  // it('stems', () => {});
});
