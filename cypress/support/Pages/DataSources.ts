import { ObjectsRegistry } from "../Objects/Registry";
import { WIDGET } from "../../locators/WidgetLocators";
import { EntityItems } from "./AssertHelper";

export const DataSourceKVP = {
  Postgres: "PostgreSQL",
  Mongo: "MongoDB",
  MySql: "MySQL",
  UnAuthenticatedGraphQL: "GraphQL API",
  MsSql: "Microsoft SQL Server",
  Airtable: "Airtable",
  ArangoDB: "ArangoDB",
  Firestore: "Firestore",
  Elasticsearch: "Elasticsearch",
  Redis: "Redis",
  Oracle: "Oracle",
  S3: "S3",
  Twilio: "Twilio",
}; //DataSources KeyValuePair

export enum Widgets {
  Dropdown,
  Table,
  Chart,
  Text,
}

interface RunQueryParams {
  toValidateResponse?: boolean;
  expectedStatus?: boolean;
  waitTimeInterval?: number;
}
export class DataSources {
  private agHelper = ObjectsRegistry.AggregateHelper;
  private table = ObjectsRegistry.Table;
  private entityExplorer = ObjectsRegistry.EntityExplorer;
  private locator = ObjectsRegistry.CommonLocators;
  private apiPage = ObjectsRegistry.ApiPage;
  private dataManager = ObjectsRegistry.DataManager;
  private assertHelper = ObjectsRegistry.AssertHelper;

  public ContainerKVP = (containerName: string) => {
    return {
      MsSql: this.dataManager.mssql_docker(containerName),
      Arango: this.dataManager.arango_docker(containerName),
      Elasticsearch: this.dataManager.elastic_docker(containerName),
    };
  }; //Container KeyValuePair

  private _dsCreateNewTab = "[data-testid=t--tab-CREATE_NEW]";
  private _dsReviewSection = "[data-testid='t--ds-review-section']";
  private _addNewDataSource = ".t--entity-add-btn.datasources button";
  private _createNewPlgin = (pluginName: string) =>
    ".t--plugin-name:contains('" + pluginName + "')";
  public _host = "input[name$='.datasourceConfiguration.endpoints[0].host']";
  public _port = "input[name$='.datasourceConfiguration.endpoints[0].port']";
  public _databaseName =
    "input[name$='.datasourceConfiguration.authentication.databaseName']";
  public _username =
    "input[name$='.datasourceConfiguration.authentication.username']";
  private _section = (name: string) =>
    "//div[text()='" + name + "']/parent::div";
  private _sectionState = (name: string) =>
    this._section(name) +
    "/following-sibling::div/div[@class ='bp3-collapse-body']";
  public _password =
    "input[name $= '.datasourceConfiguration.authentication.password']";
  private defaultDatabaseName =
    "input[name*='datasourceConfiguration.connection.defaultDatabaseName']";
  private _testDs = ".t--test-datasource";
  _saveAndAuthorizeDS = ".t--save-and-authorize-datasource";
  _saveDs = ".t--save-datasource";
  _datasourceCard = ".t--datasource";
  _dsMenuoptions = "div.t--datasource-menu-option";
  _editButton = ".t--edit-datasource";
  _reconnectDataSourceModal = "[data-testid=t--tab-RECONNECT_DATASOURCES]";
  _closeDataSourceModal = ".t--reconnect-close-btn";
  _dsEntityItem = "[data-guided-tour-id='explorer-entity-Datasources']";
  _activeDS = "[data-testid='active-datasource-name']";
  _mockDatasourceName = "[data-testid=mockdatasource-name]";
  _templateMenu = ".t--template-menu";
  _templateMenuOption = (action: string) =>
    "//div[contains(@class, 't--template-menu')]//div[text()='" + action + "']";
  _createQuery = ".t--create-query";
  _visibleTextSpan = (spanText: string) =>
    "//span[contains(text(),'" + spanText + "')]";
  _dsOptionMenuItem = (text: string) =>
    "//div[@role='menuitem']//span[text()='" + text + "']";
  _dropdownTitle = (ddTitle: string) =>
    "//p[contains(text(),'" +
    ddTitle +
    "')]/ancestor::div[@class='form-config-top']/following-sibling::div[@class='t--form-control-DROP_DOWN']//input | //label[text()='" +
    ddTitle +
    "']/following-sibling::span//button";
  _reconnectModal = "[data-testid='reconnect-datasource-modal']";
  _reconnect = ".t--reconnect-btn";
  _dropdown = (ddTitle: string) =>
    "//span[contains(@title, '" +
    ddTitle +
    "') and text() = '" +
    ddTitle +
    "']";
  _activeDSListReconnectModal = (dbName: string) =>
    "//div[contains(@class, 't--ds-list')]//span[text()='" + dbName + "']";
  _runQueryBtn = ".t--run-query";
  _newDatabases = "#new-datasources";
  _newDatasourceContainer = "#new-integrations-wrapper";
  _selectDatasourceDropdown = "[data-testid=t--datasource-dropdown]";
  _selectTableDropdown =
    "[data-testid=t--table-dropdown] .rc-select-selection-item";
  _selectSheetNameDropdown =
    "[data-testid=t--sheetName-dropdown] .rc-select-selector";
  _selectTableHeaderIndexInput = "[data-testid=t--tableHeaderIndex]";
  _dropdownOption = ".rc-select-item-option-content";
  _generatePageBtn = "[data-testid=t--generate-page-form-submit]";
  _selectedRow = ".tr.selected-row";
  _activeTab = "span:contains('Active')";
  _selectedActiveTab = "li[aria-selected='true'] " + this._activeTab;
  _contextMenuDSReviewPage = "[data-testid='t--context-menu-trigger']";
  _contextMenuDelete = ".t--datasource-option-delete";
  _datasourceCardGeneratePageBtn = ".t--generate-template";
  _queryOption = (option: string) =>
    "//div[contains(@class, 'rc-select-item-option-content') and text() = '" +
    option +
    "'] | //a[contains(@class, 'single-select')]//div[text()='" +
    option +
    "']";
  _queryTableResponse =
    "//div[@data-guided-tour-id='query-table-response']//div[@class='tbody']//div[@class ='td']";
  _queryResponseHeader = (header: string) =>
    "//div[@data-guided-tour-id='query-table-response']//div[@class='table']//div[@role ='columnheader']//span[text()='" +
    header +
    "']";
  _refreshIcon = "button .bp3-icon-refresh";
  _addIcon = "button .bp3-icon-add";
  _queryError = "[data-testid='t--query-error']";
  _queryEditorTabs = (responseType: string) =>
    "//button[@role='tab' or @role='tablist']//span[text()='" +
    responseType +
    "']";
  _queryResponse = (responseType: string) =>
    "//div[@data-testid='t--response-tab-segmented-control']//span[text()='" +
    responseType +
    "']";
  _queryRecordResult = (recordCount: number) =>
    `//div/span[text()='Result:']/span[number(substring-before(normalize-space(text()), ' Record')) >= ${recordCount}]`;
  _noRecordFound = "span[data-testid='no-data-table-message']";
  _usePreparedStatement =
    "input[name='actionConfiguration.pluginSpecifiedTemplates[0].value'][type='checkbox']";
  _queriesOnPageText = (dsName: string) =>
    ".t--datasource-name:contains('" + dsName + "') .t--queries-for-DB";
  _mockDB = (dbName: string) =>
    "//span[text()='" +
    dbName +
    "']/ancestor::div[contains(@class, 't--mock-datasource')][1]";
  private _createBlankGraphQL = ".t--createBlankApiGraphqlCard";
  private _createBlankCurl = ".t--createBlankCurlCard";
  private _graphQLHeaderKey = "input[name='headers[0].key']";
  private _graphQLHeaderValue = "input[name='headers[0].value']";
  _graphqlQueryEditor = ".t--graphql-query-editor";
  _graphqlVariableEditor = ".t--graphql-variable-editor";
  _graphqlPagination = {
    _limitVariable: ".t--apiFormPaginationLimitVariable .rc-select-selector",
    _limitValue: ".t--apiFormPaginationLimitValue .CodeMirror textarea",
    _offsetVariable: ".t--apiFormPaginationOffsetVariable .rc-select-selector",
    _offsetValue: ".t--apiFormPaginationOffsetValue .CodeMirror textarea",
    _prevLimitVariable: ".t--apiFormPaginationPrevLimitVariable",
    _prevLimitValue: ".t--apiFormPaginationPrevLimitValue .CodeMirror textarea",
    _prevCursorVariable: ".t--apiFormPaginationPrevCursorVariable",
    _prevCursorValue:
      ".t--apiFormPaginationPrevCursorValue .CodeMirror textarea",
    _nextLimitVariable: ".t--apiFormPaginationNextLimitVariable",
    _nextLimitValue: ".t--apiFormPaginationNextLimitValue .CodeMirror textarea",
    _nextCursorVariable: ".t--apiFormPaginationNextCursorVariable",
    _nextCursorValue:
      ".t--apiFormPaginationNextCursorValue .CodeMirror textarea",
  };
  _queryDoc = ".t--datasource-documentation-link";
  _globalSearchModal = ".t--global-search-modal";
  _globalSearchInput = ".t--global-search-input";
  _gsScopeDropdown =
    "[data-testid^='datasourceStorages.'][data-testid$='.datasourceConfiguration.authentication.scopeString']";
  _gsScopeOptions = ".ads-v2-select__dropdown .rc-select-item-option";
  _queryTimeout = "//input[@name='actionConfiguration.timeoutInMillisecond']";
  _getStructureReq = "/api/v1/datasources/*/structure?ignoreCache=true";
  _editDatasourceFromActiveTab = (dsName: string) =>
    ".t--datasource-name:contains('" + dsName + "')";
  private _suggestedWidget = (widgetType: string) =>
    ".t--suggested-widget-" + widgetType + "";

