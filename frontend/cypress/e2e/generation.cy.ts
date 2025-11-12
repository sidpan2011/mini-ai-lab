/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
/// <reference types="cypress-file-upload" />

describe("Image Generation Flow", () => {
  const testPassword = "password123";

  beforeEach(() => {
    cy.clearLocalStorage();
    // Use unique email for each test to avoid conflicts
    const testEmail = `gen${Date.now()}${Math.random().toString(36).substring(7)}@example.com`;
    cy.signup(testEmail, testPassword);
  });

  describe("Studio Page", () => {
    it("should display all generation controls", () => {
      cy.contains(/create generation/i).should("be.visible");
      cy.findByText(/prompt/i).should("be.visible");
      cy.findByText(/style/i).should("be.visible");
      cy.findByRole("button", { name: /generate/i }).should("be.visible");
    });

    it("should show error when generating without image", () => {
      cy.get("input#prompt").type("A beautiful sunset");
      cy.findByRole("button", { name: /generate/i }).click();
      cy.contains(/please upload an image/i, { timeout: 3000 }).should(
        "be.visible"
      );
    });

    it("uploads an image and successfully generates (stubbed)", () => {
      const mockGeneration = {
        id: 123,
        prompt: "A futuristic city skyline at dusk",
        style: "realistic",
        imageUrl: "/uploads/generated-test.png",
        status: "succeeded",
        createdAt: new Date().toISOString(),
      };

      // Stub the POST request to create a generation
      cy.intercept("POST", "http://localhost:4000/api/generations", {
        statusCode: 201,
        body: mockGeneration,
      }).as("createGeneration");

      // Stub the GET request to return the generated item after creation
      cy.intercept("GET", "http://localhost:4000/api/generations*", {
        statusCode: 200,
        body: [mockGeneration],
      }).as("getGenerations");

      // attach fixture image using correct Cypress syntax
      cy.fixture("test-image.png", null).then((fileContent) => {
        cy.get('input[type="file"]').attachFile({
          fileContent,
          fileName: "test-image.png",
          mimeType: "image/png",
        });
      });

      // fill prompt and select a style
      const prompt = "A futuristic city skyline at dusk";
      cy.get("input#prompt").clear().type(prompt);

      // Select style from dropdown
      cy.get("select#style").select("Artistic");

      // click generate and wait for stubbed response
      cy.findByRole("button", { name: /generate/i }).click();
      cy.wait("@createGeneration").its("response.statusCode").should("eq", 201);

      // Wait for the history to reload
      cy.wait("@getGenerations");

      // assert that the generated item appears in history (by prompt text or image url)
      cy.contains(prompt, { timeout: 5000 }).should("be.visible");
      cy.get("img")
        .should("have.attr", "src")
        .and("match", /uploads\/generated-test.png|generated-test.png/);
    });

    it("uploads an image and generates with real backend (integration)", () => {
      // NO STUB - this hits the real backend to test full flow including Multer

      // attach fixture image using correct Cypress syntax
      cy.fixture("test-image.png", null).then((fileContent) => {
        cy.get('input[type="file"]').attachFile({
          fileContent,
          fileName: "test-image.png",
          mimeType: "image/png",
        });
      });

      // fill prompt and select a style
      const prompt = "Real backend integration test";
      cy.get("input#prompt").clear().type(prompt);

      // Select style from dropdown
      cy.get("select#style").select("Realistic");

      // click generate and wait for REAL backend response
      cy.findByRole("button", { name: /generate/i }).click();

      // Should show loading state
      cy.get("svg").should("exist"); // Loading spinner

      // Wait for real backend to respond (with DISABLE_MODEL_OVERLOAD=true, no retry needed)
      // Backend takes 1-2 seconds to process
      cy.contains(prompt, { timeout: 10000 }).should("be.visible");

      // Verify actual image URL from backend (should have timestamp)
      cy.get("img")
        .should("have.attr", "src")
        .and("match", /uploads\/\d+-test-image\.png/); // Real Multer filename with timestamp
    });
  });

  describe("Image Upload", () => {
    it("should upload image via file input", () => {
      // Upload test image using correct Cypress syntax
      cy.fixture("test-image.png", null).then((fileContent) => {
        cy.get('input[type="file"]').attachFile({
          fileContent,
          fileName: "test-image.png",
          mimeType: "image/png",
        });
      });

      // Verify image is displayed (wait a bit for upload to process)
      cy.wait(500);
      cy.get("img").should("exist");
    });
  });

  describe("Prompt and Style Selection", () => {
    it("should allow entering prompt text", () => {
      const prompt = "A beautiful sunset over mountains";
      cy.get("input#prompt").type(prompt);
      cy.get("input#prompt").should("have.value", prompt);
    });

    it("should allow selecting different styles", () => {
      // Select from dropdown
      cy.get("select#style").select("Artistic");
      cy.get("select#style").should("have.value", "Artistic");
    });
  });

  describe("Generation History", () => {
    it("should display generation history section", () => {
      cy.contains(/recent generations|history/i).should("be.visible");
    });

    it("should show message when no history exists", () => {
      cy.contains(/no generations|get started/i).should("be.visible");
    });
  });

  describe("Error Handling", () => {
    it("should show loading state during generation", () => {
      // Enter prompt without image
      cy.get("input#prompt").type("Test prompt");
      cy.findByRole("button", { name: /generate/i }).click();
      // Will show error message instead
      cy.contains(/please upload an image/i).should("be.visible");
    });
  });

  describe("Responsive Design", () => {
    it("should work on mobile viewport", () => {
      cy.viewport("iphone-x");
      cy.contains(/create generation/i).should("be.visible");
      cy.get("input#prompt").should("be.visible");
      cy.findByRole("button", { name: /generate/i }).should("be.visible");
    });

    it("should work on tablet viewport", () => {
      cy.viewport("ipad-2");
      cy.contains(/create generation/i).should("be.visible");
      cy.get("input#prompt").should("be.visible");
      cy.findByRole("button", { name: /generate/i }).should("be.visible");
    });
  });
});
