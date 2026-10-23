import { Redirect } from 'expo-router';

/** Home was merged into Explore in the new navigation. */
export default function HomeRedirect() {
  return <Redirect href="/(tabs)/explore" />;
}
