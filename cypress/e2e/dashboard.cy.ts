/// <reference types="Cypress" />

const GATEWAY_URL = 'http://localhost:8000';

describe('Streams and likes are counted properly', () => {
  beforeEach(() => {
    cy.intercept('GET', `/beats/beats`, { fixture: 'getBeatsRes.json' }).as('getBeatsReq');
    cy.intercept('GET', `/beats/user-likes?beatId=*`, { statusCode: 200 }).as('getLikesReq');
    cy.intercept('GET', `/beats/like?beatId=*`, { statusCode: 200 }).as('likeBeatReq');
    cy.clock();
    cy.visit('/app/dash');
    cy.wait('@getBeatsReq');
    cy.wait('@getLikesReq');
  });
  // this is covered in the before each
  it('Gets beats to display', () => {});
  it('Checks to see if a user likes a beat', () => {});
  it('Sends request and adds to count when liking a beat', () => {
    // incomplete, should check value of stats display
    cy.getBySel('beat-like-btn').children().first().click();
    cy.wait('@likeBeatReq');
  });

  it('Sends request and subtracts to count when unliking a beat', () => {
    // like the beat
    cy.intercept('GET', `/beats/unlike?beatId=*`, { statusCode: 200 }).as('unlikeBeatReq');
    cy.getBySel('beat-like-btn').children().first().click();
    cy.wait('@likeBeatReq');
    // unlike the beat
    cy.getBySel('beat-like-btn').children().first().click();
    cy.wait('@unlikeBeatReq');
    // wait for unlike beat req
  });

  it('Adds a stream when track is played for over 20 seconds', () => {
    // incomplete
    // cy.intercept(`/beats/add-stream?beatId=*`).as('streamBeatReq');
    // cy.getBySel('beat-artwork').first().click();
    // cy.wait(21000);
    // cy.wait('@streamBeatReq');
  });

  it('Does not add a stream when beat is stopped before 20 seconds', () => {
    // incomplete
  });

  it('Download - opens modal and makes proper request', () => {
    cy.intercept('/beats/download?beatId=*', { statusCode: 200 }).as('downloadBeatReq');
    cy.getBySel('download-modal-btn').first().click();
    cy.getBySel('download-beat-btn').click();
    cy.wait('@downloadBeatReq');
  });

  it('Upload - makes proper request', () => {
    cy.intercept('/beats/upload?beatId=*', { statusCode: 200 }).as('uploadBeatReq');
    cy.getBySel('upload-modal-nav').click();
    cy.getBySel('title-input').type('supa fire');
    cy.get('.ant-select-selector').first().click();
    // cy.get('#rc_select_2_list_7').click();
  });
});

describe('Search', () => {
  it('Displays filter button', () => {});
});

describe('Can navigate to all other pages', () => {
  it('Profile', () => {});
  it('About', () => {});
  it('Account', () => {});
  it('Beats', () => {});
  it('Settings', () => {});
});
