import React, { useCallback, useRef, useState } from 'react';

const LoadingContext = React.createContext<boolean>(false);
const SetLoadingContext = React.createContext<(loading: boolean) => void>(() => {});

export function useLoading() {
  return React.useContext(LoadingContext);
}

export function useSetLoading() {
  return React.useContext(SetLoadingContext);
}

export function LoadingProvider(props: { children?: React.ReactNode }) {
  const [loading, _setLoading] = useState(false);
  const stack = useRef<Array<any>>([]);
  const setLoading = useCallback((l) => {
    if (l) stack.current.push(true);
    else stack.current.pop();
    if (stack.current.length === 0) _setLoading(false);
    else _setLoading(true);
  }, []);

  return (
    <SetLoadingContext.Provider value={setLoading}>
      <LoadingContext.Provider value={loading}>{props.children}</LoadingContext.Provider>
    </SetLoadingContext.Provider>
  );
}
