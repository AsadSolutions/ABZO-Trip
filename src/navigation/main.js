import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';
import {BaseColor, useTheme, useFont} from '@config';
import {useTranslation} from 'react-i18next';
import {Icon} from '../components';
/* Stack Screen */
import InfoList from '@screens/ServiceList/InfoList';
import InfoFilter from '@screens/ServiceFilter/InfoFilter';
import RideList from '@screens/ServiceList/RideList';
import RideFilter from '@screens/ServiceFilter/RideFilter';
import StayList from '@screens/ServiceList/StayList';
import StayFilter from '@screens/ServiceFilter/StayFilter';
import GuideList from '@screens/ServiceList/GuideList';
import GuideFilter from '@screens/ServiceFilter/GuideFilter';
import PackageList from '@screens/ServiceList/PackageList';
import PackageFilter from '@screens/ServiceFilter/PackageFilter';
import PilgrimageList from '@screens/ServiceList/PilgrimageList';
import PilgrimageFilter from '@screens/ServiceFilter/PilgrimageFilter';
import GuideDetail from '@screens/ServiceDetail/GuideDetail';
import RideDetail from '@screens/ServiceDetail/RideDetail';
import StayDetail from '@screens/ServiceDetail/StayDetail';
import PackageDetail from '@screens/ServiceDetail/PackageDetail';
import PilgrimDetail from '@screens/ServiceDetail/PilgrimDetail';
import ServiceBooking from '@screens/ServiceBooking';
import InfoAdd from '@screens/ServiceBooking/InfoAdd';
import CustomPackage from '@screens/CustomPackage';
import SignUp from '@screens/SignUp';
import SignIn from '@screens/SignIn';
import ResetPassword from '@screens/ResetPassword';
import ChangePassword from '@screens/ChangePassword';
import ContactUs from '@screens/ContactUs';
import CallBack from '@screens/CallBack';
import ProfileEdit from '@screens/ProfileEdit';
import More from '@screens/More';
import CheckOut from '@screens/CheckOut';
import PreviewBooking from '@screens/PreviewBooking';
import PreviewImage from '@screens/PreviewImage';
import AboutUs from '@screens/AboutUs';
import Partner from '@screens/Partner';
import Home from '@screens/Home';

const MainStack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

export default function Main() {
  return (
    <MainStack.Navigator headerMode="yes" initialRouteName="BottomTabNavigator">
      <MainStack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
      />
      <MainStack.Screen name="InfoList" component={InfoList} />
      <MainStack.Screen name="InfoFilter" component={InfoFilter} />
      <MainStack.Screen name="RideList" component={RideList} />
      <MainStack.Screen name="RideFilter" component={RideFilter} />
      <MainStack.Screen name="StayList" component={StayList} />
      <MainStack.Screen name="StayFilter" component={StayFilter} />
      <MainStack.Screen name="GuideList" component={GuideList} />
      <MainStack.Screen name="GuideFilter" component={GuideFilter} />
      <MainStack.Screen name="PackageList" component={PackageList} />
      <MainStack.Screen name="PackageFilter" component={PackageFilter} />
      <MainStack.Screen name="PilgrimageList" component={PilgrimageList} />
      <MainStack.Screen name="PilgrimageFilter" component={PilgrimageFilter} />
      <MainStack.Screen name="GuideDetail" component={GuideDetail} />
      <MainStack.Screen name="RideDetail" component={RideDetail} />
      <MainStack.Screen name="StayDetail" component={StayDetail} />
      <MainStack.Screen name="PackageDetail" component={PackageDetail} />
      <MainStack.Screen name="PilgrimDetail" component={PilgrimDetail} />
      <MainStack.Screen name="ServiceBooking" component={ServiceBooking} />
      <MainStack.Screen name="CustomPackage" component={CustomPackage} />
      <MainStack.Screen name="InfoAdd" component={InfoAdd} />
      <MainStack.Screen name="SignUp" component={SignUp} />
      <MainStack.Screen name="SignIn" component={SignIn} />
      <MainStack.Screen name="ResetPassword" component={ResetPassword} />
      <MainStack.Screen name="ChangePassword" component={ChangePassword} />
      <MainStack.Screen name="ProfileEdit" component={ProfileEdit} />
      <MainStack.Screen name="ContactUs" component={ContactUs} />
      <MainStack.Screen name="CallBack" component={CallBack} />
      <MainStack.Screen name="PreviewBooking" component={PreviewBooking} />
      <MainStack.Screen name="PreviewImage" component={PreviewImage} />
      <MainStack.Screen name="More" component={More} />
      <MainStack.Screen name="CheckOut" component={CheckOut} />
      <MainStack.Screen name="AboutUs" component={AboutUs} />
      <MainStack.Screen name="Partner" component={Partner} />
    </MainStack.Navigator>
  );
}

function BottomTabNavigator() {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const font = useFont();
  const auth = useSelector(state => state.auth);
  const login = String(auth.login.success) == 'true' ? true : false;
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      headerMode="none"
      tabBarOptions={{
        showIcon: true,
        showLabel: true,
        activeTintColor: colors.primary,
        inactiveTintColor: BaseColor.grayColor,
        style: {borderTopWidth: 1},
        labelStyle: {
          fontSize: 12,
          fontFamily: font,
        },
      }}>
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{
          title: t('home'),
          tabBarIcon: ({color}) => {
            return <Icon color={color} name="home" size={20} solid />;
          },
        }}
      />
      <BottomTab.Screen
        name="Ride"
        component={RideList}
        options={{
          title: 'Ride',
          tabBarIcon: ({color}) => {
            return <Icon color={color} name="car" size={20} solid />;
          },
        }}
      />
      <BottomTab.Screen
        name="Stay"
        component={StayList}
        options={{
          title: 'Stay',
          tabBarIcon: ({color}) => {
            return <Icon solid color={color} name="hotel" size={20} />;
          },
        }}
      />
      <BottomTab.Screen
        name="Guide"
        component={GuideList}
        options={{
          title: 'Guide',
          tabBarIcon: ({color}) => {
            return <Icon color={color} name="camera" size={20} solid />;
          },
        }}
      />
      <BottomTab.Screen
        name="Package"
        component={PackageList}
        options={{
          title: 'Package',
          tabBarIcon: ({color}) => {
            return <Icon solid color={color} name="plane" size={20} />;
          },
        }}
      />
      <BottomTab.Screen
        name="Pilgrim"
        component={PilgrimageList}
        options={{
          title: 'Pilgrim',
          tabBarIcon: ({color}) => {
            return <Icon solid color={color} name="mosque" size={20} />;
          },
        }}
      />
    </BottomTab.Navigator>
  );
}
