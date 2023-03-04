/// <reference types="Cypress"  />
import { mount } from 'cypress/react18';
import FollowButton from './index';
import gatewayUrl from '../../config/routing';

const currentUser = 'aafea35c-fa74-46eb-99da-561f1661dca5'; // sbtester@gmail.com
const viewedUser = '7ab81fa8-c40d-42ee-b3f5-01765617a2a2'; // dak

describe('Follow Button', () => {
  beforeEach(() => {});
  it('displays Follow / Unfollow properly', () => {
    const clickFn = cy.stub();
    mount(<FollowButton currentUser={currentUser} viewedUser={viewedUser} stubFn={clickFn} />);
    cy.intercept('POST', `${gatewayUrl}`);
    cy.get('#follow-btn')
      .should('contain', 'Follow')
      .click()
      .then(() => {
        expect(clickFn).to.have.been.calledOnce;
      })
      .and('contain', 'Unfollow');
  });
});
