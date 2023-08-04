import React, {useState} from 'react';
import {FlatList, RefreshControl, View, TouchableOpacity} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Text} from '@components';
import {useSelector} from 'react-redux';
import styles from './styles';
import {useTranslation} from 'react-i18next';

export default function More({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const auth = useSelector(state => state.auth);
  const login = String(auth.login.success) == "true" ? true : false;
  var screen_list = [
    {
      icon: login ? 'user' : 'lock',
      title: login ? "Profile" : "Signin",
      screen: login ? "ProfileEdit" : "SignIn"
    },
    {
      screen: 'InfoList',
      icon: 'info',
      title: 'Info Pages',
    },
    {
      screen: 'CallBack',
      icon: 'phone-square',
      title: 'Quick Callback',
    },
    {
      icon: 'handshake',
      title: 'Nearby Abzo Offices',
      screen: 'Partner',
    },
    {
      icon: 'envelope',
      title: 'Contact',
      screen: 'ContactUs',
    },
    {
      id: 1,
      screen: 'AboutUs',
      icon: 'cubes',
      title: 'About Us',
    },
    {
      id: 2,
      screen: 'AboutUs',
      icon: 'cubes',
      title: 'Terms & Conditions',
    },
    {
      id: 3,
      screen: 'AboutUs',
      icon: 'cubes',
      title: 'Privacy Policy',
    }
  ];
  let login_screen_list = [
  {
    id: 1,
    screen: 'ServiceBooking',
    icon: 'table',
    title: 'Ride Booking',
  },
  {
    id: 2,
    screen: 'ServiceBooking',
    icon: 'table',
    title: 'Stay Booking',
  },
  {
    id: 3,
    screen: 'ServiceBooking',
    icon: 'table',
    title: 'Guide Booking',
  },
  {
    id: 4,
    screen: 'ServiceBooking',
    icon: 'table',
    title: 'Package Booking',
  },
  {
    id: 5,
    screen: 'ServiceBooking',
    icon: 'table',
    title: 'Pilgrim Booking',
  },
  {
    screen: 'SignIn',
    icon: 'lock',
    title: 'Logout',
  },
];
if(login){
  screen_list = screen_list.concat(login_screen_list);
}
  const [refreshing] = useState(false);
  const [screen] = useState(screen_list);

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={t('more')}
        renderLeft={() => {
          return (
            <Icon
              name="arrow-left"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 10,
        }}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={() => {}}
          />
        }
        data={screen}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={[styles.item, {borderBottomColor: colors.border}]}
            onPress={() => {
              if(item.id){
                navigation.navigate(item.screen,{id: item.id});
              } else {
                navigation.navigate(item.screen);
              }
            }}>
            <View style={{flexDirection: 'row'}}>
              <Icon
                name={item.icon}
                color={colors.primary}
                size={18}
                solid
                style={{marginHorizontal: 10}}
              />
              <Text body1>{item.title}</Text>
            </View>
            <Icon
              name="angle-right"
              size={18}
              color={colors.primary}
              enableRTL={true}
            />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
