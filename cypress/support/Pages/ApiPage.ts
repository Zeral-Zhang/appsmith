import { ObjectsRegistry } from "../Objects/Registry";
import {
  AppSidebar,
  AppSidebarButton,
  PageLeftPane,
  PagePaneSegment,
} from "./EditorNavigation";
import * as _ from "../Objects/ObjectsCore";
import ApiEditor from "../../locators/ApiEditor";

type RightPaneTabs = "datasources" | "connections";

export class ApiPage {
  public agHelper = ObjectsRegistry.AggregateHelper;
  public locator = ObjectsRegistry.CommonLocators;
  private assertHelper = ObjectsRegistry.AssertHelper;

  // private datasources = ObjectsRegistry.DataSources;

  _createapi = ".t--createBlankApiCard";
  _resourceUrl = ".t--dataSourceField";
  private _headerKey = (index: number) =>
    ".t--actionConfiguration\\.headers\\[" +
    index +
    "\\]\\.key\\." +
    index +
    "";
  private _headerValue = (index: number) =>
    ".t--actionConfiguration\\.headers\\[" +
    index +
    "\\]\\.value\\." +
    index +
    "";
  private _paramKey = (index: number) =>
    ".t--actionConfiguration\\.queryParameters\\[" +
    index +
    "\\]\\.key\\." +
    index +
    "";
  public _paramValue = (index: number) =>
    ".t--actionConfiguration\\.queryParameters\\[" +
    index +
    "\\]\\.value\\." +
    index +
    "";
  private _importedKey = (index: number, keyValueName: string) =>
    `.t--${keyValueName}-key-${index}`;
  private _importedValue = (index: number, keyValueName: string) =>
    `.t--${keyValueName}-value-${index}`;
  _bodyKey = (index: number) =>
    ".t--actionConfiguration\\.bodyFormData\\[0\\]\\.key\\." + index + "";
  _bodyValue = (index: number) =>
    `.t--actionConfiguration\\.bodyFormData\\[${index}\\]\\.value\\.${index}`;
  _bodyTypeDropdown =
    "//span[text()='Type'][@class='rc-select-selection-placeholder']/ancestor::div";
  _apiRunBtn = ".t--apiFormRunBtn";
  private _queryTimeout =
    "//input[@name='actionConfiguration.timeoutInMillisecond']";
  _responseBody = ".CodeMirror-code  span.cm-string.cm-property";
  private _blankAPI = "span:contains('REST API')";
  private _apiVerbDropdown = ".t--apiFormHttpMethod div";
  private _verbToSelect = (verb: string) =>
    "//div[contains(@class, 'rc-select-item-option')]//div[contains(text(),'" +
    verb +
    "')]";
  private _bodyTypeSelect = `//div[@data-testid="t--api-body-tab-switch"]`;
  private _bodyTypeToSelect = (subTab: string) =>
    "//div[contains(@class, 'rc-select-item-option')]//div[contains(text(),'" +
    subTab +
    "')]";
  private _rightPaneTab = (tab: string) =>
    "//span[contains(text(), '" + tab + "')]/parent::button";
  _visibleTextSpan = (spanText: string) => "//span[text()='" + spanText + "']";
  _visibleTextDiv = (divText: string) => "//div[text()='" + divText + "']";
  _noBodyMessageDiv = "#NoBodyMessageDiv";
  _noBodyMessage = "This request does not have a body";
  _imageSrc = "//img/parent::div";
  private _trashDelete = "[data-testid=t--trash-icon]";
  private _onPageLoad = "input[name='executeOnLoad'][type='checkbox']";
  private _confirmBeforeRunning =
    "input[name='confirmBeforeExecute'][type='checkbox']";
  private _paginationTypeLabels = ".t--apiFormPaginationType label";
  _saveAsDS = ".t--store-as-datasource";
  _responseStatus = ".t--response-status-code";
  public _responseTabHeader = "[data-testid=t--tab-headers]";
  public _headersTabContent = ".t--headers-tab";
  public _autoGeneratedHeaderInfoIcon = (key: string) =>
    `.t--auto-generated-${key}-info`;
  _nextCursorValue = ".t--apiFormPaginationNextCursorValue";
  _fileOperation = "[data-testid='t--file-operation']";
  _addMore = ".t--addApiHeader";
  public _editorDS = ".t--datasource-editor";
  public _addMoreHeaderFieldButton = ".t--addApiHeader";
  public jsonBody = `.t--apiFormPostBody`;
  private _entityName = ".t--entity-name";
  private curlImport = ".t--datasoucre-create-option-new_curl_import";
  private _curlTextArea =
    "//label[text()='Paste CURL Code Here']/parent::form/div";

