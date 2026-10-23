import { Redirect } from 'expo-router';

/** Discover was merged into Explore in the new navigation. */
export default function DiscoverRedirect() {
  return <Redirect href="/(tabs)/explore" />;
}
