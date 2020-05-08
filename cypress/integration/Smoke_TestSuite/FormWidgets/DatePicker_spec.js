const commonlocators = require("../../../locators/commonlocators.json");
const formWidgetsPage = require("../../../locators/FormWidgets.json");
const dsl = require("../../../fixtures/formdsl.json");

describe("DatePicker Widget Functionality", function() {
  beforeEach(() => {
    cy.addDsl(dsl);
  });

  it("DatePicker Widget Functionality", function() {
    cy.openPropertyPane("datepickerwidget");

    //Checking the edit props for DatePicker and also the properties of DatePicker widget
    cy.testCodeMirror("From Date");
    cy.get(commonlocators.editPropCrossButton).click();
  });

  afterEach(() => {
    // put your clean up code if any
  });
});
