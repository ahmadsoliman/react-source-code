import React from "react";
import {
  Container,
  Button,
  darkColors,
  lightColors,
} from "react-floating-action-button";
import styles from "./EnableSourceCodeButton.module.css";

type Props = {
  isEnabled: boolean;
  toggleHandler: () => void;
  scale?: number;
};

const EnableSourceCodeButton = ({
  isEnabled,
  toggleHandler,
  scale = 0.75,
}: Props) => {
  return (
    <Container
      className={styles.container}
      styles={{ transform: `scale(${scale})` }}
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