  private _curlTextArea =
    "//label[text()='Paste CURL Code Here']/parent::form/div";
  _noSchemaAvailable = (dbName: string) =>
    "//div[text()='" +
    dbName +
    "']/ancestor::div[contains(@class, 't--entity-item')]/following-sibling::div//p[text()='Schema not available']";
  // Authenticated API locators
  public _authApiDatasource = ".t--createAuthApiDatasource";
  private _authType = "[data-testid=authType]";
  private _oauth2 = ".rc-select-item-option:contains('OAuth 2.0')";
  private _accessTokenUrl =
    "[data-testid='authentication.accessTokenUrl'] input";
  private _scope = "[data-testid='authentication.scopeString'] input";
  private _clientID = "[data-testid='authentication.clientId'] input";
  private _clientSecret = "[data-testid='authentication.clientSecret'] input";
  private _clientCredentails =
    ".rc-select-item-option:contains('Client Credentials')";
  private _authorizationCode =
    ".rc-select-item-option:contains('Authorization Code')";
  private _grantType = "[data-testid='authentication.grantType']";
  private _authorizationURL =
    "[data-testid='authentication.authorizationUrl'] input";
  _consent = '[name="confirm"]';
  _consentSubmit = "//button[text()='Submit']";
  public _datasourceModalSave = ".t--datasource-modal-save";
  public _datasourceModalDoNotSave = ".t--datasource-modal-do-not-save";
  public _cancelEditDatasourceButton = ".t--cancel-edit-datasource";
  public _urlInputControl = "input[name='url']";
  public _mongoCollectionPath = "t--actionConfiguration.formData.collection";
  _getJSONswitchLocator = (fieldName: string) =>
    "//p[contains(text(),'" +
    fieldName +
    "')]/ancestor::div[@class='form-config-top']//button";
  _nestedWhereClauseKey = (index: number) =>
    ".t--actionConfiguration\\.formData\\.where\\.data\\.children\\[" +
    index +
    "\\]\\.key";
  _nestedWhereClauseValue = (index: number) =>
    ".t--actionConfiguration\\.formData\\.where\\.data\\.children\\[" +
    index +
    "\\]\\.value";
  _whereDelete = (index: number) =>
    "[data-testid='t--where-clause-delete-[" + index + "]']";

  _bodyCodeMirror = "//div[contains(@class, 't--actionConfiguration.body')]";
  private _reconnectModalDSToolTip = ".t--ds-list .t--ds-list-title";
  private _reconnectModalDSToopTipIcon = ".t--ds-list .ads-v2-icon";
  _multiSelectDropdown = (ddName: string) =>
    "//p[contains(text(),'" +
    ddName +
    "')]/ancestor::div[@class='form-config-top']/following-sibling::div//div[contains(@class, 'rc-select-multiple')]";
  private _datasourceTableSchemaInQueryEditor = (schemaName: string) =>
    `//div[contains(@class, 'datasourceStructure-query-editor')]//div[contains(@class, 't--entity-name')][text()='${schemaName}']`;
  private _datasourceSchemaRefreshBtn = ".datasourceStructure-refresh";
  private _datasourceStructureHeader = ".datasourceStructure-header";
  private _datasourceColumnSchemaInQueryEditor = ".t--datasource-column";
  private _datasourceStructureSearchInput = ".datasourceStructure-search input";
  _jsModeSortingControl = ".t--actionConfiguration\\.formData\\.sortBy\\.data";
  public _queryEditorCollapsibleIcon = ".collapsible-icon";
  _globalSearchTrigger = ".t--global-search-modal-trigger";
  _globalSearchOptions = ".t--searchHit";
  private _dataSourceInfo = (dsName: string) =>
    "//span[text()='" +
    dsName +
    "']/ancestor::div[contains(@class, 't--datasource')]//div[@data-testid='datasource-collapse-wrapper']";
  _snippingBanner = ".t--sniping-mode-banner";
  _s3CrudIcons = (
    fieldName: string,
    type: "Edit" | "Delete" | "CopyURL" | "Download",
  ) =>
    "//span[text()='" +
    fieldName +
    "']/ancestor::div[@type='CANVAS_WIDGET'][1]//div[@data-widgetname-cy='" +
    type +
    "Icon']";
  _s3EditFileName =
    "[data-widgetname-cy='update_file_name'] div[data-testid='input-container']";
  _s3MaxFileSizeAlert = "//p[@role='alert']";

  public AssertDSEditViewMode(mode: "Edit" | "View") {
    if (mode == "Edit") this.agHelper.AssertElementAbsence(this._editButton);
    else if (mode == "View") this.agHelper.AssertElementExist(this._editButton);
  }

  public GeneratePageWithDB(datasourceName: any, tableName: string) {
    this.entityExplorer.AddNewPage("Generate page with data");
    this.agHelper.GetNClick(this._selectDatasourceDropdown);
    this.agHelper.GetNClickByContains(
      this.locator._dropdownText,
      datasourceName,
    );
    this.agHelper.GetNClick(this._selectTableDropdown, 0, true);
    cy.get(
      `div[role="listbox"] p[kind="span"]:contains("${tableName}")`,
    ).click();
    this.agHelper.GetNClick(this._generatePageBtn);
    this.assertHelper.AssertNetworkStatus("@replaceLayoutWithCRUDPage", 201);
    this.agHelper.GetNClick(this.locator._visibleTextSpan("Got it"));
  }

  public GeneratePageWithMockDB() {
    this.entityExplorer.AddNewPage("Generate page with data");
    this.agHelper.GetNClick(this._selectDatasourceDropdown);
    this.agHelper.GetNClickByContains(
      this._dropdownOption,
      "Connect new datasource",
    );
    this.agHelper.GetNClick(this._mockDB("Users"));
    this.agHelper.Sleep(500);
    this.assertHelper.AssertNetworkStatus("@getDatasourceStructure"); //Making sure table dropdown is populated
    this.agHelper.GetNClick(this._selectTableDropdown, 0, true);
    this.agHelper.GetNClickByContains(this._dropdownOption, "public.users");
    this.agHelper.GetNClick(this._generatePageBtn);
    this.assertHelper.AssertNetworkStatus("@replaceLayoutWithCRUDPage", 201);
    this.agHelper.GetNClick(this.locator._visibleTextSpan("Got it"));
  }

  public StartDataSourceRoutes() {
    cy.intercept("POST", "/api/v1/datasources").as("saveDatasource");
    cy.intercept("POST", "/api/v1/datasources/test").as("testDatasource");
    cy.intercept("PUT", "/api/v1/datasources/*").as("updateDatasource");
  }

  private ReplaceApplicationIdForInterceptPages(fixtureFile: any) {
    let currentAppId, currentURL;
    cy.readFile(
      fixtureFile,
      // (err: string) => {
      // if (err) {
      //   return console.error(err);
      // }}
    ).then((data) => {
      cy.url().then((url) => {
        currentURL = url;
        const myRegexp = /applications(.*)/;
        const match = myRegexp.exec(currentURL);
        cy.log(currentURL + "currentURL from intercept is");
        currentAppId = match ? match[1].split("/")[1] : null;
        data.data.page.applicationId = currentAppId;
        cy.writeFile(fixtureFile, JSON.stringify(data));
      });
    });
  }

