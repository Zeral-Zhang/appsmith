import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { connect } from "react-redux";
import { getThemeDetails } from "selectors/themeSelectors";
import { AppState } from "reducers";
import { ThemeMode } from "reducers/uiReducers/themeReducer";
import { setThemeMode } from "actions/themeActions";
import equal from "fast-deep-equal/es6";
const SentryRoute = Sentry.withSentryRouting(Route);

interface AppRouteProps {
  currentTheme: any;
  path?: string;
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
  exact?: boolean;
  logDisable?: boolean;
  name: string;
  location?: any;
  setTheme: Function;
}

class AppRouteWithoutProps extends React.Component<AppRouteProps> {
  shouldComponentUpdate(prevProps: AppRouteProps, nextProps: AppRouteProps) {
    return !equal(prevProps?.location, nextProps?.location);
  }

  render() {
    const { component: Component, currentTheme, ...rest } = this.props;
    if (
      window.location.pathname === "/applications" ||
      window.location.pathname.indexOf("/settings/") !== -1
    ) {
      document.body.style.backgroundColor =
        currentTheme.colors.homepageBackground;
    } else {
      document.body.style.backgroundColor = currentTheme.colors.appBackground;
    }
    return <SentryRoute {...rest} component={this.props.component} />;
  }
}
const mapStateToProps = (state: AppState) => ({
  currentTheme: getThemeDetails(state).theme,
});
const mapDispatchToProps = (dispatch: any) => ({
  setTheme: (mode: ThemeMode) => {
    dispatch(setThemeMode(mode));
  },
});

const AppRoute = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppRouteWithoutProps);

(AppRoute as any).whyDidYouRender = {
  logOnDifferentValues: false,
};

export default AppRoute;
