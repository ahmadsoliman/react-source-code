import React from "react";
import {
  Container,
  Button,
  darkColors,
  lightColors,
} from "react-floating-action-button";
import styles from "./EnableSourceCodeButton.module.css";

type Props = {
  toggleHandler: () => void;
  isEnabled: boolean;
  scale?: number;
};

const EnableSourceCodeButton = ({
  toggleHandler,
  isEnabled,
  scale = 0.75,
}: Props) => {
  return (
    <Container
      styles={{
        opacity: 0.9,
        bottom: 24,
        right: 24,
        transform: `scale(${scale})`,
      }}
    >
      <div className={`${styles.tooltip} ${isEnabled ? styles.enabled : ""}`}>
        {!isEnabled && "Check component's source code"}
        {isEnabled &&
          "Click on any component to see its source code, click again to disable this feature"}
      </div>
      <Button
        onClick={toggleHandler}
        tooltip={isEnabled ? "Disable" : null}
        styles={{
          backgroundColor: isEnabled
            ? darkColors.lighterRed
            : lightColors.green,
          color: isEnabled ? darkColors.white : lightColors.black,
        }}
      >
        {isEnabled ? <>&#x2718;</> : "</>"}
      </Button>
    </Container>
  );
};

export default EnableSourceCodeButton;
