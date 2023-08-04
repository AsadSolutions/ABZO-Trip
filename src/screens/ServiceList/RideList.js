import React, {useEffect, useState} from 'react';
import {FlatList, RefreshControl, View, Animated} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {Header, SafeAreaView, Icon, HotelItem, FilterSort} from '@components';
import styles from './styles';
import * as Utils from '@utils';
import {useTranslation} from 'react-i18next';
import {BaseSetting} from '@config';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {BookingActions} from '@actions';

export default function RideList(props) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const storeFilter = useSelector(state => state.booking.ride_filter);
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
    if (storeFilter) {
      setSubTitle(
        storeFilter.date
          ? storeFilter.date +
              ' : ' +
              storeFilter.from_city +
              '-' +
              storeFilter.to_city +
              ' #' +
              storeFilter.cat_id
          : '',
      );
      var post_data = new FormData();
      post_data.append('category_id', storeFilter.cat_id);
      post_data.append('city_id', storeFilter.city_id);
      post_data.append('rent_type', storeFilter.rent_type);
      post_data.append('duration', storeFilter.duration);
      post_data.append('distance', storeFilter.distance);
      post_data.append('from_lat', storeFilter.from_lat);
      post_data.append('from_lng', storeFilter.from_lng);
      post_data.append('from_city', storeFilter.from_city);
      post_data.append('from_country', storeFilter.from_country);
      post_data.append('to_lat', storeFilter.to_lat);
      post_data.append('to_lng', storeFilter.to_lng);
      post_data.append('to_city', storeFilter.to_city);
      post_data.append('to_country', storeFilter.to_country);
      post_data.append('date', storeFilter.date);
      //console.warn("ride search", post_data);
      const request = new Request(
        BaseSetting.REACT_APP_BASE_PATH + 'RideFilter',
        {method: 'POST', body: post_data},
      );
      fetch(request)
        .then(res => {
          res.json().then(json => {
            //console.warn("json data", json);
            setList(json);
          });
        })
        .catch(err => {
          console.log('Error in Get menu====>>', err.message);
        });
    }
  }, [isFocused]);

  const onChangeSort = () => {};

  /**
   * @description Open modal when filterring mode is applied
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */
  const onFilter = () => {
    navigation.navigate('RideFilter');
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
    const item_style =
      modeView == 'block'
        ? {paddingBottom: 10}
        : {marginBottom: 15, marginLeft: 10, marginRight: 10};
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
            var picture = item.picture
              ? item.picture.split(',')[0]
              : 'upload/default.png';
            picture = {uri: BaseSetting.REACT_APP_FILE_PATH + picture};
            var remaining = item.seats - item.booked;
            var rent_price = '';
            if (item.rent_type == 1) {
              //KM
              rent_price =
                item.price +
                '/0-25KM, ' +
                item.price_25_50_km +
                '/25-50KM, ' +
                item.price_50_500_km +
                '/50_500KM';
            } else if (item.rent_type == 3) {
              //Seat
              rent_price = item.price_seat + '/Seat';
            } else {
              //day
              rent_price = item.price_day + '/Day';
            }
            var param = {
              id: item.id,
              picture: picture,
              title: item.company,
              category: item.category,
              price: item.currency + ' ' + rent_price,
              username: item.user_name,
              booked: item.booked,
              remaining: remaining,
              item_list: item.city.split(',').slice(0, 4),
              rating: 3,
              type: 'ride',
              page: 'filter',
              detail_info: item,
            };

            return (
              <HotelItem
                param={param}
                style={item_style}
                block={modeView == 'block' ? true : false}
                list={modeView == 'list' ? true : false}
                grid={modeView == 'grid' ? true : false}
                onPress={() => {
                  dispatch(BookingActions.onBOOKING_ITEM(param));
                  navigation.navigate('RideDetail', {id: item.id});
                }}
              />
            );
          }}
        />
        <Animated.View
          style={[styles.navbar, {transform: [{translateY: navbarTranslate}]}]}>
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
        title="Ride"
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
      {renderContent()}
    </SafeAreaView>
  );
}
