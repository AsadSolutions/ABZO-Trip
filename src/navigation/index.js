import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useTheme, BaseSetting} from '@config';
import SplashScreen from 'react-native-splash-screen';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {useSelector} from 'react-redux';

/* Main Stack Navigator */
import Main from './main';
/* Modal Screen only affect iOS */
import Loading from '@screens/Loading';
const RootStack = createStackNavigator();

export default function Navigator() {
  const storeLanguage = useSelector(state => state.application.language);
  const {theme, colors} = useTheme();

  const forFade = ({current, closing}) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });

  useEffect(() => {
    i18n.use(initReactI18next).init({
      resources: BaseSetting.resourcesLanguage,
      lng: storeLanguage ?? BaseSetting.defaultLanguage,
      fallbackLng: BaseSetting.defaultLanguage,
    });
    SplashScreen.hide();
    StatusBar.setBackgroundColor(colors.primary, true);
    StatusBar.setBarStyle('light-content');
  }, []);

  return (
    <NavigationContainer theme={theme}>
      <RootStack.Navigator
        mode="modal"
        headerMode="none"
        initialRouteName="Loading">
        <RootStack.Screen
          name="Loading"
          component={Loading}
          options={{gestureEnabled: false}}
        />
        <RootStack.Screen name="Main" component={Main} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
