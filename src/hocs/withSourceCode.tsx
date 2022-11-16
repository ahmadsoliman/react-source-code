import React, { FC, MouseEvent } from "react";
import { createRef, useState } from "react";
import { useStore } from "../store/use-store";
import { isFunction } from "../utilities/isFunction";

const shadow =
  "0 0 4px 1px #dcedc8, 0 0 6px 3px #ddd, 0 0 4px 1px #dcedc8 inset, 0 0 7px 4px #ddd inset";

export const withSourceCode =
  (WrappedComponent: FC | typeof React.Component, componentPath?: string) =>
  (props: any) => {
    const { store, dispatch } = useStore();
    const ref = createRef<HTMLDivElement>();

    let path = componentPath ? componentPath : "";
    if (isFunction(WrappedComponent)) {
      // @ts-ignore
      path = componentPath || WrappedComponent()._source?.fileName;
    }

    const onClick = (event: MouseEvent) => {
      // if this is the last with-code component in capturing phase then stop propagation to disable wrapped component click events
      if (!ref.current?.querySelector("[data-component-type=with-code]")) {
        event.stopPropagation();
      }

      dispatch("SET_ACTIVE_COMPONENT", path);
    };

    const [isHighlighted, setIsHighlighted] = useState(false);

    if (!store.isEnabled) {
      return <WrappedComponent {...props} />;
    }

    const onMouseEnter = () => setIsHighlighted(true);
    const onMouseLeave = () => setIsHighlighted(false);

    return (
      <div
        ref={ref}
        data-component-type="with-code"
        onClickCapture={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          cursor: "zoom-in",
          boxShadow: isHighlighted ? shadow : "none",
        }}
      >
        <WrappedComponent {...props} />
      </div>
    );
  };
