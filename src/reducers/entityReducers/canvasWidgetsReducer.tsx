import { createReducer } from "../../utils/AppsmithUtils";
import {
  ReduxActionTypes,
  LoadCanvasWidgetsPayload,
  ReduxAction,
} from "../../constants/ReduxActionConstants";
import { WidgetProps } from "../../widgets/BaseWidget";
import CanvasWidgetsNormalizer from "../../normalizers/CanvasWidgetsNormalizer";

const initialState: CanvasWidgetsReduxState = {};

export interface FlattenedWidgetProps extends WidgetProps {
  children?: string[];
}

const canvasWidgetsReducer = createReducer(initialState, {
  [ReduxActionTypes.UPDATE_CANVAS]: (
    state: CanvasWidgetsReduxState,
    action: ReduxAction<LoadCanvasWidgetsPayload>,
  ) => {
    return { ...action.payload.widgets };
  },
  [ReduxActionTypes.ADD_PAGE_WIDGET]: (
    state: CanvasWidgetsReduxState,
    action: ReduxAction<{ pageId: string; widget: WidgetProps }>,
  ) => {
    const widget = action.payload.widget;
    const widgetTree = CanvasWidgetsNormalizer.denormalize("0", {
      canvasWidgets: state,
    });
    const children = widgetTree.children || [];
    children.push(widget);
    widgetTree.children = children;
    const newState = CanvasWidgetsNormalizer.normalize({
      responseMeta: { responseCode: "SUCCESS" },
      layout: { dsl: widgetTree, actions: [] },
    }).entities;
    return newState.canvasWidgets;
  },
});

export interface CanvasWidgetsReduxState {
  [widgetId: string]: FlattenedWidgetProps;
}

export default canvasWidgetsReducer;