  CreateApi(
    apiName = "",
    apiVerb: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
    aftDSSaved = false,
  ) {
    if (aftDSSaved) ObjectsRegistry.DataSources.CreateQueryAfterDSSaved();
    else {
      AppSidebar.navigate(AppSidebarButton.Editor);
      this.agHelper.RemoveUIElement("EvaluatedPopUp");
      PageLeftPane.switchSegment(PagePaneSegment.Queries);
      this.agHelper.GetHoverNClick(this.locator._createNew);
      this.agHelper.GetNClick(this._blankAPI, 0, true);
      this.agHelper.RemoveUIElement(
        "Tooltip",
        Cypress.env("MESSAGES").ADD_QUERY_JS_TOOLTIP(),
      );
    }
    this.assertHelper.AssertNetworkStatus("@createNewApi", 201);

    // cy.get("@createNewApi").then((response: any) => {
    //     expect(response.response.body.responseMeta.success).to.eq(true);
    //     cy.get(this.agHelper._actionName)
    //         .click()
    //         .invoke("text")
    //         .then((text) => {
    //             const someText = text;
    //             expect(someText).to.equal(response.response.body.data.name);
    //         });
    // }); // to check if Api1 = Api1 when Create Api invoked

    if (apiName) {
      this.agHelper.RenameWithInPane(apiName);
      this.agHelper.GetNAssertContains(this._entityName, apiName);
    }
    this.agHelper.AssertElementVisibility(this._resourceUrl);
    if (apiVerb != "GET") this.SelectAPIVerb(apiVerb);
  }

  CreateAndFillApi(
    url: string,
    apiName = "",
    queryTimeout = 10000,
    apiVerb: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
    aftDSSaved = false,
    toVerifySave = true,
  ) {
    this.CreateApi(apiName, apiVerb, aftDSSaved);
    this.EnterURL(url, "", toVerifySave);
    this.assertHelper.AssertNetworkStatus("@saveAction", 200);
    this.AssertRunButtonDisability();
    if (queryTimeout != 10000) this.SetAPITimeout(queryTimeout, toVerifySave);
  }

  AssertRunButtonDisability(disabled = false) {
    this.agHelper.AssertElementEnabledDisabled(this._apiRunBtn, 0, disabled);
  }

  EnterURL(url: string, evaluatedValue = "", toVerifySave = true) {
    this.agHelper.EnterValue(
      url,
      {
        propFieldName: this._resourceUrl,
        directInput: true,
        inputFieldName: "",
        apiOrQuery: "api",
      },
      toVerifySave,
    );
    this.agHelper.Sleep(); //Is needed for the entered url value to be registered, else failing locally & CI
    evaluatedValue && this.agHelper.VerifyEvaluatedValue(evaluatedValue);
  }

  EnterHeader(hKey: string, hValue: string, index = 0) {
    this.SelectPaneTab("Headers");
    this.agHelper.EnterValue(hKey, {
      propFieldName: this._headerKey(index),
      directInput: true,
      inputFieldName: "",
    });
    this.agHelper.PressEscape();
    this.agHelper.EnterValue(hValue, {
      propFieldName: this._headerValue(index),
      directInput: true,
      inputFieldName: "",
    });
    this.agHelper.PressEscape();
    this.agHelper.AssertAutoSave();
  }

  EnterParams(pKey: string, pValue: string, index = 0, escape = true) {
    this.SelectPaneTab("Params");
    this.agHelper.EnterValue(pKey, {
      propFieldName: this._paramKey(index),
      directInput: true,
      inputFieldName: "",
    });
    this.agHelper.PressEscape();
    this.agHelper.EnterValue(pValue, {
      propFieldName: this._paramValue(index),
      directInput: true,
      inputFieldName: "",
    });
    if (escape) {
      this.agHelper.PressEscape();
    }
    this.agHelper.AssertAutoSave();
  }

  EnterBodyFormData(
    subTab: "FORM_URLENCODED" | "MULTIPART_FORM_DATA",
    bKey: string,
    bValue: string,
    type = "",
    toTrash = false,
  ) {
    this.SelectPaneTab("Body");
    this.SelectSubTab(subTab);
    if (toTrash) {
      cy.get(this._trashDelete).first().click();
      cy.xpath(this._visibleTextSpan("Add more")).click();
    }
    this.agHelper.EnterValue(bKey, {
      propFieldName: this._bodyKey(0),
      directInput: true,
      inputFieldName: "",
    });
    this.agHelper.PressEscape();

    if (type) {
      cy.xpath(this._bodyTypeDropdown).eq(0).click();
      cy.xpath(this._visibleTextDiv(type)).click();
    }
    this.agHelper.EnterValue(bValue, {
      propFieldName: this._bodyValue(0),
      directInput: true,
      inputFieldName: "",
    });
    this.agHelper.PressEscape();
    this.agHelper.AssertAutoSave();
  }

