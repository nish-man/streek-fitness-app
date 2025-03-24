import { createRoot } from 'react-dom/client';
import App from '../App';
import { AppRegistry } from 'react-native';

// Register the app
AppRegistry.registerComponent('main', () => App);

// Initialize the app for web
const rootTag = document.getElementById('root');
const root = createRoot(rootTag);
const RootComponent = AppRegistry.getApplication('main').element;
root.render(RootComponent);
