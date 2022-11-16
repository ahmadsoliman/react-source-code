import React, { FC } from "react";
import { createRef, useState } from "react";
import { useStore } from "../store/use-store";

const shadow =
  "0 0 4px 1px #dcedc8, 0 0 6px 3px #ddd, 0 0 4px 1px #dcedc8 inset, 0 0 7px 4px #ddd inset";

export const withSourceCode = (Component: FC) => {
  const { store } = useStore();
  const ref = createRef<HTMLDivElement>();

  const onClick = store.getComponentOnClick(Component, ref);

  const [isHighlighted, setIsHighlighted] = useState(false);

  if (!store.isEnabled) {
    return <Component />;
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
      <Component />
    </div>
  );
};
