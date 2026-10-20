import { useRef, useState } from "react";
export function useForm(initial, revision) {
  const [values, setValues] = useState(initial),
    [error, setError] = useState(""),
    dirty = useRef(false),
    rev = useRef(revision);
  return {
    values,
    setValues,
    error,
    setError,
    dirty,
    rev,
    change: (key, value) => {
      dirty.current = true;
      setValues((v) => ({ ...v, [key]: value }));
    },
    clean: () => {
      dirty.current = false;
    },
  };
}
