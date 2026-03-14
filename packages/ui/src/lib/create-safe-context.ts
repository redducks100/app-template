import { createContext, useContext } from "react";

export function createSafeContext<T>(componentName: string) {
  const Context = createContext<T | null>(null);

  function useSafeContext() {
    const ctx = useContext(Context);
    if (!ctx)
      throw new Error(
        `${componentName} compound components must be used within <${componentName}>`,
      );
    return ctx;
  }

  return [Context.Provider, useSafeContext] as const;
}
