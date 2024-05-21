import type {
  PropertyUpdates,
  SnipingModeProperty,
} from "WidgetProvider/constants";
import { RadioGroupIcon, RadioGroupThumbnail } from "appsmith-icons";

export const methodsConfig = {
  getSnipingModeUpdates: (
    propValueMap: SnipingModeProperty,
  ): PropertyUpdates[] => {
    return [
      {
        propertyPath: "options",
        propertyValue: propValueMap.data,
        isDynamicPropertyPath: true,
      },
    ];
  },
  IconCmp: RadioGroupIcon,
  ThumbnailCmp: RadioGroupThumbnail,
};