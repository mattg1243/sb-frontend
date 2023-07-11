/// <reference types="Cypress" />
import { mount } from 'cypress/react18';
import { store } from '../../store';
import { Provider } from 'react-redux';
import Notification, { INotificationProps } from '.';

const message = 'Your subscription is now live!';
const type = 'success';

// describe('Notification.test.tsx', () => {
//   it('Contains correct message', () => {
//     mount(
//       <Provider store={store}>
//         <Notification message="Your subscription is now live!" type="success" test={true} />
//       </Provider>
//     ).then(() => {
//       cy.wait(100);
//       cy.getBySel('notification').should('contain.text', 'Your subscription is now live!');
//     });
//   });

//   before(() => {
//     <Provider store={store}>
//       <Notification message="Your subscription is now live!" type="success" test={true} />
//     </Provider>;
//   });
//   it('Shows check icon on success', () => {
//     cy.getBySel('noti-check-icon');
//   });

//   before(() => {
//     <Provider store={store}>
//       <Notification message="There was an error with your subscription" type="error" test={true} />
//     </Provider>;
//   });
//   it('Shows X icon on error', () => {});
//   it('Shows info icon on info notifications', () => {});
// });
