import React, {
  FC,
  MouseEvent,
  ReactNode,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import SourceCode from "../components/SourceCode";
import getSourceCodes from "../utilities/GetSourceCodes";

type GlobalState = typeof globalState;

let globalState = {
  sources: [] as string[],
  codes: {} as { [key: string]: string },
  codeMemo: {} as { [component: string]: ReactNode },
  isEnabled: false,
  activeComponent: null as string | null,
  activeComponentCode: null as ReactNode,
  getComponentOnClick: (Component: FC, ref: RefObject<HTMLDivElement>) => {
    // @ts-ignore
    const parentPath = (<Component />)._source.fileName;
    debugger;
    return (event: MouseEvent) => {
      // if this is the last with-code component in capturing phase then stop propagation to disable contained component click events
      if (!ref.current?.querySelector("[data-component-type=with-code]")) {
        event.stopPropagation();
      }

      if (globalState.isEnabled) {
        dispatch("SET_ACTIVE_COMPONENT", parentPath);
      }
    };
  },
  getComponentCode: (filePath: string): ReactNode => {
    const sources = globalState.sources;
    if (sources.length === 0) return null;

    // Split path on "\\" or "\" or "//" or "/" with char escapes
    const pathArr = filePath.split(/\\\\|\\|\/\/|\//g) || [];

    let fileKey = "";
    let candidates = sources;

    if (!!pathArr.length) {
      let i = pathArr.length - 1;
      fileKey = "\\";
      while (i >= 0 && candidates.length > 1) {
        fileKey += pathArr[i] + "\\";
        const ii = i; // capture i to make it safe for filter predicate
        candidates = candidates.filter((source) =>
          source.includes(pathArr[ii])
        );
        i--;
      }
    }
    if (!fileKey.length) {
      return null;
    }
    if (globalState.codeMemo[fileKey]) return globalState.codeMemo[fileKey];

    const code =
      candidates.length === 0
        ? '"Code couldn\'t be found."'
        : globalState.codes[candidates[0]];

    const onClick = (event: MouseEvent) => {
      event.stopPropagation();
      dispatch("SET_ACTIVE_COMPONENT", null);
    };

    return (globalState.codeMemo[fileKey] = (
      <SourceCode code={code} onClick={onClick}></SourceCode>
    ));
  },
};

const listeners: React.Dispatch<SetStateAction<GlobalState>>[] = [];

const dispatch = (actionIdentefier: keyof typeof actions, payload?: any) => {
  const newState = actions[actionIdentefier](globalState, payload);
  globalState = { ...globalState, ...newState };
  listeners.forEach((listener) => listener(globalState));
};

// initialise source codes
const bundleMapPath = "/static/js/bundle.js.map";
getSourceCodes(bundleMapPath).then(
  (source) =>
    (globalState = {
      ...globalState,
      ...source,
    })
);

const actions = {
  TOGGLE_HANDLER: (curState: GlobalState) => {
    return {
      ...curState,
      isEnabled: !curState.isEnabled,
      activeComponent: null,
    };
  },
  SET_ACTIVE_COMPONENT: (curState: GlobalState, payload: string) => {
    return {
      ...curState,
      activeComponent: payload,
      activeComponentCode: payload ? curState.getComponentCode(payload) : null,
    };
  },
};

export const useStore = (bundleMapPath?: string) => {
  const setState = useState(globalState)[1];

  useEffect(() => {
    listeners.push(setState);

    if (bundleMapPath) {
      getSourceCodes(bundleMapPath).then(
        (source) =>
          (globalState = {
            ...globalState,
            ...source,
          })
      );
    }

    return () => {
      const index = listeners.indexOf(setState);
      listeners.splice(index, 1);
    };
  }, []);

  return { store: globalState, dispatch };
};
