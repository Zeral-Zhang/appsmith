import React, { useState, useRef, useEffect } from "react";
import {
  reduxForm,
  InjectedFormProps,
  Field,
  FormSubmitHandler,
} from "redux-form";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
} from "@syncfusion/ej2-react-grids";
import ReactJson from "react-json-view";
import styled, { createGlobalStyle } from "styled-components";
import { Popover } from "@blueprintjs/core";
import history from "utils/history";
import DynamicAutocompleteInput from "components/editorComponents/DynamicAutocompleteInput";
import { DATA_SOURCES_EDITOR_URL } from "constants/routes";
import TemplateMenu from "./TemplateMenu";
import Spinner from "components/editorComponents/Spinner";
import CenteredWrapper from "components/designSystems/appsmith/CenteredWrapper";
import Button from "components/editorComponents/Button";
import FormRow from "components/editorComponents/FormRow";
import TextField from "components/editorComponents/form/fields/TextField";
import DropdownField from "components/editorComponents/form/fields/DropdownField";
import { BaseButton } from "components/designSystems/blueprint/ButtonComponent";
import { Datasource } from "api/DatasourcesApi";
import { RestAction } from "api/ActionAPI";
import { QUERY_EDITOR_FORM_NAME } from "constants/forms";
import { PLUGIN_PACKAGE_POSTGRES } from "constants/QueryEditorConstants";
import "@syncfusion/ej2-react-grids/styles/material.css";

const QueryFormContainer = styled.div`
  font-size: 20px;
  padding: 20px 32px;
  width: 100%;
  max-height: 93vh;
  a {
    font-size: 14px;
    line-height: 20px;
    margin-top: 15px;
  }

  .textAreaStyles {
    border-radius: 4px;
    border: 1px solid #d0d7dd;
    font-size: 14px;
    height: calc(100vh / 3);
  }
  .statementTextArea {
    font-size: 14px;
    line-height: 20px;
    color: #2e3d49;
    margin-top: 15px;
  }

  && {
    .CodeMirror-lines {
      padding: 16px 20px;
    }
  }

  .queryInput {
    max-width: 30%;
    padding-right: 10px;
  }
  span.bp3-popover-target {
    display: initial !important;
  }
`;

const ActionButtons = styled.div`
  flex: 1;
  margin-left: 10px;
`;

const ActionButton = styled(BaseButton)`
  &&& {
    max-width: 72px;
    margin: 0 5px;
    min-height: 30px;
  }
`;

const ResponseContainer = styled.div`
  margin-top: 20px;
`;

const ResponseContent = styled.div`
  height: calc(
    100vh - (100vh / 3) - 150px - ${props => props.theme.headerHeight}
  );
  overflow: auto;
`;

const DropdownSelect = styled.div`
  font-size: 14px;
`;

const NoDataSourceContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-top: 62px;
  flex: 1;
  .font18 {
    width: 50%;
    text-align: center;
    margin-bottom: 23px;
    font-size: 18px;
    color: #2e3d49;
  }
`;

const TooltipStyles = createGlobalStyle`
 .helper-tooltip{
  width: 378px;
  .bp3-popover {
    height: 137px;
    max-width: 378px;
    box-shadow: none;
    display: inherit !important;
    .bp3-popover-arrow {
      display: block;
      fill: none;
    }
    .bp3-popover-arrow-fill {
      fill:  #23292E;
    }
    .bp3-popover-content {
      padding: 15px;
      background-color: #23292E;
      color: #fff;
      text-align: left;
      border-radius: 4px;
      text-transform: initial;
      font-weight: 500;
      font-size: 16px;
      line-height: 20px;
    }
    .popoverBtn {
      float: right;
      margin-top: 25px;
    }
    .popuptext {
      padding-right: 30px;
    }
  }
 }
`;

const TableHeader = styled.div`
  font-weight: 500;
  font-size: 14px;
  font-family: "DM Sans";
  color: #2e3d49;
`;

const LoadingContainer = styled(CenteredWrapper)`
  height: 50%;
`;

const StyledGridComponent = styled(GridComponent)`
  &&& {
    .e-altrow {
      background-color: #fafafa;
    }
    .e-active {
      background: #cccccc;
    }
    .e-gridcontent {
      max-height: calc(
        100vh - (100vh / 3) - 150px - 49px -
          ${props => props.theme.headerHeight}
      );
      overflow: auto;
    }
  }
