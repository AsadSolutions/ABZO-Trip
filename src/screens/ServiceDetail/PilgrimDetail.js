import React, {useState, useEffect} from 'react';
import RenderHtml from 'react-native-render-html';
// import YouTube from 'react-native-youtube-iframe';
import YoutubePlayer from 'react-native-youtube-iframe';
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
  InteractionManager,
} from 'react-native';
import {BaseColor, useTheme, BaseSetting} from '@config';
import {Header, SafeAreaView, Icon, Text, Button, RoomType} from '@components';
import * as Utils from '@utils';
import styles from './styles';
import {useTranslation} from 'react-i18next';

export default function PilgrimDetail(props) {
  const auth = useSelector(state => state.auth);
  const login = auth.login.success;
  const booking_item = useSelector(state => state.booking.booking_item);
  const dispatch = useDispatch();
  console.warn('ok booking data ==>..', booking_item);

  const {colors} = useTheme();
  const {t} = useTranslation();
  const isFocused = useIsFocused();
  const {width} = useWindowDimensions();
  const {navigation, route} = props;
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const [id, setId] = useState(route.params.id);
  const [info, setInfo] = useState({});
  const [date_array, setDate_array] = useState({});
  const [booked_days, setBooked_days] = useState([]);
  const [video, setVideo] = useState(<Text>.</Text>);
  const deltaY = new Animated.Value(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const request = new Request(
          BaseSetting.REACT_APP_BASE_PATH + 'PilgrimInfo/' + id,
          {method: 'GET'},
        );
        const response = await fetch(request);
        const obj = await response.json();

        obj.available_seats =
          parseInt(obj.folding_seats) +
          parseInt(obj.business_seats) -
          parseInt(obj.booked);
        obj.departure_date = obj.departure_date
          ? obj.departure_date.split('T')[0]
          : '';
        setInfo(obj);
        booking_item.detail_info = obj;
        dispatch(BookingActions.onBOOKING_ITEM(booking_item));
        setBooked_days(JSON.stringify(obj.booked_days));

        // if (obj.video && obj.video !== '') {
        //   const videoid = obj.video;
        //   const regExp =
        //     /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        //   const match = videoid.match(regExp);
        //   const videoId = match && match[2].length === 11 ? match[2] : false;
        //   if (videoId && videoId !== '') {
        //     setVideo(
        //       <YoutubePlayer
        //         apiKey={BaseSetting.REACT_APP_YOUTUBE_KEY}
        //         height={300}
        //         play={false}
        //         videoId={videoId}
        //       />,
        //     );
        //   }
        // }
      } catch (error) {
        console.log('Error in Get menu', error);
      }
    };

    const fetchDataWithDelay = async () => {
      await InteractionManager.runAfterInteractions(fetchData);
    };

    fetchDataWithDelay();
  }, []);

  const heightImageBanner = Utils.scaleWithPixel(250, 1);
  const marginTopBanner = heightImageBanner - heightHeader - 40;

  var price_title = 'Per Person';
  var photo_gallary = [];

  var picture_array = info.picture_visiting
    ? info.picture_visiting.split(',')
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

  var picture_array = info.picture_visiting
    ? info.picture_visiting.split(',')
    : [];
  var picture =
    picture_array.length > 0 ? picture_array[0] : 'upload/default.png';
  picture = {uri: BaseSetting.REACT_APP_FILE_PATH + picture};
  // console.log('render', info);
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
                    BOOKED SEATS
                  </Text>
                  <Text body2>{info.booked}</Text>
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
