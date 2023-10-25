/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

// Util
import Utils from '../common/utils/Utils';

const initialState = {
  latitude: '',
  longitude: '',
  updateTime: new Date().toString(),
};

const geoLocationSlice = createSlice({
  name: 'geoLocationSlice',
  initialState,
  reducers: {
    getGeoLocation: state => {
      return state;
    },
    setGeoLocation: (state, action) => {
      state = {
        latitude: action.payload.latitude,
        longitude: action.payload.longitude,
        updateTime: action.payload.updateTime,
      };

      return state;
    },
  },
});

export const geoLocationActions = geoLocationSlice.actions;
export default geoLocationSlice.reducer;
