import { useCallback, useEffect, useRef } from 'react';

type SelectionKey = number | string;

export function useSelectionScroll<Element extends HTMLElement>(
  selectedKey: SelectionKey | null | undefined,
  dependencies: readonly unknown[] = [],
) {
  const elementMapRef = useRef(new Map<SelectionKey, Element>());

  const registerSelectionTarget = useCallback(
    (key: SelectionKey) => (node: Element | null) => {
      if (node) {
        elementMapRef.current.set(key, node);
        return;
      }

      elementMapRef.current.delete(key);
    },
    [],
  );

  useEffect(() => {
    if (selectedKey === null || selectedKey === undefined) return;

    const node = elementMapRef.current.get(selectedKey);
    if (!node) return;

    node.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
    });
  }, [selectedKey, ...dependencies]);

  return registerSelectionTarget;
}
