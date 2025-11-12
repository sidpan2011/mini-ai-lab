/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      signup(email: string, password: string): Chainable<void>;
    }
  }
}

export {};