  RunAPI(
    toValidateResponse = true,
    waitTimeInterval = 20,
    validateNetworkAssertOptions?: { expectedPath: string; expectedRes: any },
  ) {
    this.agHelper.GetNClick(this._apiRunBtn, 0, true, waitTimeInterval);
    toValidateResponse &&
      this.assertHelper.AssertNetworkExecutionSuccess("@postExecute");

    // Asserting Network result
    validateNetworkAssertOptions?.expectedPath &&
      validateNetworkAssertOptions?.expectedRes &&
      this.agHelper.AssertNetworkDataNestedProperty(
        "@postExecute",
        validateNetworkAssertOptions.expectedPath,
        validateNetworkAssertOptions.expectedRes,
      );
  }

  SetAPITimeout(timeout: number, toVerifySave = true) {
    this.SelectPaneTab("Settings");
    cy.xpath(this._queryTimeout).clear().type(timeout.toString(), { delay: 0 }); //Delay 0 to work like paste!
    toVerifySave && this.agHelper.AssertAutoSave();
    this.SelectPaneTab("Headers");
  }

  ToggleOnPageLoadRun(enable = true || false) {
    this.SelectPaneTab("Settings");
    if (enable) this.agHelper.CheckUncheck(this._onPageLoad, true);
    else this.agHelper.CheckUncheck(this._onPageLoad, false);
  }

  ToggleConfirmBeforeRunning(enable = true || false) {
    this.SelectPaneTab("Settings");
    if (enable) this.agHelper.CheckUncheck(this._confirmBeforeRunning, true);
    else this.agHelper.CheckUncheck(this._confirmBeforeRunning, false);
  }

  SelectPaneTab(
    tabName:
      | "Headers"
      | "Params"
      | "Body"
      | "Pagination"
      | "Authentication"
      | "Settings"
      | "Response"
      | "Errors"
      | "Logs"
      | "Inspect entity",
  ) {
    this.agHelper.PressEscape();
    this.agHelper.GetNClick(this._visibleTextSpan(tabName), 0, true);
  }

  SelectSubTab(
    subTabName:
      | "NONE"
      | "JSON"
      | "FORM_URLENCODED"
      | "MULTIPART_FORM_DATA"
      | "BINARY"
      | "RAW",
  ) {
    this.agHelper.GetNClick(this._bodyTypeSelect);
    this.agHelper.GetNClick(this._bodyTypeToSelect(subTabName));
  }

  AssertRightPaneSelectedTab(tabName: RightPaneTabs) {
    cy.xpath(this._rightPaneTab(tabName)).should(
      "have.attr",
      "aria-selected",
      "true",
    );
  }

  SelectRightPaneTab(tabName: RightPaneTabs) {
    this.agHelper.GetNClick(this._rightPaneTab(tabName));
  }

  ValidateQueryParams(param: { key: string; value: string }) {
    this.SelectPaneTab("Params");
    this.agHelper.ValidateCodeEditorContent(this._paramKey(0), param.key);
    this.agHelper.ValidateCodeEditorContent(this._paramValue(0), param.value);
  }

  ValidateHeaderParams(header: { key: string; value: string }, index = 0) {
    this.SelectPaneTab("Headers");
    this.agHelper.ValidateCodeEditorContent(this._headerKey(index), header.key);
    this.agHelper.ValidateCodeEditorContent(
      this._headerValue(index),
      header.value,
    );
  }

  ValidateImportedHeaderParams(
    isAutoGeneratedHeader = false,
    header: { key: string; value: string },
    index = 0,
  ) {
    let keyValueName = "Header";
    if (isAutoGeneratedHeader) {
      keyValueName = "autoGeneratedHeader";
    }

    this.SelectPaneTab("Headers");
    this.ValidateImportedKeyValueContent(
      this._importedKey(index, keyValueName),
      header.key,
    );
    this.ValidateImportedKeyValueContent(
      this._importedValue(index, keyValueName),
      header.value,
    );
  }

  public ValidateImportedKeyValueContent(
    selector: string,
    contentToValidate: any,
  ) {
    this.agHelper.GetNAssertElementText(
      selector,
      contentToValidate,
      "have.text",
    );
  }

