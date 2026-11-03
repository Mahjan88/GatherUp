import * as Location from 'expo-location';
import type { NearLocation } from '@gatherup/api-client';

export interface UserLocation extends NearLocation {
  /** Device GPS, or the city saved in the user's profile */
  source: 'device' | 'profile';
}

/**
 * Where to sort results from: the device location if the user allows it,
 * otherwise their profile city geocoded on the device. Null when neither
 * is available, in which case results stay sorted by date.
 */
export async function getUserLocation(
  profileCity?: string | null
): Promise<UserLocation | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const position =
        (await Location.getLastKnownPositionAsync()) ??
        (await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        }));
      return {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        source: 'device',
      };
    }
  } catch (e) {
    console.warn('Device location unavailable', e);
  }

  if (!profileCity?.trim()) return null;
  try {
    const [match] = await Location.geocodeAsync(profileCity);
    return match
      ? { lat: match.latitude, lng: match.longitude, source: 'profile' }
      : null;
  } catch (e) {
    console.warn('Could not geocode profile city', e);
    return null;
  }
}
