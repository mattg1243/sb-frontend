/// <reference types="Cypress" />

import { mount } from 'cypress/react18';
import { Provider } from 'react-redux';
import PlaybackButtons from '.';
import { store } from '../../store';
import { testBeat } from '../../testFixtures/testBeat';
import { MemoryRouter } from 'react-router-dom';

// describe('PlaybackButtons.test.tsx', () => {
//   beforeEach(() => {
//     mount(
//       <MemoryRouter>
//         <Provider store={store}>
//           <PlaybackButtons testBeatPlaying={testBeat} />
//         </Provider>
//       </MemoryRouter>
//     );
//   });
//   // it('toggles between play and pause icons', () => {
//   //   cy.getBySel('playback-btn').children('[data-cy="pause-icon"]');
//   //   cy.wait(1000);
//   //   cy.getBySel('playback-btn').click();
//   //   cy.getBySel('playback-btn').children('[data-cy="play-icon"]');
//   // });
//   it('displays song title and artist name', () => {
//     cy.getBySel('playback-btn').trigger('mouseover');
//     cy.get('#playback-info').contains(`${testBeat.title} - ${testBeat.artistName}`);
//   });
// });