  public ValidateImportedKeyValueOverride(index: number, isOverriden = true) {
    let assertion = "";

    if (isOverriden) {
      assertion = "have.css";
    } else {
      assertion = "not.have.css";
    }
    cy.get(this._importedKey(index, "autoGeneratedHeader")).should(
      assertion,
      "text-decoration",
      "line-through solid rgb(76, 86, 100)",
    );
    cy.get(this._importedValue(index, "autoGeneratedHeader")).should(
      assertion,
      "text-decoration",
      "line-through solid rgb(76, 86, 100)",
    );
  }

  ValidateImportedHeaderParamsAbsence(
    isAutoGeneratedHeader = false,
    index = 0,
  ) {
    let keyValueName = "Header";
    if (isAutoGeneratedHeader) {
      keyValueName = "autoGeneratedHeader";
    }

    this.SelectPaneTab("Headers");
    this.ValidateImportedKeyValueAbsence(
      this._importedKey(index, keyValueName),
    );
    this.ValidateImportedKeyValueAbsence(
      this._importedValue(index, keyValueName),
    );
  }

  public ValidateImportedKeyValueAbsence(selector: string) {
    this.agHelper.AssertElementAbsence(selector);
  }

  ReadApiResponsebyKey(key: string) {
    let apiResp = "";
    cy.get(this._responseBody)
      .contains(key)
      .siblings("span")
      .invoke("text")
      .then((text) => {
        apiResp = `${text
          .match(/"(.*)"/)?.[0]
          .split('"')
          .join("")} `;
        cy.log("Key value in api response is :" + apiResp);
        cy.wrap(apiResp).as("apiResp");
      });
  }

  SwitchToResponseTab(tabIdentifier: string) {
    cy.get(tabIdentifier).click();
  }

  public SelectAPIVerb(verb: "GET" | "POST" | "PUT" | "DELETE" | "PATCH") {
    cy.get(this._apiVerbDropdown).click();
    cy.xpath(this._verbToSelect(verb)).should("be.visible").click();
  }

  public AssertAPIVerb(verb: "GET" | "POST" | "PUT" | "DELETE" | "PATCH") {
    this.agHelper.AssertText(this._apiVerbDropdown, "text", verb);
  }

  ResponseStatusCheck(statusCode: string) {
    this.agHelper.AssertElementVisibility(this._responseStatus);
    this.agHelper.GetNAssertContains(this._responseStatus, statusCode);
  }

  public SelectPaginationTypeViaIndex(index: number) {
    cy.get(this._paginationTypeLabels).eq(index).click({ force: true });
  }

  CreateAndFillGraphqlApi(url: string, apiName = "", queryTimeout = 10000) {
    this.CreateGraphqlApi(apiName);
    this.EnterURL(url);
    this.agHelper.AssertAutoSave();
    this.AssertRunButtonDisability();
    if (queryTimeout != 10000) this.SetAPITimeout(queryTimeout);
  }

  CreateGraphqlApi(apiName = "") {
    AppSidebar.navigate(AppSidebarButton.Editor);
    PageLeftPane.switchSegment(PagePaneSegment.Queries);
    PageLeftPane.switchToAddNew();
    this.agHelper.GetNClickByContains(".ads-v2-listitem", "GraphQL API");
    this.assertHelper.AssertNetworkStatus("@createNewApi", 201);

    if (apiName) this.agHelper.RenameWithInPane(apiName);
    cy.get(this._resourceUrl).should("be.visible");
  }

  AssertEmptyHeaderKeyValuePairsPresent(index: number) {
    this.agHelper.AssertElementVisibility(this._headerKey(index));
    this.agHelper.AssertElementVisibility(this._headerValue(index));
  }

  DebugError() {
    this.agHelper.GetNClick(this._responseTabHeader);
    cy.get(this._headersTabContent).contains("Debug").click();
  }

  public FillCurlNImport(value: string) {
    AppSidebar.navigate(AppSidebarButton.Editor);
    PageLeftPane.switchSegment(PagePaneSegment.Queries);
    PageLeftPane.switchToAddNew();
    this.agHelper.GetNClick(this.curlImport);
    this.ImportCurlNRun(value);
  }

  public ImportCurlNRun(value: string) {
    this.agHelper.UpdateTextArea(this._curlTextArea, value);
    this.agHelper.Sleep(500); //Clicking import after value settled
    cy.get(ApiEditor.curlImportBtn).click({ force: true });
    cy.wait("@curlImport").should(
      "have.nested.property",
      "response.body.responseMeta.status",
      201,
    );
    this.RunAPI();
  }
}
