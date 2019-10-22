import React from "react";
import { reduxForm, InjectedFormProps, FormSubmitHandler } from "redux-form";
import FormRow from "../editor/FormRow";
import TextField from "../fields/TextField";
import {
  FORM_INITIAL_VALUES,
  HTTP_METHOD_OPTIONS,
} from "../../constants/ApiEditorConstants";
import CreatableDropdown from "../canvas/CreatableDropdown";
import FormLabel from "../editor/FormLabel";
import { BaseText } from "../canvas/TextViewComponent";
import { BaseTabbedView } from "../canvas/TabbedView";
import styled from "styled-components";
import FormContainer from "../editor/FormContainer";
import { BaseButton } from "../canvas/Button";
import KeyValueFieldArray from "../fields/KeyValueFieldArray";
import JSONEditorField from "../fields/JSONEditorField";
import DropdownField from "../fields/DropdownField";
import { RestAction } from "../../api/ActionAPI";
import JSONViewer from "../../components/editor/JSONViewer";
import { API_EDITOR_FORM_NAME } from "../../constants/forms";

const Form = styled(FormContainer)`
  height: 100%;
  width: 100%;
  ${FormRow} {
    flex-wrap: wrap;
    padding: ${props => props.theme.spaces[3]}px;
    & > * {
      margin-right: 5px;
    }
    ${FormLabel} {
      width: 100%;
    }
  }
`;

const SecondaryWrapper = styled.div`
  display: flex;
  border-top: 1px solid #d0d7dd;
  height: 100%;
`;

const ForwardSlash = styled.div`
  && {
    margin: 0 10px;
    height: 22px;
    width: 1px;
    background-color: #d0d7dd;
    transform: rotate(27deg);
  }
`;

const RequestParamsWrapper = styled.div`
  flex: 5;
  border-right: 1px solid #d0d7dd;
`;

const ResponseWrapper = styled.div`
  flex: 4;
`;

const ActionButton = styled(BaseButton)`
  max-width: 72px;
  margin: 0 5px;
`;

const ResponseMetaInfo = styled.div`
  display: flex;
  ${BaseText} {
    color: #768896;
    margin: 0 5px;
  }
`;

const JSONEditorFieldWrapper = styled.div`
  flex: 1;
  border: 1px solid #d0d7dd;
  border-radius: 4px;
`;

interface APIFormProps {
  onSubmit: FormSubmitHandler<RestAction>;
  onSaveClick: () => void;
  onRunClick: () => void;
  onDeleteClick: () => void;
  response: any;
}

type Props = APIFormProps & InjectedFormProps<RestAction, APIFormProps>;

class ApiEditorForm extends React.Component<Props> {
  render() {
    const { onSaveClick, onDeleteClick, onRunClick } = this.props;
    return (
      <Form>
        <FormRow>
          <TextField name="name" placeholderMessage="API Name" />
          <ActionButton
            text="Delete"
            styleName="error"
            onClick={onDeleteClick}
          />
          <ActionButton text="Run" styleName="secondary" onClick={onRunClick} />
          <ActionButton
            text="Save"
            styleName="primary"
            filled
            onClick={onSaveClick}
          />
        </FormRow>
        <FormRow>
          <DropdownField
            name="actionConfiguration.httpMethod"
            options={HTTP_METHOD_OPTIONS}
          />
          <CreatableDropdown options={[]} placeholder="Resource" />
          <ForwardSlash />
          <TextField
            placeholderMessage="API Path"
            name="actionConfiguration.path"
          />
        </FormRow>
        <SecondaryWrapper>
          <RequestParamsWrapper>
            <KeyValueFieldArray
              name="actionConfiguration.headers"
              label="Headers"
            />
            <KeyValueFieldArray
              name="actionConfiguration.queryParameters"
              label="Params"
            />
            <FormRow>
              <FormLabel>Post Body</FormLabel>
              <JSONEditorFieldWrapper>
                <JSONEditorField name="actionConfiguration.body" />
              </JSONEditorFieldWrapper>
            </FormRow>
          </RequestParamsWrapper>
          <ResponseWrapper>
            <FormRow>
              <BaseText styleName="secondary">
                {this.props.response.statusCode}
              </BaseText>
              <ResponseMetaInfo>
                <BaseText styleName="secondary">300ms</BaseText>
                <BaseText styleName="secondary">203 kb</BaseText>
              </ResponseMetaInfo>
            </FormRow>
            <BaseTabbedView
              tabs={[
                {
                  key: "body",
                  title: "Response Body",
                  panelComponent: () => (
                    <JSONViewer data={this.props.response.body} />
                  ),
                },
                {
                  key: "headers",
                  title: "Response Headers",
                  panelComponent: () => (
                    <JSONViewer data={this.props.response.headers} />
                  ),
                },
              ]}
            />
          </ResponseWrapper>
        </SecondaryWrapper>
      </Form>
    );
  }
}

export default reduxForm<RestAction, APIFormProps>({
  form: API_EDITOR_FORM_NAME,
  enableReinitialize: true,
  initialValues: FORM_INITIAL_VALUES,
})(ApiEditorForm);
