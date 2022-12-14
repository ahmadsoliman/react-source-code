import React, {
  MouseEvent,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import SourceCode from "../components/SourceCode";
import getSourceCodes from "../utilities/getSourceCodes";

const NOT_FOUND =
  '"Code couldn\'t be found. Please supply the correct path of the component."';
type GlobalState = typeof globalState;

let globalState = {
  sources: [] as string[],
  codes: {} as { [key: string]: string },
  codeMemo: {} as { [component: string]: ReactNode },
  isEnabled: false,
  activeComponent: null as string | null,
  activeComponentCode: null as ReactNode,
  getComponentCode: (filePath: string): ReactNode => {
    filePath = (filePath || "").trim().toLowerCase();
    const sources = globalState.sources;

    const onClick = (event: MouseEvent) => {
      event.stopPropagation();
      dispatch("SET_ACTIVE_COMPONENT", null);
    };

    if (sources.length === 0 || !filePath) {
      return <SourceCode code={NOT_FOUND} onClick={onClick}></SourceCode>;
    }

    // Split path on "\\" or "\" or "//" or "/" with char escapes
    const pathArr = filePath.toLowerCase().split(/\\\\|\\|\/\/|\//g) || [];

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
      candidates.length === 0 || !globalState.codes[candidates[0]]
        ? NOT_FOUND
        : globalState.codes[candidates[0]];

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
const getSourceCodesAndSave = (bundleMapPath: string) =>
  getSourceCodes(bundleMapPath).then(
    (source) =>
      (globalState = {
        ...globalState,
        ...source,
      })
  );
getSourceCodesAndSave(bundleMapPath);

const actions = {
  TOGGLE_HANDLER: (curState: GlobalState) => {
    return {
      ...curState,
      isEnabled: !curState.isEnabled,
      activeComponent: null,
      activeComponentCode: null,
    };
  },
  SET_ACTIVE_COMPONENT: (curState: GlobalState, payload: string) => {
    return {
      ...curState,
      activeComponent: payload,
      activeComponentCode:
        payload !== null ? curState.getComponentCode(payload) : null,
    };
  },
};

export const useStore = (bundleMapPath?: string) => {
  const setState = useState(globalState)[1];

  useEffect(() => {
    listeners.push(setState);

    if (bundleMapPath) {
      getSourceCodesAndSave(bundleMapPath).then(
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
  }, [bundleMapPath, setState]);

  return { store: globalState, dispatch };
};
