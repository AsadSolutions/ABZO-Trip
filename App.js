import 'react-native-gesture-handler';
import React from 'react';
import {store, persistor} from './src/store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import Navigator from './src/navigation';
import {LogBox} from 'react-native';

LogBox.ignoreAllLogs(true);

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Navigator />
      </PersistGate>
    </Provider>
  );
};
export default App;
