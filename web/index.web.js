import { AppRegistry } from 'react-native-web';
import App from './App';
import { name as appName } from './app.json';

// Initialize the app
try {
  // Register the app
  AppRegistry.registerComponent(appName, () => App);
  
  // Initialize Metro
  if (typeof window !== 'undefined') {
    window.__EXPO_METRO_CONFIG = {
      resolver: {
        sourceExts: ["js", "jsx", "ts", "tsx", "json", "svg", "png", "jpg", "jpeg", "gif"]
      }
    };
  }
} catch (error) {
  console.error('Failed to initialize app:', error);
  // Show error message to user
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <h2>App Initialization Error</h2>
        <p>There was an error initializing the app. Please try refreshing the page.</p>
        <pre style="margin-top: 20px; padding: 10px; background: #f5f5f5; border-radius: 4px;">
          ${error.message}
        </pre>
      </div>
    `;
  }
}

// Start the app
if (typeof document !== 'undefined') {
  const rootTag = document.getElementById('root');
  if (rootTag) {
    AppRegistry.runApplication(appName, { rootTag });
  }
}
