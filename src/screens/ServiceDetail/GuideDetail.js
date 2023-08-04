import React, {useState, useEffect} from 'react';
import RenderHtml from 'react-native-render-html';
import YouTube from 'react-native-youtube-iframe';
import {Calendar} from 'react-native-calendars';
import {useIsFocused } from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {BookingActions} from '@actions';
import {
  View,
  ScrollView,
  FlatList,
  Animated,
  useWindowDimensions 
} from 'react-native';
import {BaseColor, useTheme, BaseSetting} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  RoomType
} from '@components';
import * as Utils from '@utils';
import styles from './styles';
import {useTranslation} from 'react-i18next';

export default function GuideDetail(props) {
  const auth = useSelector(state => state.auth);
  const login = auth.login.success;
  const booking_item = useSelector(state => state.booking.booking_item);
  const dispatch = useDispatch();

  const {colors} = useTheme();
  const {t} = useTranslation();
  const isFocused = useIsFocused();
  const { width } = useWindowDimensions();
  const {navigation, route} = props; 
 
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const [id, setId] = useState(route.params.id);
  const [info, setInfo] = useState({});
  const [date_array, setDate_array] = useState({});
  const [booked_days, setBooked_days] = useState([]);
  const [video, setVideo] = useState(<Text>.</Text>);
  const deltaY = new Animated.Value(0);
  console.log("date guide 2", info,date_array);
  useEffect(() => {
    const request = new Request(BaseSetting.REACT_APP_BASE_PATH + "GuideInfo/" + id, { method: "GET" });
    fetch(request).then(res => {
      res.json().then(obj => {
        var dateobj = {};
        obj.date_list.forEach((dateinfo) => {
          mydate = (dateinfo["date"].split("T"))[0];
          dateobj[mydate] = {marked: true, color: '#50cebb'};
        });
        booking_item.detail_info = obj; 
        dispatch(BookingActions.onBOOKING_ITEM(booking_item));
        console.log("date guide inside",dateobj);
        setDate_array(dateobj);
        setInfo(obj);
        setBooked_days(JSON.stringify(obj.booked_days));
        if (obj.video && obj.video != "") {
          var videoid = obj.video;
          var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
          var match = videoid.match(regExp);
          videoid = (match && match[2].length == 11) ? match[2] : false;
          if(videoid && videoid != ""){
            

            setVideo(
            <YouTube
              apiKey={BaseSetting.REACT_APP_YOUTUBE_KEY} 
              height={300}
              play={false}
              videoId={videoid}
            />);
          }
        }
       
      });
    }).catch(err => {
      console.log("Error in Get menu", err);
    });
  }, []);

  const heightImageBanner = Utils.scaleWithPixel(250, 1);
  const marginTopBanner = heightImageBanner - heightHeader - 40;

  var price_title = info.subcategory_id == 16 ? "Per Person" : "Per Day";
  var picture_array = info.picture ? info.picture.split(',') : [];
  var picture = picture_array.length > 0 ? picture_array[0]: "upload/default.png";
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
            navigation.navigate('PreviewImage',{picture_array:picture_array});
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
              <Text title2 semibold style={{marginBottom: 5}}>{info.category}</Text>
             
            </View>
    
            {/* Description */}
            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <Text headline semibold primaryColor>Description</Text>
              <Text body2 style={{marginTop: 5}}>
                {info.description}
              </Text>
            </View>
            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <Text headline semibold primaryColor>Food Plan</Text>
              <Text body2 style={{marginTop: 5}}>
                {info.food_plain}
              </Text>
            </View>
            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <Text headline semibold primaryColor>Video</Text>
              {video}
            </View>
            
            {/* Other Information */}
            <View style={{paddingVertical: 10}}>
              <Text headline semibold primaryColor>
                Information
              </Text>
              <View style={styles.itemReason}>
                <View style={{marginLeft: 10}}>
                  <Text subhead semibold>Category</Text>
                  <Text body2>{info.category}</Text>
                </View>
              </View>
              <View style={styles.itemReason}>
                <View style={{marginLeft: 10}}>
                  <Text subhead semibold>City</Text>
                  <Text body2>{info.city}</Text>
                </View>
              </View>
              <View style={styles.itemReason}>
                <View style={{marginLeft: 10}}>
                  <Text subhead semibold>Posted By</Text>
                  <Text body2>{info.city_title}</Text>
                </View>
              </View>
              <View style={styles.itemReason}>
                <View style={{marginLeft: 10}}>
                  <Text subhead semibold>Date</Text>
                  <Calendar
                      markingType={'period'}
                      markedDates={date_array}
                    />
                 
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
            {info.currency} {info.price}
            </Text>
            <Text caption1 semibold style={{marginTop: 5}}>
              {price_title}
            </Text>
          </View>
          {login ? <Button onPress={() => navigation.navigate('PreviewBooking')}>{t('book_now')}</Button> : 
          <Button onPress={() => navigation.navigate('SignIn')}>{t('Signin')}</Button>}
        </View>
      </SafeAreaView>
    </View>
  );
}