  public StartInterceptRoutesForMySQL() {
    //All stubbing - updating app id to current app id for Delete app by api call to be successfull:

    this.ReplaceApplicationIdForInterceptPages(
      "cypress/fixtures/mySQL_PUT_replaceLayoutWithCRUD.json",
    );

    cy.intercept("POST", "/api/v1/datasources/test", {
      fixture: "testAction.json",
    }).as("testDatasource");
    cy.intercept("GET", "/api/v1/datasources/*/structure?ignoreCache=*", {
      fixture: "mySQL_GET_selectTableDropdown.json",
    }).as("getDatasourceStructure");
    cy.intercept("PUT", "/api/v1/pages/crud-page/*", {
      fixture: "mySQL_PUT_replaceLayoutWithCRUD.json",
    }).as("replaceLayoutWithCRUDPage");
    cy.intercept("GET", "/api/v1/actions*", {
      fixture: "mySQL_GET_Actions.json",
    }).as("getActions");
    cy.intercept("POST", "/api/v1/actions/execute", {
      fixture: "mySQL_POST_Execute.json",
    }).as("postExecute");
    cy.intercept("POST", "/api/v1/pages/crud-page", {
      fixture: "mySQL_PUT_replaceLayoutWithCRUD.json",
    }).as("replaceLayoutWithCRUDPage");
  }

  public StartInterceptRoutesForMongo() {
    //All stubbing
    this.ReplaceApplicationIdForInterceptPages(
      "cypress/fixtures/mongo_PUT_replaceLayoutWithCRUD.json",
    );

    cy.intercept("POST", "/api/v1/datasources/test", {
      fixture: "testAction.json",
    }).as("testDatasource");
    cy.intercept("GET", "/api/v1/datasources/*/structure?ignoreCache=*", {
      fixture: "mongo_GET_selectTableDropdown.json",
    }).as("getDatasourceStructure");
    cy.intercept("PUT", "/api/v1/pages/crud-page/*", {
      fixture: "mongo_PUT_replaceLayoutWithCRUD.json",
    }).as("replaceLayoutWithCRUDPage");
    cy.intercept("GET", "/api/v1/actions*", {
      fixture: "mongo_GET_Actions.json",
    }).as("getActions");
    cy.intercept("POST", "/api/v1/actions/execute", {
      fixture: "mongo_POST_Actions.json",
    }).as("postExecute");
    cy.intercept("POST", "/api/v1/pages/crud-page", {
      fixture: "mongo_PUT_replaceLayoutWithCRUD.json",
    }).as("post_replaceLayoutCRUDStub");
  }

  public StartInterceptRoutesForFirestore() {
    //All stubbing
    cy.intercept("POST", "/api/v1/datasources/test", {
      fixture: "testAction.json",
    }).as("testDatasource");
  }

  public CreatePlugIn(pluginName: string, waitForToastDisappear = false) {
    cy.get(this._createNewPlgin(pluginName))
      .parent("div")
      .trigger("click", { force: true });
    this.agHelper.Sleep();
    //this.agHelper.WaitUntilEleAppear(this.locator._toastMsg);
    this.agHelper.AssertElementAbsence(
      this.locator._specificToast("Duplicate key error"),
    );
    this.agHelper.PressEscape();
    // if (waitForToastDisappear)
    //   this.agHelper.WaitUntilToastDisappear("datasource created");
    // else this.agHelper.AssertContains("datasource created");
  }

  public EditDatasource() {
    this.agHelper.GetNClick(this._editButton);
  }

  public NavigateToDSCreateNew() {
    this.entityExplorer.HoverOnEntityItem("Datasources");
    Cypress._.times(2, () => {
      this.agHelper.GetNClick(this._addNewDataSource, 0, true);
      this.agHelper.Sleep();
    });
    this.agHelper.RemoveTooltip("Add a new datasource");
    cy.get(this._newDatasourceContainer).scrollTo("bottom", {
      ensureScrollable: false,
    });
    cy.get(this._newDatabases).should("be.visible");
  }

  CreateMockDB(dbName: "Users" | "Movies"): Cypress.Chainable<string> {
    this.NavigateToDSCreateNew();
    this.agHelper.GetNClick(this._mockDB(dbName));
    this.assertHelper.AssertNetworkStatus("@getMockDb"); //To return the right mock DB name
    return cy
      .get("@getMockDb")
      .then(($createdMock: any) => $createdMock.response?.body.data.name);
  }

  public FillPostgresDSForm(
    environment = this.dataManager.defaultEnviorment,
    shouldAddTrailingSpaces = false,
    username = "",
    password = "",
  ) {
    const hostAddress = shouldAddTrailingSpaces
      ? this.dataManager.dsValues[environment].postgres_host + "  "
      : this.dataManager.dsValues[environment].postgres_host;
    const databaseName = shouldAddTrailingSpaces
      ? this.dataManager.dsValues[environment].postgres_databaseName + "  "
      : this.dataManager.dsValues[environment].postgres_databaseName;
    this.agHelper.UpdateInputValue(
      this._port,
      this.dataManager.dsValues[environment].postgres_port.toString(),
    );
    this.agHelper.UpdateInputValue(this._host, hostAddress);
    this.agHelper.ClearNType(this._databaseName, databaseName);
    cy.get(this._username).type(
      username == ""
        ? this.dataManager.dsValues[environment].postgres_username
        : username,
    );
    cy.get(this._password).type(
      password == ""
        ? this.dataManager.dsValues[environment].postgres_password
        : password,
    );
    this.ValidateNSelectDropdown("SSL mode", "Default");
  }

  public ValidatePostgresDSForm(
    environment = this.dataManager.defaultEnviorment,
  ) {
    const databaseName =
      this.dataManager.dsValues[environment].postgres_databaseName;
    this.agHelper.AssertContains(databaseName, "exist", this._dsReviewSection);
  }

  public ValidateMongoForm(environment = this.dataManager.defaultEnviorment) {
    const databaseName =
      this.dataManager.dsValues[environment].mongo_databaseName;
    this.agHelper.AssertContains(this._dsReviewSection, databaseName);
  }

  public FillOracleDSForm(
    environment = this.dataManager.defaultEnviorment,
    shouldAddTrailingSpaces = false,
    username = "",
    password = "",
  ) {
    const hostAddress = shouldAddTrailingSpaces
      ? this.dataManager.dsValues[environment].oracle_host + "  "
      : this.dataManager.dsValues[environment].oracle_host;
    const databaseName = shouldAddTrailingSpaces
      ? this.dataManager.dsValues[environment].oracle_name + "  "
      : this.dataManager.dsValues[environment].oracle_name;
    this.agHelper.UpdateInputValue(this._host, hostAddress);
    this.agHelper.UpdateInputValue(
      this._port,
      this.dataManager.dsValues[environment].oracle_port.toString(),
    );
    cy.get(this._databaseName).clear().type(databaseName);
    cy.get(this._username).type(
      username == ""
        ? this.dataManager.dsValues[environment].oracle_username
        : username,
    );
    cy.get(this._password).type(
      password == ""
        ? this.dataManager.dsValues[environment].oracle_password
        : password,
    );
  }

  public FillMongoDSForm(
    environment = this.dataManager.defaultEnviorment,
    shouldAddTrailingSpaces = false,
  ) {
    const hostAddress = shouldAddTrailingSpaces
      ? this.dataManager.dsValues[environment].mongo_host + "  "
      : this.dataManager.dsValues[environment].mongo_host;
    this.agHelper.UpdateInputValue(this._host, hostAddress);
    this.agHelper.UpdateInputValue(
      this._port,
      this.dataManager.dsValues[environment].mongo_port.toString(),
    );
    this.agHelper.ClearNType(
      this._databaseName,
      this.dataManager.dsValues[environment].mongo_databaseName,
    );
  }

  public FillMySqlDSForm(
    environment = this.dataManager.defaultEnviorment,
    shouldAddTrailingSpaces = false,
  ) {
    const hostAddress = shouldAddTrailingSpaces
      ? this.dataManager.dsValues[environment].mysql_host + "  "
      : this.dataManager.dsValues[environment].mysql_host;
    const databaseName = shouldAddTrailingSpaces
      ? this.dataManager.dsValues[environment].mysql_databaseName + "  "
      : this.dataManager.dsValues[environment].mysql_databaseName;

    this.agHelper.UpdateInputValue(this._host, hostAddress);
    this.agHelper.UpdateInputValue(
      this._port,
      this.dataManager.dsValues[environment].mysql_port.toString(),
    );
    this.agHelper.ClearNType(this._databaseName, databaseName);
    this.agHelper.UpdateInputValue(
      this._username,
      this.dataManager.dsValues[environment].mysql_username,
    );
    cy.get(this._password).type(
      this.dataManager.dsValues[environment].mysql_password,
    );
  }

