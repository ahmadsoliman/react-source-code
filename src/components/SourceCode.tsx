import React from "react";
import { createRef, Fragment, MouseEvent, useState } from "react";
import styles from "./SourceCode.module.css";

type Props = {
  code: string;
  onClick: (_: MouseEvent) => void;
};

export default function SourceCode({ onClick, code }: Props) {
  const divRef = createRef<HTMLDivElement>();

  const [isDown, setIsDown] = useState(false);
  const [offset, setOffset] = useState([0, 0]);

  const onMouseDown = (e: MouseEvent) => {
    setIsDown(true);

    if (divRef.current) {
      setOffset([
        divRef.current.offsetLeft - e.clientX,
        divRef.current.offsetTop - e.clientY,
        e.clientX - (divRef.current.offsetLeft + divRef.current.offsetWidth),
        e.clientY - (divRef.current.offsetTop + divRef.current.offsetHeight),
      ]);
    }
  };

  const onMouseUp = () => {
    setIsDown(false);
  };

  const onMouseMove = (event: MouseEvent) => {
    event.preventDefault();

    if (isDown) {
      const mousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
      if (divRef.current) {
        divRef.current.style.bottom = "0px";
        divRef.current.style.right = "0px";

        divRef.current.style.left = mousePosition.x + offset[0] + "px";
        if (mousePosition.x + offset[0] < 0) {
          divRef.current.style.left = "0px";
          divRef.current.style.right =
            window.innerWidth - mousePosition.x + offset[2] + "px";
        }
        divRef.current.style.top = mousePosition.y + offset[1] + "px";
        if (mousePosition.y + offset[1] < 0) {
          divRef.current.style.top = "0px";
          divRef.current.style.bottom =
            window.innerHeight - mousePosition.y + offset[3] + "px";
        }
      }

      // wth ? 
      // if (divRef.current) {
      //   if (
      //     mousePosition.x + offset[0] < 0 ||
      //     divRef.current.offsetWidth < divRef.current.scrollWidth
      //   ) {
      //     divRef.current.style.left = "0px";
      //     divRef.current.style.right =
      //       window.innerWidth - mousePosition.x + offset[2] + "px";
      //   } else if (
      //     divRef.current.offsetLeft + divRef.current.offsetWidth >=
      //       window.innerWidth &&
      //     divRef.current.offsetWidth < divRef.current.scrollWidth
      //   ) {
      //     divRef.current.style.left = mousePosition.x + offset[0] + "px";
      //     divRef.current.style.right = "0px";
      //   } else {
      //     divRef.current.style.right =
      //       window.innerWidth -
      //       (mousePosition.x + offset[0] + divRef.current.scrollWidth) +
      //       "px";
      //     divRef.current.style.left = mousePosition.x + offset[0] + "px";
      //   }

      //   if (
      //     mousePosition.y + offset[1] < 0 ||
      //     (divRef.current.offsetTop <= 0 &&
      //       divRef.current.offsetHeight < divRef.current.scrollHeight)
      //   ) {
      //     divRef.current.style.top = "0px";
      //     divRef.current.style.bottom =
      //       window.innerHeight - mousePosition.y + offset[3] + "px";
      //   } else if (
      //     divRef.current.offsetTop + divRef.current.offsetHeight >=
      //       window.innerHeight &&
      //     divRef.current.offsetHeight < divRef.current.scrollHeight
      //   ) {
      //     divRef.current.style.top = mousePosition.y + offset[1] + "px";
      //     divRef.current.style.bottom = "0px";
      //   } else {
      //     divRef.current.style.bottom =
      //       window.innerHeight -
      //       (mousePosition.y + offset[1] + divRef.current.scrollHeight) +
      //       "px";
      //     divRef.current.style.top = mousePosition.y + offset[1] + "px";
      //   }
      // }
    }
  };

  return (
    <div
      ref={divRef}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      className={styles.code}
    >
      <code>
        {code.split("\n").map((line, i) => (
          <div key={i}>
            {line.split("  ").map((segment, j) => (
              <Fragment key={j}>&nbsp;&nbsp;{segment}</Fragment>
            ))}
          </div>
        ))}
      </code>
      <div>
        <div className={styles.closebtn} onClick={onClick}>
          &#10060;
        </div>
      </div>
    </div>
  );
}
