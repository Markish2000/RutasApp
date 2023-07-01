import {useEffect, useRef, useState} from 'react';

import {Location} from '../../interfaces';

import {getCurrentLocation} from '../../helper/getCurrentLocation';
import Geolocation from '@react-native-community/geolocation';

export const useLocation = () => {
  const [hasLocation, setHasLocation] = useState(false);

  const [routerLines, setRouterLines] = useState<Location[]>([]);

  const [initialPosition, setInitialPosition] = useState<Location>({
    longitude: 0,
    latitude: 0,
  });

  const [userLocation, setUserLocation] = useState<Location>({
    longitude: 0,
    latitude: 0,
  });

  const watchId = useRef<number>();

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    getCurrentLocation().then(location => {
      if (!isMounted.current) return;
      setInitialPosition(location);
      setUserLocation(location);
      setRouterLines(routes => [...routes, location]);
      setHasLocation(true);
    });
  }, []);

  const followUserLocation = () => {
    watchId.current = Geolocation.watchPosition(
      ({coords: {latitude, longitude}}) => {
        if (!isMounted.current) return;

        const location: Location = {latitude, longitude};

        setUserLocation(location);

        setRouterLines(routes => [...routes, location]);
      },
      err => console.log(err),
      {enableHighAccuracy: true, distanceFilter: 10},
    );
  };

  const stopFollowUserLocation = () => {
    if (watchId.current) {
      Geolocation.clearWatch(watchId.current);
    }
  };

  return {
    hasLocation,
    initialPosition,
    getCurrentLocation,
    followUserLocation,
    userLocation,
    stopFollowUserLocation,
    routerLines,
  };
};
