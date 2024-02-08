import {useNavigation} from '@remix-run/react';

/**
 * Get navigation optimistic data and pending state.
 * It basically looks for optimistic data in the next location state
 * and compares the optimistic id with the provided id.
 * @returns Optimistic data and navigation pending state
 * @example
 * const {data, pending} = useOptimisticNavigationData<OptimisticData>(id);
 */
export function useOptimisticNavigationData<T>(id: string): {
  optimisticData: T | null;
  pending: boolean;
} {
  const {location, state} = useNavigation();
  const optimisticData = location?.state?.optimisticData;
  const optimisticId = location?.state?.optimisticId;
  const pending = state !== 'idle';

  if (id === optimisticId && optimisticData) {
    return {
      optimisticData,
      pending,
    };
  }

  return {
    optimisticData: null,
    pending,
  };
}
