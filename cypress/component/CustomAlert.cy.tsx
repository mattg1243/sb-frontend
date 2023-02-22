import CustomAlert from "../../src/components/CustomAlert";

describe('CustomAlert.cy.tsx', () => {
  beforeEach(() => {
    cy.mount(<CustomAlert status="success" message="Component does mount" />)
  })
  it('displays correct message', () => {
    cy.get('[data-cy="alert"]').contains('Component does mount')
  })
})