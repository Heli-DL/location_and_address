import { StyleSheet, TextInput , View, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useState, useEffect } from 'react';
import { API_KEY } from '@env';
import * as Location from 'expo-location';

const apikey = API_KEY;

export default function App() {
  const [address, setAddress] = useState('');
  const [markerText, setMarkerText] = useState('');
  const [region, setRegion] = useState({
    latitude: 60.1699,
    longitude: 24.9384,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('No permission to get location')
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        ...region,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      console.log(region);
    })();      
  }, []);

const getCoordinates = () => {
  fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=${apikey}&location=${address}`, {
  })
  .then(response => response.json())
  .then(data => {
    console.log(data.results[0].locations[0].latLng);
    setRegion({
      ...region,
      latitude: data.results[0].locations[0].latLng.lat,
      longitude: data.results[0].locations[0].latLng.lng
    });
    setMarkerText(address);
  })
  .catch(error => {
    console.error(error);
  });
}

  return (
    <View style={styles.container}>
        <MapView
          style={styles.map}
          region={region}
          >
          <Marker
          coordinate={{
            latitude: region.latitude, 
            longitude: region.longitude }}
            title= {markerText} />
        </MapView>
      <View style={styles.input}>
      <TextInput
        style={{fontSize: 18, width: 200, height: 40, marginBottom: 5}}
        placeholder='Address'
        value={address}
        onChangeText={text => setAddress(text)}
      />
      <Button title="Show" onPress={getCoordinates} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '80%',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginTop: 20,
    paddingHorizontal: 10,
  },
});
