import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
  fetchAndActivate,
  getRemoteConfig,
  getString,
} from '@react-native-firebase/remote-config';

const VERSION_KEY =
  Platform.OS === 'ios'
    ? 'ios_current_version'
    : 'android_current_version';

const DESCRIPTION_KEY = 'update_description';
const DEFAULT_MESSAGE = 'Please update GuardHQ to continue.';

// Returns true if installed version is older than required
const isOlderVersion = (installed, required) =>
  installed.localeCompare(required, undefined, {
    numeric: true,
  }) < 0;

// Fetches remote config and returns an update message
// if the app is outdated, otherwise null.
export const getForceUpdate = async () => {
  try {
    const config = getRemoteConfig();

    // Skip cache in development.
    // Use 1-hour cache in production.
    config.settings = {
      minimumFetchIntervalMillis: __DEV__ ? 0 : 3_600_000,
      fetchTimeoutMillis: 60_000,
    };

    // Fallback values if Remote Config fetch fails
    config.defaultConfig = {
      [VERSION_KEY]: '0.0.0',
      [DESCRIPTION_KEY]: DEFAULT_MESSAGE,
    };

    await fetchAndActivate(config);

    // const requiredVersion = getString(config, VERSION_KEY);

    const message =
      getString(config, DESCRIPTION_KEY) || DEFAULT_MESSAGE;
console.log("DeviceInfo.getVersion()->", DeviceInfo.getVersion())

const installedVersion = DeviceInfo.getVersion();
const requiredVersion = getString(config, VERSION_KEY);

console.log('Installed version =>', installedVersion);
console.log('Required version =>', requiredVersion);

const isUpdateRequired = isOlderVersion(
  installedVersion,
  requiredVersion,
);

console.log('Is update required =>', isUpdateRequired);

return isUpdateRequired
  ? getString(config, DESCRIPTION_KEY) || DEFAULT_MESSAGE
  : null;
    // Show update prompt only if installed version is behind
    return isOlderVersion(
      DeviceInfo.getVersion(),
      requiredVersion,
    )
      ? message
      : null;

      
  } catch {
    return null;
  }
};