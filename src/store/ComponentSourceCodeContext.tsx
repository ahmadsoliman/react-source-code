import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
  MouseEvent,
  MouseEventHandler,
  RefObject,
} from "react";
import SourceCode from "../components/SourceCode";
import GetSourceCodes from "../utilities/GetSourceCodes";
import EnableSourceCodeButton from "../components/EnableSourceCodeButton";

export const ComponentSourceCodeContext = createContext<{
  getComponentOnClick: (
    children: ReactNode,
    ref: RefObject<HTMLDivElement>
  ) => MouseEventHandler;
  isEnabled: boolean;
}>({
  getComponentOnClick: (_) => () => {},
  isEnabled: false,
});

const ComponentSourceCodeContextProvider = ({
  children,
  bundleMapPath,
}: {
  children: ReactNode;
  bundleMapPath?: string;
}) => {
  const [isEnabled, setIsEnabled] = useState(false);

  const [codes, setCodes] = useState<{ [key: string]: string }>({});
  const [sources, setSources] = useState<string[]>([]);

  useEffect(() => {
    GetSourceCodes(bundleMapPath).then(({ codes, sources }) => {
      setCodes(codes);
      setSources(sources);
    });
  }, [bundleMapPath]);

  const [codeMemo, setCodeMemo] = useState<{ [component: string]: ReactNode }>(
    {}
  );

  const getComponentCode = useCallback(
    (
      filePath?: string,
      onClick: (_: MouseEvent) => void = (_: MouseEvent) => {}
    ): ReactNode => {
      if (sources.length === 0) return null;

      // Split path on "\\" or "\" or "//" or "/" with char escapes
      const pathArr = filePath?.split(/\\\\|\\|\/\/|\//g) || [];

      let fileKey = "";
      let candidates = sources;

      if (!!pathArr.length) {
        let i = pathArr.length - 1;
        fileKey = "";
        while (i >= 0 && candidates.length > 1) {
          fileKey += "\\" + pathArr[i];
          const ii = i; // capture i to make it safe for filter predicate
          candidates = candidates.filter((source) =>
            source.includes(pathArr[ii])
          );
          i--;
        }
        if (codeMemo[fileKey]) return codeMemo[fileKey];
      }
      if (!fileKey.length) {
        return null;
      }

      const code =
        candidates.length === 0
          ? '"Code couldn\'t be found."'
          : codes[candidates[0]];

      const returnValue = (
        <SourceCode code={code} onClick={onClick}></SourceCode>
      );

      setCodeMemo((oldMemo) => ({ ...oldMemo, [fileKey]: returnValue }));
      return returnValue;
    },
    [codes, sources, codeMemo]
  );

  const [activeComponent, setActiveComponent] =
    useState<string | undefined>(undefined);
  const [activeComponentCode, setActiveComponentCode] = useState<ReactNode>();

  const onClick = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    setActiveComponent(undefined);
  }, []);

  useEffect(() => {
    const code = getComponentCode(activeComponent, onClick);
    setActiveComponentCode(code);
  }, [activeComponent, onClick, getComponentCode]);

  const getParentPath = (children: ReactNode) => {
    let parentPath = "";
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        // @ts-ignore
        parentPath = child._source.fileName;
      }
    });
    return parentPath;
  };

  const getComponentOnClick = useCallback(
    (children: ReactNode, ref: RefObject<HTMLDivElement>) => {
      const parentPath = getParentPath(children);
      return (event: MouseEvent) => {
        // if this is the last with-code component in capturing phase
        // then stop propagation to disable contained app click events
        if (!ref.current?.querySelector("[data-type=with-code]")) {
          event.stopPropagation();
        }

        if (isEnabled) {
          setActiveComponent(parentPath);
        }
      };
    },
    [isEnabled]
  );

  const toggleHandler = () => {
    setIsEnabled((enabled) => {
      const newValue = !enabled;
      if (!newValue) {
        setActiveComponent(undefined);
      }
      return newValue;
    });
  };

  return (
    <ComponentSourceCodeContext.Provider
      value={{
        getComponentOnClick,
        isEnabled,
      }}
    >
      {children}
      {activeComponentCode}
      <EnableSourceCodeButton
        toggleHandler={toggleHandler}
        isEnabled={isEnabled}
      />
    </ComponentSourceCodeContext.Provider>
  );
};

export const ComponentSourceCodeProvider = ComponentSourceCodeContextProvider;

// const recursiveMap = useCallback(
//   (children: ReactNode, fn = childWithCode): ReactNode => {
//     return React.Children.map(children, (child) => {
//       if (!React.isValidElement(child)) {
//         return child;
//       }
//       if (child.props.children) {
//         child = React.cloneElement(child, {
//           children: recursiveMap(child.props.children, fn),
//         } as Partial<unknown>);
//       }
//       return fn(child);
//     });
//   },
//   [childWithCode]
// );
