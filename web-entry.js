import { registerRootComponent } from 'expo/build/launch/registerRootComponent';
import App from './App';

// Ensure we're running in a browser environment
if (typeof window !== 'undefined') {
  try {
    // Register the app
    registerRootComponent(App);
  } catch (error) {
    console.error('Failed to initialize app:', error);
    // Show error message to user
    const root = document.getElementById('root');
    if (root) {
      root.innerHTML = `
        <div style="text-align: center; padding: 20px;">
          <h2>App Initialization Error</h2>
          <p>There was an error initializing the app. Please try refreshing the page.</p>
        </div>
      `;
    }
  }
} else {
  console.error('Cannot run in non-browser environment');
}
