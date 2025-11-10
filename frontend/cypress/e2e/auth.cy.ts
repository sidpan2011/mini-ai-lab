/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe("Authentication Flow", () => {
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = "password123";

  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage();
  });

  describe("Signup", () => {
    it("should display signup form", () => {
      cy.visit("/signup");
      cy.findByLabelText(/email/i).should("be.visible");
      cy.findByLabelText(/^password$/i).should("be.visible");
      cy.findByLabelText(/confirm password/i).should("be.visible");
      cy.findByRole("button", { name: /sign up/i }).should("be.visible");
    });

    it("should show validation errors for empty fields", () => {
      cy.visit("/signup");
      cy.findByRole("button", { name: /sign up/i }).click();
      cy.contains(/please enter a valid email/i).should("be.visible");
      cy.contains(/password is required/i).should("be.visible");
    });

    it("should show error for mismatched passwords", () => {
      cy.visit("/signup");
      cy.findByLabelText(/email/i).type("test@example.com");
      cy.findByLabelText(/^password$/i).type("password123");
      cy.findByLabelText(/confirm password/i).type("different123");
      cy.findByRole("button", { name: /sign up/i }).click();
      cy.contains(/passwords do not match/i).should("be.visible");
    });

    it("should successfully create account and redirect to studio", () => {
      cy.visit("/signup");
      cy.findByLabelText(/email/i).type(testEmail);
      cy.findByLabelText(/^password$/i).type(testPassword);
      cy.findByLabelText(/confirm password/i).type(testPassword);
      cy.findByRole("button", { name: /sign up/i }).click();

      cy.url().should("include", "/studio");
      cy.window().then((win) => {
        expect(win.localStorage.getItem("token")).to.exist;
        expect(win.localStorage.getItem("user")).to.exist;
      });
    });
  });

  describe("Login", () => {
    it("should display login form", () => {
      cy.visit("/login");
      cy.findByLabelText(/email/i).should("be.visible");
      cy.findByLabelText(/password/i).should("be.visible");
      cy.findByRole("button", { name: /log in/i }).should("be.visible");
    });

    it("should show validation errors for empty fields", () => {
      cy.visit("/login");
      cy.findByRole("button", { name: /log in/i }).click();
      cy.contains(/please enter a valid email/i).should("be.visible");
      cy.contains(/password is required/i).should("be.visible");
    });

    it("should show error for invalid credentials", () => {
      cy.visit("/login");
      cy.findByLabelText(/email/i).type("invalid@example.com");
      cy.findByLabelText(/password/i).type("wrongpassword");
      cy.findByRole("button", { name: /log in/i }).click();

      cy.contains(/invalid credentials|error/i, { timeout: 10000 }).should(
        "be.visible"
      );
    });
  });

  describe("Logout", () => {
    it("should logout and redirect to login page", () => {
      // First signup
      cy.signup(`logout${Date.now()}@example.com`, "password123");

      // Then logout
      cy.findByRole("button", { name: /logout|sign out/i }).click();
      cy.url().should("include", "/login");

      cy.window().then((win) => {
        expect(win.localStorage.getItem("token")).to.be.null;
        expect(win.localStorage.getItem("user")).to.be.null;
      });
    });
  });

  describe("Protected Routes", () => {
    it("should redirect to login when accessing studio without auth", () => {
      cy.visit("/studio");
      cy.url().should("include", "/login");
    });

    it("should allow access to studio when authenticated", () => {
      cy.signup(`protected${Date.now()}@example.com`, "password123");
      cy.url().should("include", "/studio");
    });
  });

  describe("Session Persistence", () => {
    it("should persist authentication across page reloads", () => {
      cy.signup(`persist${Date.now()}@example.com`, "password123");
      cy.url().should("include", "/studio");

      cy.reload();
      cy.url().should("include", "/studio");
      cy.window().then((win) => {
        expect(win.localStorage.getItem("token")).to.exist;
      });
    });
  });
});
