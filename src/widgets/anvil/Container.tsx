import type { ReactNode } from "react";
import React from "react";
import styled from "styled-components";
import { generateClassName } from "utils/generators";
import type { Elevations } from "./constants";

/**
 * This container component wraps the Zone and Section widgets and allows Anvil to utilise tokens from the themes
 * `elevatedBackground` is a boolean value that describes whether the elevation styles should be applied
 * `elevation` is the value of the elevation. Zones have a higher elevation than Sections.
 *
 * Also, in the case of zones, we're removing all padding.
 */
const StyledContainerComponent = styled.div<
  Omit<ContainerComponentProps, "widgetId">
>`
  height: 100%;
  width: 100%;
  outline: none;
  border: none;
  position: relative;
  background-color: ${(props) =>
    props.elevatedBackground
      ? `var(--color-bg-elevation-${props.elevation})`
      : "inherit"};
  border-radius: ${(props) =>
    `var(--border-radius-elevation-${props.elevation})`};
  padding-block: var(--outer-spacing-0);
  padding-inline: var(--outer-spacing-0);

  border-width: var(--border-width-1);
`;

export function ContainerComponent(props: ContainerComponentProps) {
  return (
    <StyledContainerComponent
      className={`${generateClassName(props.widgetId)}`}
      data-elevation={props.elevatedBackground}
      elevatedBackground={props.elevatedBackground}
      elevation={props.elevation}
    >
      {props.children}
    </StyledContainerComponent>
  );
}

export interface ContainerComponentProps {
  widgetId: string;
  children?: ReactNode;
  elevation: Elevations;
  elevatedBackground: boolean;
}