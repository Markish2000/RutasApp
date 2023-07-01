import {useContext} from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import {PermissionsScreen} from '../screens/PermissionsScreen';
import {LoadingScreen} from '../screens/LoadingScreen';
import {MapScreen} from '../screens/MapScreen';

import {PermissionsContext} from '../context/PermissionsContext';

const Stack = createStackNavigator();

export const Navigator = () => {
  const {permissions} = useContext(PermissionsContext);

  if (permissions.locationStatus === 'unavailable') {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {backgroundColor: 'white'},
      }}>
      {permissions.locationStatus === 'granted' ? (
        <Stack.Screen name="MapScreen" component={MapScreen} />
      ) : (
        <Stack.Screen name="PermissionsScreen" component={PermissionsScreen} />
      )}
    </Stack.Navigator>
  );
};
