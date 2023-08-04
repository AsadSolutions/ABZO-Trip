import React, {useState, useEffect} from 'react';
import {useIsFocused } from '@react-navigation/native';
import { SliderBox } from "react-native-image-slider-box";

import {
  View,
  ScrollView,
  Animated,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {useSelector} from 'react-redux';
import {
  Image,
  Text,
  Icon,
  HotelItem,
  Card,
  Button,
  SafeAreaView,
  EventCard,
  Header
} from '@components';
import {BaseStyle, Images, useTheme,BaseSetting} from '@config';
import * as Utils from '@utils';
import styles from './styles';
import HomeRideListing from '../../screens/ServiceHomeList/HomeRideListing';
import HomeStayListing from '../../screens/ServiceHomeList/HomeStayListing';
import HomeGuideListing from '../../screens/ServiceHomeList/HomeGuideListing';
import HomePackageListing from '../../screens/ServiceHomeList/HomePackageListing';

export default function Home({navigation}) {
  const {colors} = useTheme();
  const isFocused = useIsFocused();
  const auth = useSelector(state => state.auth);
  const mylogin = auth.login.success;
  const [login] = useState(mylogin);
  const [slider,setSlider] = useState([]);
  useEffect(() => {
    getSlider();
  }, [])
  
  const getSlider = () => {
    //console.log("slider is called");
    const request = new Request(BaseSetting.REACT_APP_BASE_PATH + "slides?category=0", { method: "GET" });
    fetch(request).then(res => {
      res.json().then(obj => {
        var slider_list = obj.map((item, index) => {
           return BaseSetting.REACT_APP_FILE_PATH + "/uploads/picture/" + item.picture;
        });
        setSlider(slider_list);
        return obj;
      });
    }).catch(err => {
      console.log("Error in Get menu", err);
    });
  };
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const deltaY = new Animated.Value(0);

  /**
   * @description Show icon services on form searching
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   * @returns
   */

  const heightImageBanner = Utils.scaleWithPixel(140);
  const marginTopBanner = heightImageBanner - heightHeader;

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}} forceInset={{top: 'always'}}>
        <Header
          title="Home"
          renderLeft={() => {
            return (
              <Icon
                name="ellipsis-v"
                size={20}
                color={colors.primary}
                enableRTL={true}
              />
            );
          }}
          renderRight={() => {
            return (
              <></>
            );
          }}
          onPressLeft={() => {
            navigation.navigate("More");
          }}
          onPressRight={() => {}}
        />
        <SliderBox images={slider} autoplay circleLoop />

        <ScrollView
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {y: deltaY},
              },
            },
          ])}
          onContentSizeChange={() => setHeightHeader(Utils.heightHeader())}
          scrollEventThrottle={8}>
          
              
          <View style={styles.titleView}>
            <Text title3 semibold>
              Latest Package
            </Text>
            <Text body2 grayColor>
              Book your trip package today.
            </Text>
          </View>
          <View>
            <HomePackageListing navigation = {navigation} />
          </View>

          <View style={styles.titleView}>
            <Text title3 semibold>
              Latest Ride
            </Text>
            <Text body2 grayColor>
              Book your car, bus or any vehicle today
            </Text>
          </View>
          <View>
            <HomeRideListing navigation = {navigation} />
          </View>

          <View style={styles.titleView}>
            <Text title3 semibold>
              Latest Stay
            </Text>
            <Text body2 grayColor>
            Book your hotel, home or camp today
            </Text>
          </View>
          <View>
            <HomeStayListing navigation = {navigation}   />
          </View>

          <View style={styles.titleView}>
            <Text title3 semibold>
              Latest Guide
            </Text>
            <Text body2 grayColor>
              Get information about traveling and places
            </Text>
          </View>
          <View style={{marginBottom:20}}>
            <HomeGuideListing navigation={navigation} />
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