  public FillMsSqlDSForm(environment = this.dataManager.defaultEnviorment) {
    this.agHelper.UpdateInputValue(
      this._host,
      this.dataManager.dsValues[environment].mssql_host,
    );
    this.agHelper.UpdateInputValue(
      this._port,
      this.dataManager.dsValues[environment].mssql_port.toString(),
    );
    this.agHelper.ClearTextField(this._databaseName);
    // this.agHelper.UpdateInputValue(
    //   this._databaseName,
    //   datasourceFormData["mssql-databaseName"],
    // ); //Commenting until MsSQL is init loaded into container
    this.agHelper.UpdateInputValue(
      this._username,
      this.dataManager.dsValues[environment].mssql_username,
    );
    this.agHelper.UpdateInputValue(
      this._password,
      this.dataManager.dsValues[environment].mssql_password,
    );
  }

  public FillAirtableDSForm() {
    this.ValidateNSelectDropdown(
      "Authentication type",
      "Please select an option",
      "Personal access token",
    );
    this.agHelper.TypeText(
      this.locator._inputFieldByName("Bearer token") +
        "//" +
        this.locator._inputField,
      Cypress.env("AIRTABLE_BEARER"),
    );
    this.agHelper.Sleep();
  }

  public FillArangoDSForm(environment = this.dataManager.defaultEnviorment) {
    this.agHelper.UpdateInputValue(
      this._host,
      this.dataManager.dsValues[environment].arango_host,
    );
    this.agHelper.UpdateInputValue(
      this._port,
      this.dataManager.dsValues[environment].arango_port.toString(),
    );
    //Validating db name is _system, currently unable to create DB via curl in Arango
    this.agHelper
      .GetText(this._databaseName, "val")
      .then(($dbName) => expect($dbName).to.eq("_system"));
    this.agHelper.UpdateInputValue(
      this._username,
      this.dataManager.dsValues[environment].arango_username,
    );
    this.agHelper.UpdateInputValue(
      this._password,
      this.dataManager.dsValues[environment].arango_password,
    );
  }

  public FillCurlNImport(value: string) {
    this.NavigateToDSCreateNew();
    this.agHelper.GetNClick(this._createBlankCurl);
    this.ImportCurlNRun(value);
  }

  public ImportCurlNRun(value: string) {
    this.agHelper.UpdateTextArea(this._curlTextArea, value);
    this.agHelper.Sleep(500); //Clicking import after value settled
    this.agHelper.ClickButton("Import");
    this.apiPage.RunAPI();
  }

  public FillFirestoreDSForm(environment = this.dataManager.defaultEnviorment) {
    this.agHelper.TypeText(
      this.locator._inputFieldByName("Database URL") +
        "//" +
        this.locator._inputField,
      this.dataManager.dsValues[environment].firestore_database_url,
    );
    this.agHelper.TypeText(
      this.locator._inputFieldByName("Project Id") +
        "//" +
        this.locator._inputField,
      this.dataManager.dsValues[environment].firestore_projectID,
    );
    // cy.fixture("firestore-ServiceAccCreds").then((json: any) => {
    //   let ServiceAccCreds = JSON.parse(
    //     JSON.stringify(json.serviceAccCredentials),
    //   );
    //   ServiceAccCreds.private_key = Cypress.env("FIRESTORE_PRIVATE_KEY");
    //   //cy.log("ServiceAccCreds is " + JSON.stringify(ServiceAccCreds));
    //   cy.log(
    //     "ServiceAccCreds.private_key  is " +
    //       JSON.stringify(ServiceAccCreds.private_key),
    //   );
    this.agHelper.UpdateFieldInput(
      this.locator._inputFieldByName("Service account credentials"),
      JSON.stringify(Cypress.env("FIRESTORE_PRIVATE_KEY")),
    );
    //});
  }

  public FillElasticSearchDSForm(
    environment = this.dataManager.defaultEnviorment,
  ) {
    this.agHelper.UpdateInputValue(
      this._host,
      this.dataManager.dsValues[environment].elastic_host,
    );
    this.agHelper.UpdateInputValue(
      this._port,
      this.dataManager.dsValues[environment].elastic_port.toString(),
    );
    this.agHelper.UpdateInputValue(
      this._username,
      this.dataManager.dsValues[environment].elastic_username,
    );
    this.agHelper.UpdateInputValue(
      this._password,
      this.dataManager.dsValues[environment].elastic_password,
    );
  }

  public FillUnAuthenticatedGraphQLDSForm(
    environment = this.dataManager.defaultEnviorment,
  ) {
    this.agHelper.GetNClick(this._createBlankGraphQL);
    this.apiPage.EnterURL(
      this.dataManager.dsValues[environment].GraphqlApiUrl_TED,
    );
    this.assertHelper.AssertNetworkStatus("@createNewApi", 201);
  }

  public CreateNFillAuthenticatedGraphQLDSForm(
    dataSourceName: string,
    hKey: string,
    hValue: string,
    environment = this.dataManager.defaultEnviorment,
  ) {
    this.NavigateToDSCreateNew();
    this.CreatePlugIn("Authenticated GraphQL API");
    this.agHelper.TypeText(
      this.locator._inputFieldByName("URL") + "//" + this.locator._inputField,
      this.dataManager.dsValues[environment].GraphqlApiUrl_TED,
    );

    this.agHelper.UpdateInputValue(this._graphQLHeaderKey, hKey);
    this.agHelper.UpdateInputValue(this._graphQLHeaderValue, hValue);
    cy.get("@guid").then((uid: any) => {
      dataSourceName = dataSourceName + " " + uid;
      this.agHelper.RenameWithInPane(dataSourceName, false);
      this.SaveDatasource();
      cy.wrap(dataSourceName).as("dsName");
    });
  }

  public FillRedisDSForm(environment = this.dataManager.defaultEnviorment) {
    this.agHelper.UpdateInputValue(
      this._host,
      this.dataManager.dsValues[environment].redis_host,
    );
    this.agHelper.UpdateInputValue(
      this._port,
      this.dataManager.dsValues[environment].redis_port.toString(),
    );
  }

  public FillS3DSForm() {
    this.agHelper.UpdateInputValue(
      this._username,
      Cypress.env("S3_ACCESS_KEY"),
    );
    this.agHelper.UpdateInputValue(
      this._password,
      Cypress.env("S3_SECRET_KEY"),
    );
  }

  public fillTwilioDSForm(environment = this.dataManager.defaultEnviorment) {
    this.ValidateNSelectDropdown("Authentication type", "", "Basic auth");
    this.agHelper.UpdateInputValue(
      this._username,
      this.dataManager.dsValues[environment].twilio_username.toString(),
    );
    this.agHelper.UpdateInputValue(
      this._password,
      this.dataManager.dsValues[environment].twilio_password.toString(),
    );
  }

  public TestSaveDatasource(expectedRes = true, isForkModal = false) {
    this.TestDatasource(expectedRes);
    this.SaveDatasource(isForkModal);
  }

  public TestDatasource(expectedRes = true) {
    this.agHelper.Sleep(500); //bit of time for CI!
    this.agHelper.GetNClick(this._testDs, 0, false, 0);
    this.agHelper.AssertNetworkDataSuccess("@testDatasource", expectedRes);
    if (expectedRes) {
      this.agHelper.AssertContains("datasource is valid");
    }
  }

  public SaveDatasource(isForkModal = false, isSavingEnvInOldDS = false) {
    this.agHelper.Sleep(500); //bit of time for CI!
    this.agHelper.GetNClick(this._saveDs);
    if (!isForkModal) {
      this.assertHelper.AssertNetworkStatus("@saveDatasource", 201);
      if (!isSavingEnvInOldDS)
        this.agHelper.AssertContains("datasource created");
    } else {
      this.assertHelper.AssertNetworkStatus("@updateDatasource", 200);
    }

    // cy.wait("@saveDatasource")
    //     .then((xhr) => {
    //         cy.log(JSON.stringify(xhr.response!.body));
    //     }).should("have.nested.property", "response.body.responseMeta.status", 200);
  }

  public AuthAPISaveAndAuthorize() {
    cy.get(this._saveAndAuthorizeDS).click();
    this.assertHelper.AssertNetworkStatus("@saveDatasource", 201);
  }

  public UpdateDatasource() {
    this.agHelper.GetNClick(this._saveDs);
    // this.assertHelper.AssertNetworkStatus("@updateDatasource", 200);
    this.agHelper.AssertContains("datasource updated");
  }

  public ClickActiveTabDSContextMenu(datasourceName: string) {
    this.NavigateToActiveTab();
    cy.get(this._datasourceCard)
      .contains(datasourceName)
      .parents(this._datasourceCard)
      .find(this._dsMenuoptions)
      .scrollIntoView()
      .should("be.visible")
      .click();
  }

