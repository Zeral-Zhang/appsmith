import React from "react";
import BaseWidget, { IWidgetProps, IWidgetState } from "./BaseWidget";
import { WidgetType } from "../constants/WidgetConstants";
import { ActionPayload } from '../constants/ActionConstants';

class TableWidget extends BaseWidget<TableWidgetProps, IWidgetState> {

  getPageView() {
    return (
      <div/>
    );
  }

  getWidgetType(): WidgetType {
    return "TABLE_WIDGET";
  }
}

export type PaginationType = "PAGES" | "INFINITE_SCROLL"

export interface TableWidgetProps extends IWidgetProps {
  pageKey?: string;
  label: string
  tableData?: object[]
  onPageChange?: ActionPayload[]
  onRowSelected?: ActionPayload[]
  onColumnActionClick?: Record<string, ActionPayload[]>
}

export default TableWidget;
