import React from "react";
import {
  createRef,
  MouseEvent,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import { ComponentSourceCodeContext } from "../store/ComponentSourceCodeContext";

const shadow =
  "0 0 5px 1px #dcedc8, 0 0 7px 4px #ddd, 0 0 5px 1px #dcedc8 inset, 0 0 8px 5px #ddd inset";

const WithSourceCodeWrapper = ({ children }: { children?: ReactNode }) => {
  const { getComponentOnClick, isEnabled } = useContext(
    ComponentSourceCodeContext
  );

  const ref = createRef<HTMLDivElement>();

  const onClick = useMemo(
    () => getComponentOnClick(children, ref),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isEnabled, ref]
  );

  const [isHighlighted, setIsHighlighted] = useState(false);

  if (!isEnabled) {
    return <>{children}</>;
  }

  const onMouseEnter = (e: MouseEvent) => {
    setIsHighlighted(true);
  };

  const onMouseLeave = (e: MouseEvent) => {
    setIsHighlighted(false);
  };

  return (
    <>
      <div
        ref={ref}
        data-type="with-code"
        onClickCapture={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          cursor: isEnabled ? "zoom-in" : "default",
          boxShadow: isHighlighted ? shadow : "none",
        }}
      >
        {children}
      </div>
    </>
  );
};

export default WithSourceCodeWrapper;