  public DeleteDatasouceFromActiveTab(
    datasourceName: string,
    expectedRes = 200 || 409 || [200 | 409],
  ) {
    this.ClickActiveTabDSContextMenu(datasourceName);
    this.agHelper.GetNClick(this._dsOptionMenuItem("Delete"), 0, false, 200);
    this.agHelper.GetNClick(this._dsOptionMenuItem("Are you sure?"));
    this.ValidateDSDeletion(expectedRes);
  }

  public DeleteDatasouceFromWinthinDS(
    datasourceName: string,
    expectedRes: number | number[] = 200 || 409 || [200 | 409],
  ) {
    this.NavigateToActiveTab();
    cy.get(this._datasourceCard)
      .contains(datasourceName)
      .scrollIntoView()
      .should("be.visible")
      .click();
    this.agHelper.Sleep(); //for the Datasource page to open
    this.DeleteDSDirectly(expectedRes);
  }

  // this initiates saving via the cancel button.
  public cancelDSEditAndAssertModalPopUp(
    shouldPopUpBeShown = false,
    shouldSave = false,
  ) {
    // click cancel button.
    this.agHelper.GetNClick(this._cancelEditDatasourceButton, 0, false, 200);

    if (shouldPopUpBeShown) {
      this.AssertDatasourceSaveModalVisibilityAndSave(shouldSave);
    } else {
      this.AssertDSDialogVisibility(false);
    }
  }

  public DeleteDSDirectly(
    expectedRes: number | number[] = 200 || 409 || [200 | 409],
    toNavigateToDSInfoPage = true,
  ) {
    toNavigateToDSInfoPage &&
      this.agHelper.GetNClick(this._cancelEditDatasourceButton, 0, true, 200);
    this.agHelper.GetNClick(this._contextMenuDSReviewPage);
    this.agHelper.GetNClick(this._contextMenuDelete);
    this.agHelper.GetNClick(this.locator._visibleTextSpan("Are you sure?"));
    this.ValidateDSDeletion(expectedRes);
  }

  public DeleteDSFromEntityExplorer(
    dsName: string,
    expectedRes: number | number[] = 200,
  ) {
    this.entityExplorer.SelectEntityByName(dsName, "Datasources");
    this.entityExplorer.ActionContextMenuByEntityName({
      entityNameinLeftSidebar: dsName,
      action: "Delete",
      entityType: EntityItems.Datasource,
    });
    this.ValidateDSDeletion(expectedRes);
  }

  public ValidateDSDeletion(expectedRes: number | number[] = 200) {
    let toValidateRes = expectedRes == 200 || expectedRes == 409 ? true : false;
    if (toValidateRes) {
      if (expectedRes == 200)
        this.agHelper.AssertContains("datasource deleted successfully");
      else this.agHelper.AssertContains("action(s) using it.");
      this.assertHelper.AssertNetworkStatus(
        "@deleteDatasource",
        expectedRes as number,
      );
    } else {
      cy.wait("@deleteDatasource")
        .its("response.body.responseMeta.status")
        .should("be.oneOf", [200, 409]);
    }
  }

  public NavigateToActiveTab() {
    this.agHelper.GetElement(this.locator._body).then(($body) => {
      if ($body.find(this._selectedActiveTab).length == 0) {
        this.NavigateToDSCreateNew();
        this.agHelper.GetNClick(this._activeTab, 0, true);
      }
    });
  }

  public NavigateFromActiveDS(
    datasourceName: string,
    createQuery: boolean,
    validateTableDropdown = true,
  ) {
    const btnLocator =
      createQuery == true
        ? this._createQuery
        : this._datasourceCardGeneratePageBtn;

    this.AssertDSActive(new RegExp("^" + datasourceName + "$")) //This regex is to exact match the datasource name
      .scrollIntoView()
      .should("be.visible")
      .then(($element) => {
        cy.wrap($element)
          .closest(this._datasourceCard)
          .within(() => {
            this.agHelper.GetNClick(btnLocator, 0, true);
          });
      });
    this.agHelper.Sleep(3000); //for the CreateQuery/GeneratePage page to load
    createQuery && this.AssertRunButtonVisibility();
    validateTableDropdown &&
      !createQuery &&
      this.assertHelper.AssertNetworkStatus("@getDatasourceStructure", 200); //Making sure table dropdown is populated
  }

  public AssertDSActive(dsName: string | RegExp) {
    this.entityExplorer.NavigateToSwitcher("Explorer", 0, true);
    this.entityExplorer.ExpandCollapseEntity("Datasources", false);
    //this.entityExplorer.SelectEntityByName(datasourceName, "Datasources");
    //this.entityExplorer.ExpandCollapseEntity(datasourceName, false);
    this.NavigateToActiveTab();
    return this.agHelper.GetNAssertContains(this._datasourceCard, dsName);
  }

  public CreateQueryFromActiveTab(
    datasourceName: string,
    toNavigateToActive = true,
  ) {
    if (toNavigateToActive) this.NavigateToActiveTab();
    cy.get(this._datasourceCard, { withinSubject: null })
      .find(this._activeDS)
      .contains(new RegExp("^" + datasourceName + "$")) //This regex is to exact match the datasource name
      .scrollIntoView()
      .should("be.visible")
      .closest(this._datasourceCard)
      .scrollIntoView()
      .within(() => {
        this.agHelper.GetNClick(this._createQuery, 0, true);
      });
    this.agHelper.Sleep(2000); //for the CreateQuery
    //this.assertHelper.AssertNetworkStatus("@createNewApi", 201);//throwing 404 in CI sometimes
    this.AssertRunButtonVisibility();
  }

  CreateQueryAfterDSSaved(query = "", queryName = "") {
    this.agHelper.GetNClick(this._createQuery);
    //this.assertHelper.AssertNetworkStatus("@createNewApi", 201);
    this.AssertRunButtonVisibility();
    if (queryName) this.agHelper.RenameWithInPane(queryName);
    if (query) {
      this.EnterQuery(query);
      this.AssertRunButtonDisability(false);
    }
  }

  private AssertRunButtonVisibility() {
    this.agHelper.AssertElementVisibility(
      this.locator._buttonByText("Run"),
      true,
      0,
      20000,
    );
  }

  public CreateQueryForDS(
    datasourceName: string,
    query = "",
    queryName = "",
    cancelEditDs = true,
  ) {
    this.NavigateToActiveTab();
    cy.get(this._datasourceCard)
      .contains(new RegExp("^" + datasourceName + "$")) //This regex is to exact match the datasource name
      .scrollIntoView()
      .should("be.visible")
      .click();
    this.agHelper.Sleep(); //for the Datasource page to open
    if (cancelEditDs) {
      this.agHelper.GetNClick(this._cancelEditDatasourceButton, 0, true, 200);
    }
    this.CreateQueryAfterDSSaved(query, queryName);
  }

  DeleteQuery(queryName: string) {
    this.entityExplorer.ExpandCollapseEntity("Queries/JS");
    this.entityExplorer.ActionContextMenuByEntityName({
      entityNameinLeftSidebar: queryName,
      action: "Delete",
      entityType: EntityItems.Query,
    });
  }

  public ValidateNSelectDropdown(
    ddTitle: string,
    currentValue: string,
    newValue = "",
  ) {
    if (currentValue)
      cy.xpath(this._visibleTextSpan(currentValue))
        //.scrollIntoView()
        .should("exist", currentValue + " dropdown value not present");
    if (newValue != "") {
      this.agHelper.GetNClick(this._dropdownTitle(ddTitle));
      //cy.xpath(this._dropdown(currentValue)).last().click({ force: true });
      //to expand the dropdown
      //this.agHelper.GetNClick(this._queryOption(newValue))
      cy.xpath(this._queryOption(newValue)).last().click({ force: true }); //to select the new value
    }
  }

  public ValidateReviewModeConfig(
    dsName: "PostgreSQL" | "MongoDB",
    environment = this.dataManager.defaultEnviorment,
  ) {
    if (dsName === "PostgreSQL") {
      this.ValidatePostgresDSForm(environment);
    } else if (dsName === "MongoDB") {
      this.ValidateMongoForm(environment);
    }
  }

  public ReconnectSingleDSNAssert(
    dbName: string,
    dsName: "PostgreSQL" | "MySQL" | "MongoDB",
  ) {
    this.ReconnectModalValidation(dbName, dsName);
    this.ValidateNSelectDropdown("Connection mode", "Read / Write");
    if (dsName == "PostgreSQL") this.FillPostgresDSForm();
    else if (dsName == "MySQL") this.FillMySqlDSForm();
    else if (dsName == "MongoDB") this.FillMongoDSForm();
    this.SaveDatasource(true);
    this.assertHelper.AssertNetworkStatus("@getPage", 200);
    this.assertHelper.AssertNetworkStatus("getWorkspace");
  }

