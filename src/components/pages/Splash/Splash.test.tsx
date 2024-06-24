import React from 'react';
import { mount } from 'cypress/react18';
import { BrowserRouter as Router } from 'react-router-dom';
import { InfoSection } from './Hero2';

describe('Hero2', () => {
  const props = {
    header: 'Test Header',
    highlightedText: 'Test Highlight',
    content: 'Test Content',
    buttonText: 'Test Button',
  };

  it('renders correctly', () => {
    mount(
      <Router>
        <InfoSection
          header={props.header}
          highlightedText={props.highlightedText}
          content={props.content}
          buttonText={props.buttonText}
        />
      </Router>
    );

    cy.get('h2').should('contain', props.header);
    cy.get('span').should('contain', props.highlightedText).and('have.css', 'color', 'rgb(210, 121, 35)');
    cy.get('p').should('contain', props.content);
    cy.get('button').should('contain', props.buttonText);
  });

  it('navigates to /FAQ on button click', () => {
    const props = {
      header: 'Test Header',
      highlightedText: 'Test Highlight',
      content: 'Test Content',
      buttonText: 'Test Button',
    };

    mount(
      <Router>
        <InfoSection
          header={props.header}
          highlightedText={props.highlightedText}
          content={props.content}
          buttonText={props.buttonText}
        />
      </Router>
    );

    cy.get('button').click();
    cy.url().should('include', '/FAQ');
  });
});
