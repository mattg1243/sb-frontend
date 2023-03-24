/// <reference types="Cypress"  />
import { mount } from 'cypress/react18';
import FollowButton from './index';
import gatewayUrl from '../../config/routing';

const currentUser = 'aafea35c-fa74-46eb-99da-561f1661dca5'; // sbtester@gmail.com
const viewedUser = '7ab81fa8-c40d-42ee-b3f5-01765617a2a2'; // dak
describe('Follow Button', () => {
  it('displays Follow / Unfollow properly', () => {
    // cy.intercept('GET', `${gatewayUrl}/user/isfollowing?currentUser=${currentUser}`).as('isFollowingReq');
    // cy.wait('@isFollowingReq').should('have.been.called');
    // cy.intercept('POST', `${gatewayUrl}/user/follow`).as('followReq');
    const clickFn = cy.stub();
    mount(<FollowButton currentUser={currentUser} viewedUser={viewedUser} stubFn={clickFn} />);
    cy.get('#follow-btn')
      .should('contain', 'Follow')
      .click()
      .then(() => {
        expect(clickFn).to.have.been.calledOnce;
      })
      .and('contain', 'Unfollow');
    // cy.wait('@followReq').its('request.body').should('have.keys', 'userToFollow');
  });
});