`;

type QueryFormProps = {
  isCreating: boolean;
  onDeleteClick: () => void;
  onSaveClick: () => void;
  onRunClick: () => void;
  createTemplate: (template: any, name: string) => void;
  onSubmit: FormSubmitHandler<RestAction>;
  isDeleting: boolean;
  allowSave: boolean;
  isSaving: boolean;
  isRunning: boolean;
  dataSources: Datasource[];
  DATASOURCES_OPTIONS: any;
  executedQueryData: any;
  applicationId: string;
  selectedPluginPackage: string;
  pageId: string;
  location: {
    state: any;
  };
};

export type StateAndRouteProps = QueryFormProps;

type Props = StateAndRouteProps &
  InjectedFormProps<RestAction, StateAndRouteProps>;

const QueryEditorForm: React.FC<Props> = (props: Props) => {
  const {
    handleSubmit,
    allowSave,
    isDeleting,
    isSaving,
    isRunning,
    onSaveClick,
    onRunClick,
    onDeleteClick,
    DATASOURCES_OPTIONS,
    pageId,
    applicationId,
    dataSources,
    executedQueryData,
    selectedPluginPackage,
    createTemplate,
    isCreating,
  } = props;

  const [showTemplateMenu, setMenuVisibility] = useState(true);

  const isSQL = selectedPluginPackage === PLUGIN_PACKAGE_POSTGRES;
  const isNewQuery = props.location.state?.newQuery ?? false;
  let queryOutput = { body: [{ "": "" }] };
  const inputEl = useRef<HTMLInputElement>();

  if (executedQueryData) {
    if (isSQL && executedQueryData.body.length) {
      queryOutput = executedQueryData;
    }
  }

  useEffect(() => {
    if (isNewQuery) {
      inputEl.current?.select();
    }
  }, [isNewQuery]);

  if (isCreating) {
    return (
      <LoadingContainer>
        <Spinner size={30} />
      </LoadingContainer>
    );
  }
  return (
    <QueryFormContainer>
      <form onSubmit={handleSubmit}>
        <FormRow>
          <TextField
            name="name"
            placeholder="Query"
            className="queryInput"
            refHandler={inputEl}
          />
          <DropdownSelect>
            <DropdownField
              placeholder="Datasource"
              name="datasource.id"
              options={DATASOURCES_OPTIONS}
              width={200}
              maxMenuHeight={200}
            />
          </DropdownSelect>
          <ActionButtons>
            <ActionButton
              className="t--delete-query"
              text="Delete"
              accent="error"
              loading={isDeleting}
              onClick={onDeleteClick}
            />
            {dataSources.length === 0 ? (
              <>
                <TooltipStyles />
                <Popover
                  autoFocus={true}
                  canEscapeKeyClose={true}
                  content="You don’t have a Data Source to run this query
                "
                  position="bottom"
                  defaultIsOpen={false}
                  usePortal
                  portalClassName="helper-tooltip"
                >
                  <ActionButton
                    className="t--run-query"
                    text="Run"
                    accent="primary"
                    loading={isRunning}
                  />
                  <div>
                    <p className="popuptext">
                      You don’t have a Data Source to run this query
                    </p>
                    <Button
                      onClick={() =>
                        history.push(
                          DATA_SOURCES_EDITOR_URL(applicationId, pageId),
                        )
                      }
                      text="Add Datasource"
                      intent="primary"
                      filled
                      size="small"
                      className="popoverBtn"
                    />
                  </div>
                </Popover>
              </>
            ) : (
              <ActionButton
                className="t--run-query"
                text="Run"
                loading={isRunning}
                accent="secondary"
                onClick={onRunClick}
              />
            )}
            <ActionButton
              className="t--save-query"
              text="Save"
              accent="primary"
              filled
              onClick={onSaveClick}
              loading={isSaving}
              disabled={!allowSave}
            />
          </ActionButtons>
        </FormRow>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p className="statementTextArea">Query Statement</p>
          {isSQL ? (
            <a
              href="https://www.postgresql.org/docs/12/index.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              PostgreSQL docs
            </a>
          ) : (
            <a
              href="https://docs.mongodb.com/manual/reference/command/nav-crud/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mongo docs
            </a>
          )}
        </div>
        {isNewQuery && showTemplateMenu ? (
          <TemplateMenu
            createTemplate={templateString => {
              const name = isSQL
                ? "actionConfiguration.query.cmd"
                : "actionConfiguration.query";

              setMenuVisibility(false);
              createTemplate(templateString, name);
            }}
            selectedPluginPackage={selectedPluginPackage}
          />
        ) : isSQL ? (
          <Field
            name="actionConfiguration.query.cmd"
            component={DynamicAutocompleteInput}
            className="textAreaStyles"
            mode="sql-js"
            baseMode="text/x-sql"
          />
        ) : (
          <Field
            name="actionConfiguration.query"
            component={DynamicAutocompleteInput}
            className="textAreaStyles"
            mode="js-js"
            normalize={(value: any) => {
              try {
                return JSON.parse(value);
              } catch (e) {
                return value;
              }
            }}
          />
        )}
      </form>

      {dataSources.length === 0 && (
        <NoDataSourceContainer>
          <p className="font18">
            Seems like you don’t have any Datasouces to create a query
          </p>
          <Button
            onClick={() =>
              history.push(DATA_SOURCES_EDITOR_URL(applicationId, pageId))
            }
            text="Add a Datasource"
            intent="primary"
            filled
            size="small"
            icon="plus"
          />
        </NoDataSourceContainer>
      )}

      {executedQueryData && dataSources.length && (
        <ResponseContainer>
          <p className="statementTextArea">Query response</p>
          <ResponseContent>
            {isSQL ? (
              <StyledGridComponent dataSource={queryOutput.body}>
                <ColumnsDirective>
                  {Object.keys(queryOutput.body[0]).map((key: string) => {
                    return (
                      <ColumnDirective
                        headerTemplate={(props: { headerText: any }) => {
                          const { headerText } = props;

                          return <TableHeader>{headerText}</TableHeader>;
                        }}
                        key={key}
                        field={key}
                        width="200"
                      />
                    );
                  })}
                </ColumnsDirective>
              </StyledGridComponent>
            ) : (
              <ReactJson
                src={executedQueryData.body}
                name={null}
                enableClipboard={false}
                displayObjectSize={false}
                displayDataTypes={false}
                style={{
                  fontSize: "14px",
                }}
              />
            )}
          </ResponseContent>
        </ResponseContainer>
      )}
    </QueryFormContainer>
  );
};

export default reduxForm<RestAction, StateAndRouteProps>({
  form: QUERY_EDITOR_FORM_NAME,
  enableReinitialize: true,
})(QueryEditorForm);
