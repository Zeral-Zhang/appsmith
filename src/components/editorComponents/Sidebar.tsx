import React from "react";
import { Switch } from "react-router";
import styled from "styled-components";
import {
  API_EDITOR_URL,
  BUILDER_URL,
  API_EDITOR_ID_URL,
  PAGE_LIST_EDITOR_URL,
} from "constants/routes";
import WidgetSidebar from "pages/Editor/WidgetSidebar";
import ApiSidebar from "pages/Editor/ApiSidebar";
import PageListSidebar from "pages/Editor/PageListSidebar";
import AppRoute from "pages/common/AppRoute";

const SidebarWrapper = styled.div`
  background-color: ${props => props.theme.colors.paneBG};
  padding: 5px 0;
  color: ${props => props.theme.colors.textOnDarkBG};
  overflow-y: auto;
`;

export const Sidebar = () => {
  return (
    <SidebarWrapper>
      <Switch>
        <AppRoute
          exact
          path={BUILDER_URL}
          component={WidgetSidebar}
          name={"WidgetSidebar"}
        />
        <AppRoute
          exact
          path={API_EDITOR_URL()}
          component={ApiSidebar}
          name={"ApiSidebar"}
        />
        <AppRoute
          exact
          path={API_EDITOR_ID_URL()}
          component={ApiSidebar}
          name={"ApiSidebar"}
        />
        <AppRoute
          exact
          path={PAGE_LIST_EDITOR_URL()}
          component={PageListSidebar}
          name={"PageListSidebar"}
        />
      </Switch>
    </SidebarWrapper>
  );
};

export default Sidebar;
