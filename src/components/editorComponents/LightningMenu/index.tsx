import React from "react";
import CustomizedDropdown, {
  CustomizedDropdownProps,
  CustomizedDropdownOption,
} from "pages/common/CustomizedDropdown";
import { useSelector } from "react-redux";
import { AppState } from "reducers";
import Button from "components/editorComponents/Button";
import { Directions } from "utils/helpers";
import { RestAction } from "api/ActionAPI";
import { WidgetProps } from "widgets/BaseWidget";
import { mergeWith } from "lodash";
import { ControlIcons } from "icons/ControlIcons";
import { Tooltip } from "@blueprintjs/core";

const getApiOptions = (
  themeType: string,
  apis: RestAction[],
  updatePropertyValue: (value: string, cursor?: number) => void,
) => ({
  sections: [
    // {
    //   isSticky: true,
    //   options: [
    //     {
    //       content: (
    //         <Button
    //           text="Create new API"
    //           icon="plus"
    //           iconAlignment="left"
    //           themeType={themeType}
    //           type="button"
    //         />
    //       ),
    //     },
    //   ],
    // },
    {
      options: apis.map(api => ({
        content: api.name,
        onSelect: () => {
          updatePropertyValue(`{{${api.name}.data}}`);
        },
      })),
    },
  ],
  trigger: {
    text: "Use data from a API",
  },
  openDirection: Directions.RIGHT,
  openOnHover: false,
  themeType: themeType,
});

const getQueryOptions = (
  themeType: string,
  queries: RestAction[],
  updatePropertyValue: (value: string, cursor?: number) => void,
) => ({
  sections: [
    // {
    //   isSticky: true,
    //   options: [
    //     {
    //       content: (
    //         <Button
    //           text="Create new Query"
    //           icon="plus"
    //           iconAlignment="left"
    //           themeType={themeType}
    //           type="button"
    //         />
    //       ),
    //     },
    //   ],
    // },
    {
      options: queries.map(query => ({
        content: query.name,
        onSelect: () => {
          updatePropertyValue(`{{${query.name}.data}}`);
        },
      })),
    },
  ],
  trigger: {
    text: "Use data from a Query",
  },
  openDirection: Directions.RIGHT,
  openOnHover: false,
  themeType: themeType,
});

const getWidgetOptions = (
  themeType: string,
  widgets: WidgetProps[],
  updatePropertyValue: (value: string, cursor?: number) => void,
) => ({
  sections: [
    {
      options: widgets.map(widget => ({
        // content: (
        //   <CustomizedDropdown
        //     {...getWidgetData(themeType, widget, updatePropertyValue)}
        //   />
        // ),
        // shouldCloseDropdown: false,
        content: widget.widgetName,
        disabled: false,
        shouldCloseDropdown: true,
        onSelect: () => {
          updatePropertyValue(`{{${widget.widgetName}.}}`);
        },
      })),
    },
  ],
  trigger: {
    text: "Use data from a Widget",
  },
  openDirection: Directions.RIGHT,
  openOnHover: false,
  themeType: themeType,
});

const getWidgetData = (
  themeType: string,
  widget: WidgetProps,
  updatePropertyValue: (value: string, cursor?: number) => void,
) => ({
  sections: [
    {
      options: Object.keys(widget).map(widgetProp => ({
        content: widgetProp,
        onSelect: () => {
          updatePropertyValue(`{{${widget.widgetName}.${widgetProp}}}`);
        },
      })),
    },
  ],
  trigger: {
    text: widget.widgetName,
  },
  openDirection: Directions.RIGHT,
  openOnHover: false,
  themeType: themeType,
});

const LightningIcon = ControlIcons.LIGHTNING_CONTROL;
const lightningMenuOptions = (
  themeType: string,
  apis: RestAction[],
  queries: RestAction[],
  widgets: WidgetProps[],
  updatePropertyValue: (value: string, cursor?: number) => void,
  trigger: React.ReactNode,
): CustomizedDropdownProps => {
  const options: CustomizedDropdownOption[] = [
    {
      content: "Plain Text",
      disabled: false,
      shouldCloseDropdown: true,
      onSelect: () => {
        updatePropertyValue("");
      },
    },
  ];
  if (apis.length > 0) {
    options.push({
      content: (
        <CustomizedDropdown
          {...getApiOptions(themeType, apis, updatePropertyValue)}
        />
      ),
      disabled: false,
      shouldCloseDropdown: false,
    });
  }
  if (queries.length > 0) {
    options.push({
      content: (
        <CustomizedDropdown
          {...getQueryOptions(themeType, queries, updatePropertyValue)}
        />
      ),
      disabled: false,
      shouldCloseDropdown: false,
    });
  }
  if (widgets.length > 0) {
    options.push({
      content: (
        <CustomizedDropdown
          {...getWidgetOptions(themeType, widgets, updatePropertyValue)}
        />
      ),
      disabled: false,
      shouldCloseDropdown: false,
    });
  }
  return {
    sections: [
      {
        options: [
          ...options,
          {
            content: "JS",
            disabled: false,
            shouldCloseDropdown: true,
            onSelect: () => {
              updatePropertyValue("{{}}");
            },
          },
          {
            content: "HTML",
            disabled: false,
            shouldCloseDropdown: true,
            onSelect: () => {
              updatePropertyValue("<p></p>", 3);
            },
          },
        ],
      },
    ],
    openDirection: Directions.DOWN,
    usePortal: true,
    trigger: {
      content: (
        <Tooltip hoverOpenDelay={1000} content="Quick start data binding">
          {trigger}
        </Tooltip>
      ),
    },
    themeType: themeType,
  };
};

type LightningMenuProps = {
  onSelect?: (value: string) => void;
  updatePropertyValue: (value: string, cursor?: number) => void;
  themeType: string;
};

export const LightningMenu = (props: LightningMenuProps) => {
  const actions = useSelector((state: AppState) => {
    const currentPageId = state.entities.pageList.currentPageId;
    return state.entities.actions.filter(
      action => action.config.pageId === currentPageId,
    );
  });
  // TODO(abhinav): Meta props should be available even before the meta value exists
  // For example: Input text shows up only when we have an input text value
  const widgets = useSelector((state: AppState) => {
    const canvasWidgets = state.entities.canvasWidgets;
    const metaProps = state.entities.meta;
    const widgets = mergeWith(canvasWidgets, metaProps, (obj, src) => {
      return Object.assign({}, obj, src);
    });
    const final = Object.values(widgets).filter(
      (widget: WidgetProps) =>
        !widget.children || widget.children?.length === 0 || !widget.widgetName,
    );
    return final;
  });
  const apis = actions
    .filter(action => action.config.pluginType === "API")
    .map(action => action.config);
  const queries = actions
    .filter(action => action.config.pluginType === "DB")
    .map(action => action.config);

  const lightningMenuTrigger = (
    <LightningIcon
      width={14}
      height={14}
      color={props.themeType === "light" ? "#999" : undefined}
    />
  );

  return (
    <CustomizedDropdown
      {...lightningMenuOptions(
        props.themeType,
        apis,
        queries,
        widgets,
        props.updatePropertyValue,
        lightningMenuTrigger,
      )}
    />
  );
};

export default LightningMenu;
