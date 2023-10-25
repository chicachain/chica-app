import { configureStore } from '@reduxjs/toolkit';

import geoLocationReducer from './geoLocationSlice';

const store = configureStore({
  reducer: {
    geoLocation: geoLocationReducer,
  },
});

export default store;
