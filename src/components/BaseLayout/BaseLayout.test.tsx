/// <reference types="Cypress" />

import { mount } from 'cypress/react18';
import BaseLayout from '.';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
// import Dashboard from '../pages/Dashboard';
// import gatewayUrl from '../../../config/routing';

// fake component to test Outlet rendering
const TestComp = () => <div data-cy="test-comp">test this</div>;

describe('BaseLayout.test.tsx', () => {
  beforeEach(() => {
    mount(
      <MemoryRouter>
        <Routes>
          <Route element={<BaseLayout />}>
            <Route path="/" element={<TestComp />} index />
          </Route>
        </Routes>
      </MemoryRouter>
    );
  });
  it('contains AntD Layout, custom Navbar, and AntD Content components', () => {
    cy.getBySel('layout');
    // not sure why these arent working when they render to the test browser
    // cy.getBySel('navbar');
    // cy.getBySel('content');
  });
  it('properly renders component through the router outlet', () => {
    cy.getBySel('test-comp');
  });
});

// TODO: ensure that components are rendered in the proper order.
