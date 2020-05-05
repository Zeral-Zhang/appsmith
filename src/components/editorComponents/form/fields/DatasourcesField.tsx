import React from "react";
import CreatableDropdown from "components/designSystems/appsmith/CreatableDropdown";
import { connect } from "react-redux";
import { Field } from "redux-form";
import { AppState } from "reducers";
import { DatasourceDataState } from "reducers/entityReducers/datasourceReducer";
import { Plugin } from "api/PluginApi";
import { getDatasourcePlugins } from "selectors/entitiesSelector";
import _ from "lodash";
import { createDatasource } from "actions/datasourceActions";
import AnalyticsUtil from "utils/AnalyticsUtil";

interface ReduxStateProps {
  datasources: DatasourceDataState;
  validDatasourcePlugins: Plugin[];
}
interface ReduxActionProps {
  createDatasource: (value: string) => void;
}

interface ComponentProps {
  name: string;
  pluginId: string;
  appName: string;
}

const DatasourcesField = (
  props: ReduxActionProps & ReduxStateProps & ComponentProps,
) => {
  const options = props.datasources.list
    .filter(r => r.pluginId === props.pluginId)
    .filter(r =>
      props.validDatasourcePlugins.some(plugin => plugin.id === r.pluginId),
    )
    .filter(r => r.datasourceConfiguration)
    .filter(r => r.datasourceConfiguration.url)
    .map(r => ({
      label: r.datasourceConfiguration?.url.endsWith("/")
        ? r.datasourceConfiguration?.url.slice(0, -1)
        : r.datasourceConfiguration.url,
      value: r.id,
    }));
  return (
    <Field
      name={props.name}
      component={CreatableDropdown}
      isLoading={props.datasources.loading}
      options={options}
      placeholder="https://<base-url>.com"
      onCreateOption={props.createDatasource}
      format={(value: string) => _.find(options, { value }) || ""}
      parse={(option: { value: string }) => (option ? option.value : null)}
      formatCreateLabel={(value: string) => `Create data source "${value}"`}
      noOptionsMessage={() => "No data sources created"}
    />
  );
};

const mapStateToProps = (state: AppState): ReduxStateProps => ({
  datasources: state.entities.datasources,
  validDatasourcePlugins: getDatasourcePlugins(state),
});

const mapDispatchToProps = (
  dispatch: any,
  ownProps: ComponentProps,
): ReduxActionProps => ({
  createDatasource: (value: string) => {
    AnalyticsUtil.logEvent("CREATE_DATA_SOURCE_CLICK", {
      appName: ownProps.appName,
      dataSource: value,
    });
    // "https://example.com/ "
    // "https://example.com "
    const trimmedValue = value.trim();
    dispatch(
      createDatasource({
        // Datasource name should not end with /
        name: trimmedValue.endsWith("/")
          ? trimmedValue.slice(0, -1)
          : trimmedValue,
        datasourceConfiguration: {
          // Datasource url should end with /
          url: trimmedValue.endsWith("/") ? trimmedValue : `${trimmedValue}/`,
        },
        pluginId: ownProps.pluginId,
        appName: ownProps.appName,
      }),
    );
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DatasourcesField);
