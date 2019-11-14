import { createSelector } from "reselect";
import createCachedSelector from "re-reselect";

import { AppState, DataTree } from "reducers";
import { EditorReduxState } from "reducers/uiReducers/editorReducer";
import { WidgetConfigReducerState } from "reducers/entityReducers/widgetConfigReducer";
import { WidgetCardProps } from "widgets/BaseWidget";
import { WidgetSidebarReduxState } from "reducers/uiReducers/widgetSidebarReducer";
import CanvasWidgetsNormalizer from "normalizers/CanvasWidgetsNormalizer";
import { injectDataTreeIntoDsl } from "utils/DynamicBindingUtils";
import { getDataTree } from "./entitiesSelector";
import {
  FlattenedWidgetProps,
  CanvasWidgetsReduxState,
} from "reducers/entityReducers/canvasWidgetsReducer";

import { OccupiedSpace } from "constants/editorConstants";
import { WidgetTypes } from "constants/WidgetConstants";

const getEditorState = (state: AppState) => state.ui.editor;
const getWidgetConfigs = (state: AppState) => state.entities.widgetConfig;
const getWidgetSideBar = (state: AppState) => state.ui.widgetSidebar;

const getWidgets = (state: AppState): CanvasWidgetsReduxState =>
  state.entities.canvasWidgets;

export const getPageList = createSelector(
  getEditorState,
  (editor: EditorReduxState) => editor.pages,
);

export const getPropertyPaneConfigsId = createSelector(
  getEditorState,
  (editor: EditorReduxState) => editor.propertyPaneConfigsId,
);

export const getCurrentPageId = createSelector(
  getEditorState,
  (editor: EditorReduxState) => editor.currentPageId,
);

export const getCurrentLayoutId = createSelector(
  getEditorState,
  (editor: EditorReduxState) => editor.currentLayoutId,
);

export const getPageWidgetId = createSelector(
  getEditorState,
  (editor: EditorReduxState) => editor.pageWidgetId,
);

export const getCurrentPageName = createSelector(
  getEditorState,
  (editor: EditorReduxState) => editor.currentPageName,
);

export const getCurrentApplicationId = createSelector(
  getEditorState,
  (editor: EditorReduxState) => editor.currentApplicationId,
);

export const getIsPageSaving = createSelector(
  getEditorState,
  (editor: EditorReduxState) => editor.loadingStates.saving,
);

export const getIsPublishingApplication = createSelector(
  getEditorState,
  (editor: EditorReduxState) => editor.loadingStates.publishing,
);

export const getPublishingError = createSelector(
  getEditorState,
  (editor: EditorReduxState) => editor.loadingStates.publishingError,
);

export const getWidgetCards = createSelector(
  getWidgetSideBar,
  getWidgetConfigs,
  (
    widgetCards: WidgetSidebarReduxState,
    widgetConfigs: WidgetConfigReducerState,
  ) => {
    const cards = widgetCards.cards;
    const groups: string[] = Object.keys(cards);
    groups.forEach((group: string) => {
      cards[group] = cards[group].map((widget: WidgetCardProps) => {
        const { rows, columns } = widgetConfigs.config[widget.type];
        return { ...widget, rows, columns };
      });
    });
    return cards;
  },
);

// TODO(abhinav) : Benchmark this, see how many times this is called in the application
// lifecycle. Move to using flattend redux state for widgets if necessary.

// Also, try to merge the widgetCards and widgetConfigs in the fetch Saga.
// No point in storing widgetCards, without widgetConfig
// Alternatively, try to see if we can continue to use only WidgetConfig and eliminate WidgetCards

export const getDenormalizedDSL = createCachedSelector(
  getPageWidgetId,
  getDataTree,
  (pageWidgetId: string, entities: DataTree) => {
    const dsl = CanvasWidgetsNormalizer.denormalize(pageWidgetId, entities);
    return injectDataTreeIntoDsl(entities, dsl);
  },
)((pageWidgetId, entities) => entities || 0);

const getOccupiedSpacesForContainer = (
  containerWidgetId: string,
  widgets: FlattenedWidgetProps[],
): OccupiedSpace[] => {
  return widgets.map(widget => {
    const occupiedSpace: OccupiedSpace = {
      id: widget.widgetId,
      parentId: containerWidgetId,
      left: widget.leftColumn,
      top: widget.topRow,
      bottom: widget.bottomRow,
      right: widget.rightColumn,
    };
    return occupiedSpace;
  });
};

export const getOccupiedSpaces = createSelector(
  getWidgets,
  (
    widgets: CanvasWidgetsReduxState,
  ): { [containerWidgetId: string]: OccupiedSpace[] } | undefined => {
    const occupiedSpaces: {
      [containerWidgetId: string]: OccupiedSpace[];
    } = {};
    // Get all widgets with type "CONTAINER_WIDGET" and has children
    const containerWidgets: FlattenedWidgetProps[] = Object.values(
      widgets,
    ).filter(widget => widget.type === WidgetTypes.CONTAINER_WIDGET);

    // If we have any container widgets
    if (containerWidgets) {
      containerWidgets.forEach((containerWidget: FlattenedWidgetProps) => {
        const containerWidgetId = containerWidget.widgetId;
        // Get child widgets for the container
        const childWidgets = Object.keys(widgets).filter(
          widgetId =>
            containerWidget.children &&
            containerWidget.children.indexOf(widgetId) > -1,
        );
        // Get the occupied spaces in this container
        // Assign it to the containerWidgetId key in occupiedSpaces
        occupiedSpaces[containerWidgetId] = getOccupiedSpacesForContainer(
          containerWidgetId,
          childWidgets.map(widgetId => widgets[widgetId]),
        );
      });
    }
    // Return undefined if there are no occupiedSpaces.
    return Object.keys(occupiedSpaces).length > 0 ? occupiedSpaces : undefined;
  },
);
