import React, { useState, useLayoutEffect, MutableRefObject } from "react";
import styled from "styled-components";
import { WidgetProps, WidgetOperations } from "../widgets/BaseWidget";
import { useDrop, XYCoord } from "react-dnd";
import { ContainerProps } from "./ContainerComponent";
import WidgetFactory from "../utils/WidgetFactory";
import DropZone from "./Dropzone";
import { snapToGrid } from "../utils/helpers";

const DEFAULT_CELL_SIZE = 1;
const DEFAULT_WIDGET_WIDTH = 200;
const DEFAULT_WIDGET_HEIGHT = 50;

type DropTargetComponentProps = ContainerProps & {
  updateWidget?: Function;
};

const WrappedDropTarget = styled.div`
  background: white;
`;
const DropTargetMask = styled.div`
  position: absolute;
  z-index: -10;
  left: 0;
  right: 0;
`;

export const DropTargetComponent = (props: DropTargetComponentProps) => {
  const [dummyState, setDummyState] = useState({ x: 0, y: 0 });
  const [dropTargetTopLeft, setDropTargetTopLeft] = useState({ x: 0, y: 0 });
  const dropTargetMask: MutableRefObject<HTMLDivElement | null> = React.useRef(
    null,
  );
  useLayoutEffect(() => {
    const el = dropTargetMask.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      setDropTargetTopLeft({
        x: rect.left,
        y: rect.top,
      });
    }
  }, [setDropTargetTopLeft]);

  const [{ isOver, clientOffset }, drop] = useDrop({
    accept: Object.values(WidgetFactory.getWidgetTypes()),
    drop(item: WidgetProps, monitor) {
      if (monitor.isOver({ shallow: true })) {
        const item = monitor.getItem();
        if (clientOffset) {
          const [x, y] = snapToGrid(
            DEFAULT_CELL_SIZE,
            clientOffset.x - dropTargetTopLeft.x,
            clientOffset.y - dropTargetTopLeft.y,
          );
          props.updateWidget &&
            props.updateWidget(WidgetOperations.ADD_CHILD, props.widgetId, {
              type: item.type,
              left: x,
              top: y,
              width:
                Math.round(DEFAULT_WIDGET_WIDTH / DEFAULT_CELL_SIZE) *
                DEFAULT_CELL_SIZE,
              height:
                Math.round(DEFAULT_WIDGET_HEIGHT / DEFAULT_CELL_SIZE) *
                DEFAULT_CELL_SIZE,
            });
        }
      }

      return undefined;
    },
    hover: (item, monitor) => {
      setDummyState(monitor.getDifferenceFromInitialOffset() as XYCoord);
    },
    collect: monitor => ({
      hovered: !!monitor.isOver(),
      isOver: !!monitor.isOver({ shallow: true }),
      clientOffset: monitor.getClientOffset(),
    }),
    canDrop: (item, monitor) => {
      return monitor.isOver({ shallow: true });
    },
  });
  return (
    <WrappedDropTarget
      ref={drop}
      style={{
        position: "absolute",
        left: props.style.xPosition + props.style.xPositionUnit,
        height: props.style.height,
        width: props.style.width,
        background: isOver ? "#f4f4f4" : undefined,
        top: props.style.yPosition + props.style.yPositionUnit,
      }}
    >
      <DropTargetMask ref={dropTargetMask} />
      <DropZone
        parentOffset={dropTargetTopLeft}
        width={DEFAULT_WIDGET_WIDTH}
        height={DEFAULT_WIDGET_HEIGHT}
        cellSize={DEFAULT_CELL_SIZE}
        visible={isOver}
        currentOffset={clientOffset as XYCoord}
        dummyState={dummyState}
      />
      {props.children}
    </WrappedDropTarget>
  );
};

export default DropTargetComponent;
