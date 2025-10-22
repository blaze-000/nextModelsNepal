import { createTanstackQueryUtils } from '@orpc/tanstack-query';
import { orpc } from './orpc-client';

/**
 * TanStack Query utilities for ORPC
 * 
 * Usage with React Query:
 * ```tsx
 * import { useQuery } from '@tanstack/react-query';
 * 
 * function HeroSection() {
 *   const { data, isLoading } = useQuery(
 *     orpcQuery.hero.getLanding.queryOptions()
 *   );
 *   
 *   if (isLoading) return <div>Loading...</div>;
 *   return <div>{data?.hero?.titleImage}</div>;
 * }
 * ```
 */
export const orpcQuery = createTanstackQueryUtils(orpc);

