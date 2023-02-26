/// <reference types="Cypress" />

import { mount } from "cypress/react18";
import BeatEditModal from ".";
import { Beat } from "../../types";

// create a beat for testing
const testBeat: Beat = JSON.parse(JSON.stringify({
    "_id": "359dd4aa-8b2a-4196-9cf1-de4f991c55ba",
    "created_at": "2023-01-21T08:40:50.590Z",
    "updated_at": "2023-01-21T10:20:45.888Z",
    "title": "Thriller",
    "artworkKey": "images/1a29769b6c15669886384931327819de",
    "audioKey": "beats/aa0cf1e6703d60ba22be47546066ac44",
    "artistId": "c690083b-4597-478a-9e15-68c61789807c",
    "artistName": "Montana Brown",
    "description": "Hot ass beat clap",
    "tempo": 116,
    "key": "A",
    "flatOrSharp": "",
    "majorOrMinor": "major",
    "genreTags": "[\"Hip-Hop & Rap\", \"Funk\", \"Pop\"]",
    "otherTags": null,
    "licensed": false
  }))

describe('BeatEditModal.test.tsx', () => {
  beforeEach(() => {
    mount(<BeatEditModal beat={testBeat} />);
    cy.get('[data-cy="edit button"]').click();
  })
  it('contains title in correct input field', () => {
    cy.get('[data-cy="title input"]').should("have.value", "Thriller");
  })
  it('contains description in the correct input field', () => {
    cy.get('[data-cy="description input"]').should("have.value", "Hot ass beat clap");
  })
  it('displays tempo', () => {
    cy.get('[data-cy="tempo"]').should("be.visible");
  })
  it('spins while loading', () => {
    console.log('loading...')
  })
})