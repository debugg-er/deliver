import { useCallback, useState } from 'react';

export default function useForceUpdate() {
  const [, setFlag] = useState(true);

  const forceUpdate = useCallback(() => {
    setFlag((flag) => !flag);
  }, []);

  return forceUpdate;
}