  public AssertReconnectDS(datasourceName: string) {
    cy.get(this._datasourceCard, { withinSubject: null })
      .find(this._activeDS)
      .contains(datasourceName)
      .scrollIntoView()
      .should("be.visible")
      .closest(this._datasourceCard)
      .scrollIntoView()
      .within(() => {
        this.agHelper.AssertElementVisibility(this._reconnect, true, 0, 20000);
      });
  }
  public ReconnectModalValidation(
    dbName: string,
    dsName: "PostgreSQL" | "MySQL" | "MongoDB",
  ) {
    this.WaitForReconnectModalToAppear();
    this.agHelper.AssertElementVisibility(
      this._activeDSListReconnectModal(dsName),
    );
    this.agHelper.AssertElementVisibility(
      this._activeDSListReconnectModal(dbName),
    );

    //Checking if tooltip for Ds name & icon is present (useful in cases of long name for ds)
    this.agHelper.AssertText(this._reconnectModalDSToolTip, "text", dbName);
    this.agHelper.AssertElementVisibility(this._reconnectModalDSToopTipIcon);
  }

  public WaitForReconnectModalToAppear() {
    this.agHelper.AssertElementVisibility(this._reconnectModal);
    this.agHelper.AssertElementVisibility(this._testDs); //Making sure modal is fully loaded
  }

  public ReconnectDSbyType(
    dsName: "PostgreSQL" | "MySQL" | "MongoDB" | "S3" | "MongoDBUri",
  ) {
    this.WaitForReconnectModalToAppear();

    if (dsName !== "MongoDBUri")
      this.agHelper.GetNClick(this.locator._visibleTextSpan(dsName));
    else if (dsName == "MongoDBUri")
      this.agHelper.GetNClick(this.locator._visibleTextSpan("MongoDB"));

    const methodMap = {
      PostgreSQL: this.FillPostgresDSForm,
      MySQL: this.FillMySqlDSForm,
      MongoDB: this.FillMongoDSForm,
      S3: this.FillS3DSForm,
      MongoDBUri: this.FillMongoDatasourceFormWithURI,
    };
    if (methodMap[dsName]) {
      methodMap[dsName].call(this);
    }
    this.SaveDatasource(true);
  }

  RunQuery({
    expectedStatus = true,
    toValidateResponse = true,
    waitTimeInterval = 500,
  }: Partial<RunQueryParams> = {}) {
    this.AssertRunButtonDisability(false);
    this.agHelper.GetNClick(this._runQueryBtn, 0, true, waitTimeInterval);
    this.agHelper.AssertElementAbsence(
      this.locator._cancelActionExecution,
      10000,
    ); //For the run to give response
    if (toValidateResponse) {
      this.agHelper.Sleep();
      this.assertHelper.AssertNetworkExecutionSuccess(
        "@postExecute",
        expectedStatus,
      );
    }
  }

  AssertRunButtonDisability(disabled = false) {
    this.agHelper.AssertElementEnabledDisabled(this._runQueryBtn, 0, disabled);
  }

  public ReadQueryTableResponse(index: number, timeout = 100) {
    //timeout can be sent higher values incase of larger tables
    this.agHelper.Sleep(timeout); //Settling time for table!
    return cy.xpath(this._queryTableResponse).eq(index).invoke("text");
  }

  public AssertQueryTableResponse(
    index: number,
    expectedValue: string,
    timeout = 100,
  ) {
    this.ReadQueryTableResponse(index, timeout).then(($cellData: any) => {
      expect($cellData).to.eq(expectedValue);
    });
  }

  public AssertQueryResponseHeaders(columnHeaders: string[]) {
    columnHeaders.forEach(($header) =>
      this.agHelper.AssertElementVisibility(this._queryResponseHeader($header)),
    );
  }

  public AssertJSONFormHeader(
    rowindex: number,
    colIndex: number,
    headerString: string,
    validateCellData: "" | string = "",
    isMongo = false,
  ) {
    let jsonHeaderString = "";
    this.table.ReadTableRowColumnData(rowindex, colIndex).then(($cellData) => {
      if (validateCellData) expect($cellData).to.eq(validateCellData);

      jsonHeaderString =
        isMongo == true
          ? "Update Document " + headerString + ": " + $cellData
          : "Update Row " + headerString + ": " + $cellData;
      this.agHelper
        .GetText(this.locator._jsonFormHeader)
        .then(($header: any) => expect($header).to.eq(jsonHeaderString));
    });
  }

  public ToggleUsePreparedStatement(enable = true || false) {
    if (enable)
      cy.get(this._usePreparedStatement).check({
        force: true,
      });
    else
      cy.get(this._usePreparedStatement).uncheck({
        force: true,
      });

    this.agHelper.AssertAutoSave();
  }

  public EnterQuery(query: string, sleep = 500, toVerifySave = true) {
    this.agHelper.UpdateCodeInput(
      this.locator._codeEditorTarget,
      query,
      "query",
    );
    toVerifySave && this.agHelper.AssertAutoSave();
    this.agHelper.Sleep(sleep); //waiting a bit before proceeding!
    this.assertHelper.AssertNetworkStatus("@saveAction", 200);
  }

  public RunQueryNVerifyResponseViews(
    expectedRecordsCount = 1,
    tableCheck = true,
  ) {
    this.RunQuery();
    tableCheck &&
      this.agHelper.AssertElementVisibility(this._queryResponse("TABLE"));
    this.agHelper.AssertElementVisibility(this._queryResponse("JSON"));
    this.agHelper.AssertElementVisibility(this._queryResponse("RAW"));
    this.CheckResponseRecordsCount(expectedRecordsCount);
  }

  public CheckResponseRecordsCount(expectedRecordCount: number) {
    this.agHelper.AssertElementVisibility(
      this._queryRecordResult(expectedRecordCount),
    );
  }

  public CreateDataSource(
    dsType:
      | "Postgres"
      | "Mongo"
      | "MySql"
      | "UnAuthenticatedGraphQL"
      | "MsSql"
      | "Airtable"
      | "ArangoDB"
      | "Firestore"
      | "Elasticsearch"
      | "Redis"
      | "Oracle"
      | "S3"
      | "Twilio",
    navigateToCreateNewDs = true,
    testNSave = true,
    environment = this.dataManager.defaultEnviorment,
    assetEnvironmentSelected = false,
    // function to be executed before filling the datasource form
    preDSConfigAction?: (arg?: string) => void,
  ) {
    let guid: any;
    let dataSourceName = "";
    this.agHelper.GenerateUUID();
    navigateToCreateNewDs && this.NavigateToDSCreateNew();

    cy.get("@guid").then((uid) => {
      if (DataSourceKVP[dsType] != "GraphQL API") {
        this.CreatePlugIn(DataSourceKVP[dsType]);
        guid = uid;
        dataSourceName = dsType + " " + guid;
        this.agHelper.RenameWithInPane(dataSourceName, false);
        // Execute the preDSConfigAction if it is defined
        if (!!preDSConfigAction) {
          preDSConfigAction.bind(this)(environment);
        }
        if (assetEnvironmentSelected) {
          this.agHelper.AssertSelectedTab(
            this.locator.ds_editor_env_filter(environment),
            "true",
          );
        }
        if (DataSourceKVP[dsType] == "PostgreSQL")
          this.FillPostgresDSForm(environment);
        else if (DataSourceKVP[dsType] == "Oracle")
          this.FillOracleDSForm(environment);
        else if (DataSourceKVP[dsType] == "MySQL")
          this.FillMySqlDSForm(environment);
        else if (DataSourceKVP[dsType] == "MongoDB")
          this.FillMongoDSForm(environment);
        else if (DataSourceKVP[dsType] == "Microsoft SQL Server")
          this.FillMsSqlDSForm(environment);
        else if (DataSourceKVP[dsType] == "Airtable") this.FillAirtableDSForm();
        else if (DataSourceKVP[dsType] == "ArangoDB")
          this.FillArangoDSForm(environment);
        else if (DataSourceKVP[dsType] == "Firestore")
          this.FillFirestoreDSForm(environment);
        else if (DataSourceKVP[dsType] == "Elasticsearch")
          this.FillElasticSearchDSForm(environment);
        else if (DataSourceKVP[dsType] == "Redis")
          this.FillRedisDSForm(environment);
        else if (DataSourceKVP[dsType] == "S3") this.FillS3DSForm();
        else if (DataSourceKVP[dsType] == "Twilio") this.fillTwilioDSForm();

        if (testNSave) {
          this.TestSaveDatasource();
        } else {
          this.SaveDatasource();
        }
      } else if (DataSourceKVP[dsType] == "GraphQL API")
        this.FillUnAuthenticatedGraphQLDSForm(environment);
      cy.wrap(dataSourceName).as("dsName");
    });
  }

