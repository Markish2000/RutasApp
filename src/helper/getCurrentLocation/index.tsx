import Geolocation from '@react-native-community/geolocation';

import {Location} from '../../interfaces';

export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      ({coords}) => {
        resolve({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      },
      err => reject({err}),
      {enableHighAccuracy: true},
    );
  });
};
