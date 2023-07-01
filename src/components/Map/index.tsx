import {useEffect, useRef, useState} from 'react';

import MapView, {Polyline} from 'react-native-maps';

import {Fab} from '../Fab';

import {LoadingScreen} from '../../screens/LoadingScreen';

import {useLocation} from '../../hooks/useLocation';

export const Map = () => {
  const [showPolyline, setShowPolyline] = useState(true);

  const {
    hasLocation,
    initialPosition,
    getCurrentLocation,
    followUserLocation,
    userLocation,
    stopFollowUserLocation,
    routerLines,
  } = useLocation();

  const mapViewRef = useRef<MapView>();

  const following = useRef<boolean>(true);

  useEffect(() => {
    followUserLocation();
    return () => stopFollowUserLocation();
  }, []);

  useEffect(() => {
    if (!following.current) return;

    const {latitude, longitude} = userLocation;
    mapViewRef.current?.animateCamera({
      center: {latitude, longitude},
    });
  }, [userLocation]);

  const centerPosition = async () => {
    const {latitude, longitude} = await getCurrentLocation();
    following.current = true;
    mapViewRef.current?.animateCamera({
      center: {latitude, longitude},
    });
  };

  if (!hasLocation) {
    return <LoadingScreen />;
  }

  return (
    <>
      <MapView
        ref={element => (mapViewRef.current = element!)}
        style={{flex: 1}}
        showsUserLocation
        region={{
          latitude: initialPosition.latitude,
          longitude: initialPosition.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        onTouchStart={() => (following.current = false)}>
        {showPolyline && (
          <Polyline
            coordinates={routerLines}
            strokeColor="black"
            strokeWidth={3}
          />
        )}
        {/* <Marker
          image={require('../../assets/custommarker.png')}
          coordinate={{latitude: 37.78825, longitude: -122.4324}}
          title="Esto es un título"
          description="Esto es una descripción del marcador"
        /> */}
      </MapView>
      <Fab
        iconName="compass-outline"
        onPress={centerPosition}
        style={{position: 'absolute', bottom: 20, right: 20}}
      />
      <Fab
        iconName="brush-outline"
        onPress={() => setShowPolyline(!showPolyline)}
        style={{position: 'absolute', bottom: 80, right: 20}}
      />
    </>
  );
};
