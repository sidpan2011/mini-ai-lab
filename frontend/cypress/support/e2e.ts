// ***********************************************************
// This file is processed and loaded automatically before your test files.
// ***********************************************************

import "@testing-library/cypress/add-commands";
import "cypress-file-upload";

// Prevent TypeScript errors
export {};

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      signup(email: string, password: string): Chainable<void>;
    }
  }
}

// Custom command for login
Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("/login");
  cy.get('input[type="email"]').clear().type(email);
  cy.get('input[type="password"]').first().clear().type(password);
  cy.get('button[type="submit"]').click();

  // Wait for redirect or API response
  cy.url({ timeout: 10000 }).should("include", "/studio");
});

// Custom command for signup
Cypress.Commands.add("signup", (email: string, password: string) => {
  cy.visit("/signup");
  cy.get('input[type="email"]').clear().type(email);
  cy.get('input[type="password"]').first().clear().type(password);
  cy.get('input[type="password"]').last().clear().type(password);
  cy.get('button[type="submit"]').click();

  // Wait for redirect or API response (longer timeout for signup)
  cy.url({ timeout: 10000 }).should("include", "/studio");
});