  public CreateQueryFromOverlay(
    dsName: string,
    query = "",
    queryName = "",
    sleep = 500,
  ) {
    this.agHelper.RemoveEvaluatedPopUp(); //to close the evaluated pop-up
    this.entityExplorer.CreateNewDsQuery(dsName);
    if (query) {
      this.EnterQuery(query, sleep);
    }
    if (queryName) this.agHelper.RenameWithInPane(queryName);
  }

  public UpdateGraphqlQueryAndVariable(options?: {
    query?: string;
    variable?: string;
  }) {
    if (options?.query) {
      this.agHelper.UpdateCodeInput(this._graphqlQueryEditor, options.query);
    }

    if (options?.variable) {
      this.agHelper.UpdateCodeInput(
        this._graphqlVariableEditor,
        options.variable as string,
      );
    }

    this.agHelper.Sleep();
  }

  public UpdateGraphqlPaginationParams(options: {
    limit?: {
      variable: string;
      value: any;
    };
    offset?: {
      variable: string;
      value: any;
    };
  }) {
    if (options.limit) {
      // Select Limit variable from dropdown
      cy.get(this._graphqlPagination._limitVariable).click({
        force: true,
      });
      cy.get(".rc-select-item-option")
        .contains(options.limit.variable)
        .click({ force: true });

      // Set the Limit value as 1
      cy.get(this._graphqlPagination._limitValue)
        .first()
        .focus()
        .type(options.limit.value);
    }

    if (options.offset) {
      // Select Offset vaiable from dropdown
      cy.get(this._graphqlPagination._offsetVariable).click({
        force: true,
      });
      cy.get(".rc-select-item-option")
        .eq(2)
        .contains(options.offset.variable)
        .click({ force: true });

      // Set the Limit value as 1
      cy.get(this._graphqlPagination._offsetValue)
        .first()
        .focus()
        .type(options.offset.value);
    }

    this.agHelper.Sleep();
  }

  public SetQueryTimeout(
    queryTimeout = 20000,
    action: "QUERY" | "API" = "QUERY",
  ) {
    this.agHelper.GetNClick(this._queryEditorTabs("Settings"));
    cy.xpath(this._queryTimeout)
      .clear()
      .type(queryTimeout.toString(), { delay: 0 }); //Delay 0 to work like paste!
    this.agHelper.AssertAutoSave();

    if (action === "QUERY") {
      this.agHelper.GetNClick(this._queryEditorTabs("Query"));
    }
  }

  //Update with new password in the datasource conf page
  public UpdatePassword(newPassword: string) {
    cy.get(this._password).type(newPassword);
  }

  //Fetch schema from server and validate UI for the updates
  public VerifySchema(
    dataSourceName: string,
    schema: string,
    isUpdate = false,
  ) {
    if (isUpdate) {
      this.UpdateDatasource();
    } else {
      this.SaveDatasource();
    }
    this.entityExplorer.ActionContextMenuByEntityName({
      entityNameinLeftSidebar: dataSourceName,
      action: "Refresh",
    });
    cy.wait("@getDatasourceStructure").then(() => {
      cy.get(".bp3-collapse-body").contains(schema);
    });
  }

  public VerifyTableSchemaOnQueryEditor(schema: string) {
    this.agHelper.AssertElementVisibility(
      this._datasourceTableSchemaInQueryEditor(schema),
    );
  }

  public VerifySchemaAbsenceInQueryEditor() {
    this.agHelper.AssertElementAbsence(this._datasourceStructureHeader);
  }

  public VerifyColumnSchemaOnQueryEditor(schema: string, index = 0) {
    this.agHelper
      .GetElement(this._datasourceColumnSchemaInQueryEditor)
      .eq(index)
      .contains(schema);
  }

  public RefreshDatasourceSchema() {
    this.agHelper.GetNClick(this._datasourceSchemaRefreshBtn);
  }

  public VerifySchemaCollapsibleOpenState(isOpen = false) {
    if (isOpen) {
      this.agHelper.AssertElementVisibility(
        this._datasourceStructureSearchInput,
      );
    } else {
      this.agHelper.AssertElementAbsence(this._datasourceStructureSearchInput);
    }
  }

  public FilterAndVerifyDatasourceSchemaBySearch(
    search: string,
    filterBy?: "table" | "column",
  ) {
    this.agHelper.Sleep(2500); //for query editor to load
    this.agHelper.TypeText(this._datasourceStructureSearchInput, search);
    this.agHelper.Sleep(); //for search result to load
    if (filterBy === "column") {
      this.VerifyColumnSchemaOnQueryEditor(search);
    } else if (filterBy === "table") {
      this.VerifyTableSchemaOnQueryEditor(search);
    }
  }

  public AssertDSDialogVisibility(isVisible = true) {
    if (isVisible) {
      this.agHelper.AssertElementVisibility(this._datasourceModalDoNotSave);
      this.agHelper.AssertElementVisibility(this._datasourceModalSave);
    } else {
      this.agHelper.AssertElementAbsence(this._datasourceModalDoNotSave);
      this.agHelper.AssertElementAbsence(this._datasourceModalSave);
    }
  }

  public AssertDatasourceSaveModalVisibilityAndSave(save = true) {
    this.AssertDSDialogVisibility();
    if (save) {
      this.agHelper.GetNClick(
        this.locator._visibleTextSpan("Save"),
        0,
        true,
        0,
      );
      this.assertHelper.AssertNetworkStatus("@saveDatasource", 201);
      this.agHelper.AssertContains("datasource created");
    } else
      this.agHelper.GetNClick(
        this.locator._visibleTextSpan("Don't save"),
        0,
        true,
        0,
      );
  }

  // this initiates saving via the back button.
  public SaveDSFromDialog(save = true) {
    this.agHelper.GoBack();
    this.AssertDatasourceSaveModalVisibilityAndSave(save);
  }

  public getDSEntity(dSName: string) {
    return `[data-guided-tour-id="explorer-entity-${dSName}"]`;
  }

  public FillAuthAPIUrl(environment = this.dataManager.defaultEnviorment) {
    this.agHelper.TypeText(
      this.locator._inputFieldByName("URL") + "//" + this.locator._inputField,
      this.dataManager.dsValues[environment].authenticatedApiUrl,
    );
  }

  public AssertCursorPositionForTextInput(
    selector: string,
    moveCursor: string,
    typeText = "as",
    cursorPosition = 0,
  ) {
    this.agHelper
      .GetElement(selector)
      .type(moveCursor)
      .type(typeText)
      .should("have.prop", "selectionStart", cursorPosition);
  }

  public AddOAuth2AuthorizationCodeDetails(
    accessTokenUrl: string,
    clientId: string,
    clientSecret: string,
    authURL: string,
  ) {
    this.agHelper.GetNClick(this._authType);
    this.agHelper.GetNClick(this._oauth2);
    this.agHelper.GetNClick(this._grantType);
    this.agHelper.GetNClick(this._authorizationCode);
    this.agHelper.TypeText(this._accessTokenUrl, accessTokenUrl);
    this.agHelper.TypeText(this._clientID, clientId);
    this.agHelper.TypeText(this._clientSecret, clientSecret);
    this.agHelper.TypeText(this._authorizationURL, authURL);
  }

  public EditDSFromActiveTab(dsName: string) {
    this.agHelper.GetNClick(this._editDatasourceFromActiveTab(dsName));
  }

  public FillMongoDatasourceFormWithURI(
    environment = this.dataManager.defaultEnviorment,
  ) {
    this.ValidateNSelectDropdown(
      "Use mongo connection string URI",
      "No",
      "Yes",
    );
    this.agHelper.UpdateInputValue(
      this.locator._inputFieldByName("Connection string URI") + "//input",
      this.dataManager.mongo_uri(environment),
    );
  }

  public CreateOAuthClient(
    grantType: string,
    environment = this.dataManager.defaultEnviorment,
  ) {
    let clientId, clientSecret;

    // Login to TED OAuth
    let formData = new FormData();
    formData.append(
      "username",
      this.dataManager.dsValues[environment].OAuth_Username,
    );
    cy.request(
      "POST",
      this.dataManager.dsValues[environment].OAuth_Host,
      formData,
    ).then((response) => {
      expect(response.status).to.equal(200);
    });

    // Create client
    let clientData = new FormData();
    clientData.append("client_name", "appsmith_cs_post");
    clientData.append("client_uri", "http://localhost/");
    clientData.append("scope", "profile");
    clientData.append(
      "redirect_uri",
      this.dataManager.dsValues[environment].OAuth_RedirectUrl,
    );
    clientData.append("grant_type", grantType);
    clientData.append("response_type", "code");
    clientData.append("token_endpoint_auth_method", "client_secret_post");
    cy.request(
      "POST",
      this.dataManager.dsValues[environment].OAuth_Host + "/create_client",
      clientData,
    ).then((response) => {
      expect(response.status).to.equal(200);
    });

    // Get Client Credentials
    cy.request("GET", this.dataManager.dsValues[environment].OAuth_Host).then(
      (response) => {
        clientId = response.body.split("client_id: </strong>");
        clientId = clientId[1].split("<strong>client_secret: </strong>");
        clientSecret = clientId[1].split("<strong>");
        clientSecret = clientSecret[0].trim();
        clientId = clientId[0].trim();
        cy.wrap(clientId).as("OAuthClientID");
        cy.wrap(clientSecret).as("OAuthClientSecret");
      },
    );
  }

