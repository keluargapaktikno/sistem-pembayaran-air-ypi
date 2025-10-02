// frontend-mobile/api/api.ts (KODE LENGKAP)
import axios from 'axios';
import { Platform, NativeModules } from 'react-native';
import Constants from 'expo-constants';
import { useAuthStore } from '../store/authStore';

// Resolve API base URL automatically for Expo/React Native dev, with env override
function resolveBaseURL(): string {
  // Highest priority: explicit env var from Expo
  const fromEnv = process.env.EXPO_PUBLIC_API_URL || process.env.API_URL;
  if (fromEnv && /^https?:\/\//.test(fromEnv)) {
    return fromEnv;
  }

  // Try to derive host IP from Metro bundler script URL in dev
  // e.g. 'http://192.168.1.6:8082/index.bundle?platform=android&dev=true&minify=false'
  // First, try Expo Constants (works well in Expo Go)
  const linkingUri: string | undefined = (Constants as any)?.linkingUri;
  const hostUri: string | undefined = (Constants as any)?.expoConfig?.hostUri;
  const fromConstants = linkingUri || hostUri;
  if (fromConstants) {
    try {
      let host = '';
      // fromConstants may be like 'exp://192.168.1.6:8082' or '192.168.1.6:8082'
      if (/^\w+:\/\//.test(fromConstants)) {
        const u = new URL(fromConstants);
        host = u.hostname;
      } else {
        host = fromConstants.split(':')[0];
      }
      host = host.replace('localhost', '127.0.0.1');
      if (host && host !== '127.0.0.1') {
        return `http://${host}:3001`;
      }
    } catch {
      // ignore and continue
    }
  }

  // Then, try React Native SourceCode scriptURL
  const scriptURL: string | undefined = (NativeModules as any)?.SourceCode?.scriptURL;
  if (scriptURL) {
    try {
      // Handle http(s):// and exp:// uniformly
      let host = '';
      try {
        const u = new URL(scriptURL);
        host = u.hostname;
      } catch {
        // Fallback regex for non-standard URL polyfills
        const m = scriptURL.match(/^\w+:\/\/([^/:]+)(?::\d+)?/);
        host = m?.[1] || '';
      }
      host = host.replace('localhost', '127.0.0.1');
      if (host && host !== '127.0.0.1') {
        return `http://${host}:3001`;
      }
    } catch {
      // ignore parse error and fall through
    }
  }

  // Emulators fallbacks
  if (Platform.OS === 'android') {
    // Android Emulator maps host loopback via 10.0.2.2
    return 'http://10.0.2.2:3001';
  }
  if (Platform.OS === 'ios') {
    // iOS Simulator can access localhost directly
    return 'http://127.0.0.1:3001';
  }

  // Generic fallback
  return 'http://127.0.0.1:3001';
}

const API_BASE_URL = resolveBaseURL();
// Helpful during dev to confirm the base URL being used
// eslint-disable-next-line no-console
console.warn('[API BASE URL]', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Attach Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.warn('[API REQUEST]', config.method?.toUpperCase(), config.url, 'with token');
    } else {
      console.warn('[API REQUEST]', config.method?.toUpperCase(), config.url, 'NO TOKEN');
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Optional: log response errors to help diagnose Network Error vs 401, etc.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response) {
      console.warn('[API ERROR]', error.response.status, error.response.config?.url);
    } else if (error.request) {
      console.warn('[API NETWORK ERROR]', error.config?.baseURL || '', error.config?.url || '');
    } else {
      console.warn('[API SETUP ERROR]', error.message);
    }
    return Promise.reject(error);
  },
);

export { API_BASE_URL };
export default api;