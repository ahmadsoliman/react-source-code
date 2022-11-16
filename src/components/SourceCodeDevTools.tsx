import React from "react";
import { useStore } from "../store/use-store";
import EnableSourceCodeButton from "./EnableSourceCodeButton";

export const SourceCodeDevTools = ({
  bundleMapPath,
}: {
  bundleMapPath?: string;
}) => {
  const { store, dispatch } = useStore(bundleMapPath);
  const toggleHandler = () => dispatch("TOGGLE_HANDLER");
  return (
    <>
      {store.isEnabled && store.activeComponentCode}
      <EnableSourceCodeButton
        toggleHandler={toggleHandler}
        isEnabled={store.isEnabled}
      />
    </>
  );
};
