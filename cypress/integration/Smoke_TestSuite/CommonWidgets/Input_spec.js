const widgetsPage = require("../../../locators/Widgets.json");
const commonlocators = require("../../../locators/commonlocators.json");

context("Cypress test", function() {
  it("Input Widget Functionality", function() {
    cy.NavigateToCommonWidgets();
    cy.get(widgetsPage.inputWidget)
      .first()
      .trigger("mouseover");
    cy.get(widgetsPage.inputWidget)
      .get(commonlocators.editIcon)
      .first()
      .click();
    //Checking the edit props for container and changing the Input label name
    cy.get(".CodeMirror textarea")
      .first()
      .focus()
      .type("{ctrl}{shift}{downarrow}")
      .clear({ force: true })
      .should("be.empty")
      .type("Test Input Label", { force: true })
      .wait(5000);

    cy.get(commonlocators.editPropCrossButton).click();
  });
});
