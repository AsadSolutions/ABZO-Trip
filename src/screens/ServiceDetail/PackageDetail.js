import React, {useState, useEffect} from 'react';
import RenderHtml from 'react-native-render-html';
import YouTube from 'react-native-youtube-iframe';
import {WebView} from 'react-native-webview';
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

export default function PackageDetail(props) {
  const auth = useSelector(state => state.auth);
  const login = auth.login.success;
  const booking_item = useSelector(state => state.booking.booking_item);
  const dispatch = useDispatch();
  console.warn('ok booking data===>', booking_item);

  const {colors} = useTheme();
  const {t} = useTranslation();
  const isFocused = useIsFocused();
  const {width} = useWindowDimensions();
  const {navigation, route} = props;
  //console.log("paramas", props);
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const [id, setId] = useState(route.params.id);
  const [info, setInfo] = useState({});
  const [date_array, setDate_array] = useState({});
  const [booked_days, setBooked_days] = useState([]);
  const [video, setVideo] = useState(<Text>.</Text>);
  const deltaY = new Animated.Value(0);
  useEffect(() => {
    const request = new Request(
      BaseSetting.REACT_APP_BASE_PATH + 'PackageInfo/' + id,
      {method: 'GET'},
    );
    fetch(request)
      .then(res => {
        res.json().then(obj => {
          obj.available_seats =
            parseInt(obj.folding_seats) +
            parseInt(obj.business_seats) -
            parseInt(obj.booked);
          obj.departure_date = obj.departure_date.split('T')[0];
          setInfo(obj);
          booking_item.detail_info = obj;
          dispatch(BookingActions.onBOOKING_ITEM(booking_item));
          setBooked_days(JSON.stringify(obj.booked_days));
          // if (obj.tour_details && obj.tour_details != '') {
          //   var videoid = obj.tour_details;
          //   var regExp =
          //     /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
          //   var match = videoid.match(regExp);
          //   videoid = match && match[2].length == 11 ? match[2] : false;
          //   if (videoid && videoid != '') {
          //     setVideo(
          //       <YouTube
          //         apiKey={BaseSetting.REACT_APP_YOUTUBE_KEY}
          //         height={300}
          //         play={false}
          //         videoId={videoid}
          //       />,
          //     );
          //   }
          // }
        });
      })
      .catch(err => {
        console.log('Error in Get menu', err);
      });
  }, []);

  const heightImageBanner = Utils.scaleWithPixel(250, 1);
  const marginTopBanner = heightImageBanner - heightHeader - 40;

  var price_title = 'Per Person';
  var photo_gallary = [];

  var picture_array = info.attraction_picture
    ? info.attraction_picture.split(',')
    : [];
  picture_array.forEach(photo => {
    photo_gallary.push(photo);
  });

  picture_array = info.stay_picture ? info.stay_picture.split(',') : [];
  picture_array.forEach(photo => {
    photo_gallary.push(photo);
  });

  picture_array = info.ride_picture ? info.ride_picture.split(',') : [];
  picture_array.forEach(photo => {
    photo_gallary.push(photo);
  });

  picture_array = info.picture_vahicle ? info.picture_vahicle.split(',') : [];
  picture_array.forEach(photo => {
    photo_gallary.push(photo);
  });

  var picture_array = info.attraction_picture
    ? info.attraction_picture.split(',')
    : [];
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
            navigation.navigate('PreviewImage', {picture_array: photo_gallary});
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
                {info.title}
              </Text>
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
                    ADULT PRICE
                  </Text>
                  <Text body2>{info.price}</Text>
                </View>
              </View>
              <View style={styles.itemReason}>
                <View style={{marginLeft: 10}}>
                  <Text subhead semibold>
                    CHILD PRICE
                  </Text>
                  <Text body2>{info.child_price}</Text>
                </View>
              </View>
              <View style={styles.itemReason}>
                <View style={{marginLeft: 10}}>
                  <Text subhead semibold>
                    INFANT PRICE
                  </Text>
                  <Text body2>{info.infant_price}</Text>
                </View>
              </View>
              <View style={styles.itemReason}>
                <View style={{marginLeft: 10}}>
                  <Text subhead semibold>
                    COUPLE PRICE
                  </Text>
                  <Text body2>{info.couple_price}</Text>
                </View>
              </View>
              <View style={styles.itemReason}>
                <View style={{marginLeft: 10}}>
                  <Text subhead semibold>
                    TOTAL BUSSINESS SEATS
                  </Text>
                  <Text body2>{info.business_seats}</Text>
                </View>
              </View>
              <View style={styles.itemReason}>
                <View style={{marginLeft: 10}}>
                  <Text subhead semibold>
                    TOTAL FOLDING SEATS
                  </Text>
                  <Text body2>{info.folding_seats}</Text>
                </View>
              </View>
              <View style={styles.itemReason}>
                <View style={{marginLeft: 10}}>
                  <Text subhead semibold>
                    BOOKED SEATS
                  </Text>
                  <Text body2>{info.booked}</Text>
                </View>
              </View>
              <View style={styles.itemReason}>
                <View style={{marginLeft: 10}}>
                  <Text subhead semibold>
                    TOTAL AVAILABLE SEATS
                  </Text>
                  <Text body2>{info.available_seats}</Text>
                </View>
              </View>
              <View style={styles.itemReason}>
                <View style={{marginLeft: 10}}>
                  <Text subhead semibold>
                    DEPARTURE DATE
                  </Text>
                  <Text body2>{info.departure_date}</Text>
                </View>
              </View>
              <View style={styles.itemReason}>
                <View style={{marginLeft: 10}}>
                  <Text subhead semibold>
                    CITY
                  </Text>
                  <Text body2>{info.city_name}</Text>
                </View>
              </View>
              {/* <View style={styles.itemReason}>
                <View style={{marginLeft: 10}}>
                  <Text subhead semibold>DEPARTURE CITIES</Text>
                  <Text body2>{info.fromcity}</Text>
                </View>
              </View> */}
            </View>

            {/* Description */}
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
                Stay Details
              </Text>
              <Text body2 style={{marginTop: 5}}>
                {info.stay_details}
              </Text>
            </View>
            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <Text headline semibold primaryColor>
                Ride Details
              </Text>
              <Text body2 style={{marginTop: 5}}>
                {info.ride_details}
              </Text>
            </View>
            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <Text headline semibold primaryColor>
                Food Details
              </Text>
              <Text body2 style={{marginTop: 5}}>
                {info.food_details}
              </Text>
            </View>

            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <Text headline semibold primaryColor>
                Tour Schedule{' '}
              </Text>
              <RenderHtml
                source={{html: '<div>' + info.tour_shedule + '</div>'}}
              />
            </View>

            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <Text headline semibold primaryColor>
                Tour Details
              </Text>
              {video}
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
              {info.currency} {info.price}
            </Text>
            <Text caption1 semibold style={{marginTop: 5}}>
              {price_title}
            </Text>
          </View>
          {login ? (
            <Button onPress={() => navigation.navigate('PreviewBooking')}>
              {t('book_now')}
            </Button>
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
