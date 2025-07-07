import { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';

export const useD3 = (renderChartFn: (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => void, dependencies: unknown[] = []) => {
  const ref = useRef<SVGSVGElement>(null);

  const memoizedRenderFn = useCallback(renderChartFn, [renderChartFn, ...dependencies]);

  useEffect(() => {
    if (ref.current) {
      const svg = d3.select(ref.current);
      svg.selectAll("*").remove(); // Limpiar el SVG antes de renderizar
      memoizedRenderFn(svg);
    }
  }, [memoizedRenderFn]);

  return ref;
};
