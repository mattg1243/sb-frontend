import './commands';

declare global {
  namespace Cypress {
    interface Chainable {
      // login(email: string, password: string): Chainable<void>
      // drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      // dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      // visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
      /**
       * Custom command to get an element by the data-cy testing attribute.
       */
      getBySel(selector: string): Chainable<JQuery<HTMLElement>>;
      multiSelect(selector: string, text: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}
