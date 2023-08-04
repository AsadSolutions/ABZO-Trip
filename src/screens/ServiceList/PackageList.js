import React, {useEffect, useState} from 'react';
import {FlatList, RefreshControl, View, Animated} from 'react-native';
import {BaseStyle, useTheme,BaseColor} from '@config';
import {Header, SafeAreaView, Icon, HotelItem, FilterSort, Text, Button} from '@components';
import styles from './styles';
import * as Utils from '@utils';
import {useTranslation} from 'react-i18next';
import {BaseSetting} from '@config';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {BookingActions} from '@actions';

export default function PackageList(props) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const storeFilter = useSelector(state => state.booking.package_filter);
  const dispatch = useDispatch();

  const [modeView, setModeView] = useState('list');
  const [subtitle, setSubTitle] = useState('');
  const [list, setList] = useState([]);
  const [refreshing] = useState(false);
  const scrollAnim = new Animated.Value(0);
  const offsetAnim = new Animated.Value(0);
  const clampedScroll = Animated.diffClamp(
    Animated.add(
      scrollAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolateLeft: 'clamp',
      }),
      offsetAnim,
    ),
    0,
    40,
  );
  
  useEffect(() => {
    if(storeFilter){
      setSubTitle(storeFilter.city ? storeFilter.city + " #" + storeFilter.cat_id : "");
      var post_data  = new FormData();
      post_data.append("category_id", storeFilter.cat_id);
      post_data.append("city_id", storeFilter.city_id);
      post_data.append("city", storeFilter.city);
      post_data.append("address", storeFilter.address);
      post_data.append("country", storeFilter.country);
     //console.warn("package search", post_data);
      const request = new Request(
        BaseSetting.REACT_APP_BASE_PATH + "PackageFilter",
        { method: "POST", body: post_data }
      );
      fetch(request).then((res) => {
          res.json().then((json) => {
           console.log("json data", json);
            setList(json);
          });
      }).catch((err) => {
          console.log("Error in Get menu", err.message);
      });
    }    
  }, [isFocused])
  
  const onChangeSort = () => {};

  /**
   * @description Open modal when filterring mode is applied
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */
  const onFilter = () => {
    navigation.navigate('PackageFilter');
  };

  /**
   * @description Open modal when view mode is pressed
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */
  const onChangeView = () => {
    Utils.enableExperimental();
    switch (modeView) {
      case 'block':
        setModeView('grid');
        break;
      case 'grid':
        setModeView('list');

        break;
      case 'list':
        setModeView('block');

        break;
      default:
        setModeView('block');
        break;
    }
  };

  /**
   * @description Render container view
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   * @returns
   */
  const renderContent = () => {
      const navbarTranslate = clampedScroll.interpolate({
        inputRange: [0, 40],
        outputRange: [0, -40],
        extrapolate: 'clamp',
      });
      const item_style = modeView == "block" ? {paddingBottom:10} : {marginBottom: 15,marginLeft: 10,marginRight : 10};
      return (
        <View style={{flex: 1}}>
          <Animated.FlatList
            contentContainerStyle={{
              paddingTop: 50,
            }}
            
            refreshControl={
              <RefreshControl
                colors={[colors.primary]}
                tintColor={colors.primary}
                refreshing={refreshing}
                onRefresh={() => {}}
              />
            }
            scrollEventThrottle={1}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      y: scrollAnim,
                    },
                  },
                },
              ],
              {useNativeDriver: true},
            )}
            data={list}
            key={modeView}
            keyExtractor={(item, index) => item.id}
            renderItem={({item, index}) => {
              var picture = item.attraction_picture ? item.attraction_picture.split(",")[0]: "upload/default.png";
              picture = {uri: BaseSetting.REACT_APP_FILE_PATH + picture};
              var param = {
                id: item.id, 
                picture: picture, 
                title: item.title,
                address: item.city_name,
                category: item.category,
                username: item.departure_date.split("T")[0],
                booked: item.booked,
                remaining: item.business_seats + item.folding_seats - (item.booked ? item.booked : 0),
                price: 'Adult:'+item.price+', Child:'+item.child_price+', Couple:'+item.couple_price+', infant:'+item.infant_price,
                item_list: item.fromcity.split(","),
                date: item.departure_date.split("T")[0],
                type : "package",
                page : "filter",
                detail_info: item
              }

              return  <HotelItem
                param = {param}
                style={item_style}
                block = {modeView == "block" ? true : false}
                list = {modeView == "list" ? true : false}
                grid = {modeView == "grid" ? true : false}
                onPress={() => {
                  dispatch(BookingActions.onBOOKING_ITEM(param));
                  navigation.navigate('PackageDetail',{id: item.id});
                }}
              />
            }}
          />
          <Animated.View
            style={[
              styles.navbar,
              {transform: [{translateY: navbarTranslate}]},
            ]}>
            <FilterSort
              modeView={modeView}
              onChangeSort={onChangeSort}
              onChangeView={onChangeView}
              onFilter={onFilter}
            />
          </Animated.View>
        </View>
      );
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title="Package"
        subTitle={subtitle}
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
      <View style={{padding: 20}}>
          <Button onPress={() => navigation.navigate('CustomPackage')}>Customized Package</Button>
      </View>
      {renderContent()}
    </SafeAreaView>
  );
}
