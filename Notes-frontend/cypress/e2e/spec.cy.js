describe("Login Test", () => {
  it("should login successfully", () => {
    cy.visit("http://localhost:3000/login");
    cy.get("input[name='email']").type("sahil.211714101@vcet.edu.in");
    cy.get("input[name='password']").type("Test@123");
    cy.get("button[type='login']").click();
    cy.url().should("include", "/home");
  });
});
