import {createQueryStore} from '@sanity/react-loader';

// This is the "smallest" possible version of a query store
// Where stega-enabled queries only happen server-side to avoid bundle bloat
export const queryStore = createQueryStore({client: false, ssr: true});

export const {loadQuery, useLiveMode, useQuery} = queryStore;
