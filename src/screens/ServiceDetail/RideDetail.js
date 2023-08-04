import React, {useState, useEffect} from 'react';
import RenderHtml from 'react-native-render-html';
import YouTube from 'react-native-youtube-iframe';
import {Calendar} from 'react-native-calendars';
import {useIsFocused} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {BookingActions} from '@actions';
import {
  View,
  ScrollView,
  FlatList,
  Animated,
  useWindowDimensions,
} from 'react-native';
import {BaseColor, useTheme, BaseSetting} from '@config';
import {Header, SafeAreaView, Icon, Text, Button, RoomType} from '@components';
import * as Utils from '@utils';
import styles from './styles';
import {useTranslation} from 'react-i18next';

export default function RideDetail(props) {
  const auth = useSelector(state => state.auth);
  const login = auth.login.success;
  const booking_item = useSelector(state => state.booking.booking_item);
  const ride_filter = useSelector(state => state.booking.ride_filter);
  const dispatch = useDispatch();

  const {colors} = useTheme();
  const {t} = useTranslation();
  const isFocused = useIsFocused();
  const {width} = useWindowDimensions();
  const {navigation, route} = props;
  //console.log("paramas", route.params.id, props);
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const [id, setId] = useState(route.params.id);
  const [distance] = useState(
    booking_item.page == 'filter' ? ride_filter.distance : 0,
  );
  const [info, setInfo] = useState({});
  const [date_array, setDate_array] = useState({});
  const [booked_days, setBooked_days] = useState([]);
  const [video, setVideo] = useState(<Text>.</Text>);
  const [two_way, setTwo_way] = useState(1);
  const deltaY = new Animated.Value(0);
  useEffect(() => {
    const request = new Request(
      BaseSetting.REACT_APP_BASE_PATH + 'RideInfo/' + id,
      {method: 'GET'},
    );
    fetch(request)
      .then(res => {
        res.json().then(obj => {
          var dateobj = {};
          obj.date_list.forEach(dateinfo => {
            mydate = dateinfo['date'].split('T')[0];
            dateobj[mydate] = {marked: true, color: '#50cebb'};
          });
          booking_item.detail_info = obj;
          dispatch(BookingActions.onBOOKING_ITEM(booking_item));
          setInfo(obj);
          setDate_array(dateobj);
          setBooked_days(JSON.stringify(obj.booked_days));
          if (obj.video && obj.video != '') {
            var videoid = obj.video;
            var regExp =
              /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = videoid.match(regExp);
            videoid = match && match[2].length == 11 ? match[2] : false;
            if (videoid && videoid != '') {
              setVideo(
                <YouTube
                  apiKey={BaseSetting.REACT_APP_YOUTUBE_KEY}
                  height={300}
                  play={false}
                  videoId={videoid}
                />,
              );
            }
          }
          //console.warn("date Ride",dateobj, obj);
        });
      })
      .catch(err => {
        console.log('Error in Get menu', err);
      });
  }, []);

  const heightImageBanner = Utils.scaleWithPixel(250, 1);
  const marginTopBanner = heightImageBanner - heightHeader - 40;

  var price_title = 'KM';
  if (info.rent_type == 2) {
    price_title = 'DAYS';
  } else if (info.rent_type == 3) {
    price_title = 'SEATS';
  }

  var rent_title = '';
  var rent_price = '';
  if (info.rent_type == 1) {
    //KM
    rent_title = 'Rent/KM';
    rent_price = (
      <View>
        <Text>From 0-25/KM: {info.price}</Text>
        <Text>From 25-50/KM: {info.price_25_50_km}</Text>
        <Text>From 50_500/KM: {info.price_50_500_km}</Text>
      </View>
    );
  } else if (info.rent_type == 3) {
    //Seat
    rent_title = 'Rent/Seat';
    rent_price = info.price_seat + '/Seat';
  } else {
    //day
    rent_title = 'Rent/Day';
    rent_price = info.price_day + '/Day';
  }

  var price = 0;
  var quantity = 1;
  if (info.rent_type == 2) {
    price = info.price_day ? quantity * info.price_day : 0;
  } else if (info.rent_type == 3) {
    price = info.price_seat ? quantity * info.price_seat : 0;
  } else {
    if (distance <= 25) {
      price = info.price ? info.price : 0;
    } else if (distance <= 50) {
      price = info.price_25_50_km ? info.price_25_50_km : 0;
    } else {
      price = distance * (info.price_50_500_km ? info.price_50_500_km : 0);
    }
  }
  price =
    two_way == 1 && info.one_way_discount > 0
      ? price - parseInt((info.one_way_discount * price) / 100)
      : price;

  var picture_array = info.picture ? info.picture.split(',') : [];
  var picture =
    picture_array.length > 0 ? picture_array[0] : 'upload/default.png';
  picture = {uri: BaseSetting.REACT_APP_FILE_PATH + picture};
  return (
    <View style={{flex: 1}}>
      <Animated.Image
        source={picture}
        style={[
          styles.imgBanner,
          {
            height: deltaY.interpolate({
              inputRange: [
                0,
                Utils.scaleWithPixel(200),
                Utils.scaleWithPixel(200),
              ],
              outputRange: [heightImageBanner, heightHeader, heightHeader],
            }),
          },
        ]}
      />
      <SafeAreaView style={{flex: 1}} forceInset={{top: 'always'}}>
        {/* Header */}
        <Header
          title=""
          renderLeft={() => {
            return (
              <Icon
                name="arrow-left"
                size={20}
                color={BaseColor.whiteColor}
                enableRTL={true}
              />
            );
          }}
          renderRight={() => {
            return (
              <Icon name="images" size={20} color={BaseColor.whiteColor} />
            );
          }}
          onPressLeft={() => {
            navigation.goBack();
          }}
          onPressRight={() => {
            navigation.navigate('PreviewImage', {picture_array: picture_array});
          }}
        />
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
          {/* Main Container */}
          <View style={{paddingHorizontal: 20}}>
            {/* Information */}
            <View
              style={[
                styles.contentBoxTop,
                {
                  marginTop: marginTopBanner,
                  backgroundColor: colors.card,
                  shadowColor: colors.border,
                  borderColor: colors.border,
                },
              ]}>
              <Text title2 semibold style={{marginBottom: 5}}>
                {info.category}
              </Text>
            </View>

            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <Text headline semibold primaryColor>
                Description
              </Text>
              <Text body2 style={{marginTop: 5}}>
                {info.description}
              </Text>
            </View>

            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <Text headline semibold primaryColor>
                Video
              </Text>
              {video}
            </View>

            {/* Other Information */}
            <View style={{paddingVertical: 10}}>
              <Text headline semibold primaryColor>
                Information
              </Text>
              <View style={styles.itemReason}>
                <View style={{marginLeft: 10}}>
                  <Text subhead semibold>
                    Category
                  </Text>
                  <Text body2>{info.category}</Text>
                </View>
              </View>
              <View style={styles.itemReason}>
                <View style={{marginLeft: 10}}>
                  <Text subhead semibold>
                    {rent_title}
                  </Text>
                  <Text body2>{rent_price}</Text>
                </View>
              </View>
              <View style={styles.itemReason}>
                <View style={{marginLeft: 10}}>
                  <Text subhead semibold>
                    Vehicle Info
                  </Text>
                  <Text body2>{info.company}</Text>
                </View>
              </View>
              <View style={styles.itemReason}>
                <View style={{marginLeft: 10}}>
                  <Text subhead semibold>
                    Seats
                  </Text>
                  <Text body2>{info.seats}</Text>
                </View>
              </View>
              <View style={styles.itemReason}>
                <View style={{marginLeft: 10}}>
                  <Text subhead semibold>
                    City
                  </Text>
                  <Text body2>{info.city_title}</Text>
                </View>
              </View>
              <View style={styles.itemReason}>
                <View style={{marginLeft: 10}}>
                  <Text subhead semibold>
                    City From
                  </Text>
                  <Text body2>{info.city_from}</Text>
                </View>
              </View>
              <View style={styles.itemReason}>
                <View style={{marginLeft: 10}}>
                  <Text subhead semibold>
                    City To
                  </Text>
                  <Text body2>{info.city_to}</Text>
                </View>
              </View>

              <View style={styles.itemReason}>
                <View style={{marginLeft: 10}}>
                  <Text subhead semibold>
                    Vehicle Info
                  </Text>
                  <Text body2>
                    {info.year +
                      ', ' +
                      info.plate +
                      ', ' +
                      info.company +
                      ', ' +
                      info.transmission +
                      ', ' +
                      info.engine}
                  </Text>
                </View>
              </View>

              <View style={styles.itemReason}>
                <View style={{marginLeft: 10}}>
                  <Text subhead semibold>
                    Posted By
                  </Text>
                  <Text body2>{info.user_name}</Text>
                </View>
              </View>
              <View style={styles.itemReason}>
                <View style={{marginLeft: 10}}>
                  <Text subhead semibold>
                    Date
                  </Text>
                  <Calendar markingType={'period'} markedDates={date_array} />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        {/* Pricing & Booking Process */}
        <View
          style={[styles.contentButtonBottom, {borderTopColor: colors.border}]}>
          <View>
            <Text caption1 semibold>
              {t('price')}
            </Text>
            <Text title3 primaryColor semibold>
              {info.currency} {price}
            </Text>
            <Text caption1 semibold style={{marginTop: 5}}>
              {price_title}
            </Text>
          </View>
          {login ? (
            booking_item.page == 'filter' ? (
              <Button onPress={() => navigation.navigate('PreviewBooking')}>
                {t('book_now')}
              </Button>
            ) : (
              <></>
            )
          ) : (
            <Button onPress={() => navigation.navigate('SignIn')}>
              {t('Signin')}
            </Button>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