  public CreateOAuthDatasource(
    datasourceName: string,
    grantType: "ClientCredentials" | "AuthCode",
    clientId: string,
    clientSecret: string,
  ) {
    this.NavigateToDSCreateNew();
    //Click on Authenticated API
    this.agHelper.GetNClick(this._authApiDatasource, 0, true);
    this.FillAPIOAuthForm(datasourceName, grantType, clientId, clientSecret);

    // save datasource
    this.agHelper.Sleep(500);
    this.agHelper.GetNClick(this._saveAndAuthorizeDS);

    //Accept consent
    this.agHelper.GetNClick(this._consent);
    this.agHelper.GetNClick(this._consentSubmit);

    //Validate save
    this.assertHelper.AssertNetworkStatus("@saveDatasource", 201);
  }

  public FillAPIOAuthForm(
    dsName: string,
    grantType: "ClientCredentials" | "AuthCode",
    clientId: string,
    clientSecret: string,
    environment = this.dataManager.defaultEnviorment,
  ) {
    if (dsName) this.agHelper.RenameWithInPane(dsName, false);
    // Fill Auth Form
    this.agHelper.TypeText(
      this.locator._inputFieldByName("URL") + "//" + this.locator._inputField,
      this.dataManager.dsValues[environment].OAuth_ApiUrl,
    );
    this.agHelper.GetNClick(this._authType);
    this.agHelper.GetNClick(this._oauth2);
    this.agHelper.GetNClick(this._grantType);
    if (grantType == "ClientCredentials")
      this.agHelper.GetNClick(this._clientCredentails);
    else if (grantType == "AuthCode")
      this.agHelper.GetNClick(this._authorizationCode);

    this.agHelper.TypeText(
      this.locator._inputFieldByName("Access token URL") +
        "//" +
        this.locator._inputField,
      this.dataManager.dsValues[environment].OAUth_AccessTokenUrl,
    );

    this.agHelper.TypeText(
      this.locator._inputFieldByName("Client ID") +
        "//" +
        this.locator._inputField,
      clientId,
    );
    this.agHelper.TypeText(
      this.locator._inputFieldByName("Client secret") +
        "//" +
        this.locator._inputField,
      clientSecret,
    );
    this.agHelper.TypeText(
      this.locator._inputFieldByName("Scope(s)") +
        "//" +
        this.locator._inputField,
      "profile",
    );
    this.agHelper.TypeText(
      this.locator._inputFieldByName("Authorization URL") +
        "//" +
        this.locator._inputField,
      this.dataManager.dsValues[environment].OAuth_AuthUrl,
    );
  }

  public AddSuggestedWidget(widget: Widgets, force = false, index = 0) {
    switch (widget) {
      case Widgets.Dropdown:
        this.agHelper.GetNClick(this._suggestedWidget("SELECT_WIDGET"));
        this.agHelper.AssertElementVisibility(
          this.locator._widgetInCanvas(WIDGET.SELECT),
        );
        break;
      case Widgets.Table:
        this.agHelper.GetNClick(
          this._suggestedWidget("TABLE_WIDGET_V2"),
          index,
          force,
        );
        this.agHelper.AssertElementVisibility(
          this.locator._widgetInCanvas(WIDGET.TABLE),
        );
        break;
      case Widgets.Chart:
        this.agHelper.GetNClick(this._suggestedWidget("CHART_WIDGET"));
        this.agHelper.AssertElementVisibility(
          this.locator._widgetInCanvas(WIDGET.CHART),
        );
        break;
      case Widgets.Text:
        this.agHelper.GetNClick(this._suggestedWidget("TEXT_WIDGET"));
        this.agHelper.AssertElementVisibility(
          this.locator._widgetInCanvas(WIDGET.TEXT),
        );
        break;
    }
  }

  public EnterJSContext({
    fieldLabel,
    fieldValue,
  }: {
    fieldValue: string;
    fieldLabel: string;
  }) {
    this.agHelper.Sleep();
    this.agHelper
      .GetElement(this._getJSONswitchLocator(fieldLabel))
      .invoke("attr", "data-selected")
      .then(($state: any) => {
        if (!$state.includes("true"))
          this.agHelper.GetNClick(
            this._getJSONswitchLocator(fieldLabel),
            0,
            true,
          );
        else this.agHelper.Sleep(200);
      });
    this.agHelper.EnterValue(fieldValue, {
      propFieldName: "",
      directInput: false,
      inputFieldName: fieldLabel,
    });
  }

  public StopNDeleteContainer(containerName: string) {
    // Stop the container
    cy.exec(`docker stop ${containerName}`).then((stopResult) => {
      cy.log("Output from stopping container:" + stopResult.stdout);
      cy.log("Error from stopping container:" + stopResult.stderr);

      // Delete the container
      cy.exec(`docker rm ${containerName}`).then((deleteResult) => {
        cy.log("Output from deleting container:" + deleteResult.stdout);
        cy.log("Error from deleting container:" + deleteResult.stderr);
      });
    });
  }

  public IsContainerReady(containerName: string) {
    return cy
      .exec(`docker inspect -f '{{.State.Status}}' ${containerName}`)
      .then((result) => {
        const containerStatus = result.stdout.trim();
        return containerStatus === "running";
      });
  }

  public StartContainerNVerify(
    containerType: "MsSql" | "Arango" | "Elasticsearch",
    containerName: string,
    sleepTime = 40000,
  ) {
    let containerCommand = "";
    switch (containerType) {
      case "MsSql":
        containerCommand = this.ContainerKVP(containerName).MsSql;
        break;
      case "Arango":
        containerCommand = this.ContainerKVP(containerName).Arango;
        break;
      case "Elasticsearch":
        containerCommand = this.ContainerKVP(containerName).Elasticsearch;
        break;
      default:
        break;
    }
    cy.exec(containerCommand).then((result) => {
      // Wait for the container to be ready
      cy.waitUntil(() => this.IsContainerReady(containerName), {
        interval: 5000,
        timeout: 60000,
      }).then((isReady) => {
        if (isReady) {
          cy.log("Run id of started container is:" + result.stdout);
          this.agHelper.Sleep(sleepTime); //allow some time for container to settle start for CI
        } else
          cy.log(
            `Error from ${containerName} container start action:` +
              result.stderr,
          ); // Container did not start properly within the timeout
      });
    });
  }

  public EnterSortByValues(sortBy: string, option: string, index = 0) {
    this.agHelper
      .GetElement(this._jsModeSortingControl)
      .eq(0)
      .children()
      .eq(index)
      .then((ele) => {
        cy.wrap(ele)
          .children()
          .eq(0)
          .find("textarea")
          .type(sortBy, { force: true });
        cy.wrap(ele).children().eq(1).find("input").click();
      });
    this.agHelper.GetNClickByContains(this._dropdownOption, option);
  }

  public ClearSortByOption(index = 0) {
    this.agHelper.Sleep(500);
    this.agHelper
      .GetElement(this._jsModeSortingControl)
      .eq(0)
      .children()
      .eq(index)
      .find(`button[data-testid='t--sorting-delete-[${index}]']`)
      .click({ force: true });
    this.agHelper.Sleep(500);
  }

  public AddNewSortByParameter() {
    this.agHelper
      .GetElement(this._jsModeSortingControl)
      .find("button[data-testid='t--sorting-add-field']")
      .click({ force: true });
  }

  public AddQueryFromGlobalSearch(datasourceName: string) {
    this.agHelper.GetNClick(this._globalSearchTrigger);
    this.agHelper.Sleep(500);
    this.agHelper.TypeText(this._globalSearchInput, datasourceName);
    this.agHelper.Sleep(500);
    this.agHelper.GetNClickByContains(
      this._globalSearchOptions,
      new RegExp("^" + datasourceName + "$"),
    );
    this.agHelper.WaitUntilEleAppear(this._createQuery);
    this.agHelper.GetNClick(this._createQuery);
  }

  public AssertDataSourceInfo(info: string[]) {
    info.forEach(($infs) => {
      this.agHelper.AssertElementVisibility(
        this.locator._visibleTextDiv($infs),
      );
    });
  }
}
