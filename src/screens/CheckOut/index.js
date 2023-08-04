import React, {useEffect, useState} from 'react';
import {View, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import { WebView } from 'react-native-webview';

import {BaseStyle, BaseColor, useTheme,BaseSetting} from '@config';
import {Header, SafeAreaView, TextInput, Icon, Text, Button,Tag} from '@components';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import {useSelector, useDispatch} from 'react-redux';
import {BookingActions} from '@actions';

export default function CheckOut({route, navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  let login_info = useSelector(state => state.auth);
  login_info = login_info.login.data;
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [webview_source, setWebview_source] = useState({});
  const [webview_show, setWebview_show] = useState(false);
  const [message, setMessage] = useState("");
  const [booking_id] = useState(route.params.booking_id);
  const [booking_info, setBooking_info] = useState({});
  const is_assistant = login_info.is_assistant || 0;
  const [name, setName] = useState(login_info.name);
  const [email, setEmail] = useState(login_info.email);
  const [mobile, setMobile] = useState(login_info.mobile);
  const [method, setMethod] = useState('mobi_cash');
  const [loading, setLoading] = useState(false);

  const [paid, setPaid] = useState(0);
  const [advance,setAdvance] = useState(0);

  /**
   *
   * Called when process checkout
   */
   const getInfo = (id) => {
    const request = new Request(BaseSetting.REACT_APP_BASE_PATH + "Booking/" + id, { method: "GET" });
    fetch(request).then(res => {
      res.json().then(obj => {
        var mypaid = obj.paid > 0 ? obj.total - obj.paid : Math.ceil(BaseSetting.REACT_APP_PAID_PERCENT*obj.total);
        setBooking_info(obj);
        setPaid(mypaid);
        setAdvance(Math.ceil(BaseSetting.REACT_APP_PAID_PERCENT*obj.total));
        console.log("Info pages",obj);
      });
    }).catch(err => {
      console.log("Error in Get menu", err);
    });
  };
  useEffect(() => {
    getInfo(booking_id);
  },[]);
  const booking_detail = () => {
    var booking_element = <Text>...</Text>;
    if(booking_info.service_id == "1"){
      booking_element = 
                      <View style={[styles.blockView, {borderBottomColor: colors.border}]}>
                        <Text headline semibold primaryColor>Total Amount: {booking_info.total}</Text>
                        <Text headline semibold primaryColor>Advance {100*BaseSetting.REACT_APP_PAID_PERCENT} %: {advance}</Text>  
                        <Text headline semibold primaryColor>Quantity (Days/Seat/KM): {booking_info.quantity}</Text>            
                        <Text headline semibold primaryColor>Date: {booking_info.date_from}</Text>           
                      </View>
    } else if(booking_info.service_id == "2"){
      var total_title = "Rooms";
      if(booking_info.subcategory_id){
        if (booking_info.subcategory_id.id == 7) {
          total_title = "BED";
        } else if (booking_info.subcategory_id.id == 11) {
          total_title = "CAMP";
        }
      }
      
      booking_element = 
                      <View style={[styles.blockView, {borderBottomColor: colors.border}]}>
                        <Text headline semibold primaryColor>Total Amount: {booking_info.total}</Text>
                        <Text headline semibold primaryColor>Advance {100*BaseSetting.REACT_APP_PAID_PERCENT} %: {advance}</Text> 
                        <Text headline semibold primaryColor>Total No Days: {booking_info.quantity}</Text>           
                        <Text headline semibold primaryColor>Booked {total_title}: {booking_info.number}</Text> 
                        <Text headline semibold primaryColor>Date: {booking_info.date_from}</Text>         
                        <Text headline semibold primaryColor>Adult: {booking_info.adult}</Text>         
                        <Text headline semibold primaryColor>Child: {booking_info.child}</Text>                  
                      </View>
    } else if(booking_info.service_id == "3"){
      booking_element = 
                      <View style={[styles.blockView, {borderBottomColor: colors.border}]}>
                        <Text headline semibold primaryColor>Total Amount: {booking_info.total}</Text>
                        <Text headline semibold primaryColor>Advance {100*BaseSetting.REACT_APP_PAID_PERCENT} %: {advance}</Text>            
                        <Text headline semibold primaryColor>Total No Days: {booking_info.quantity}</Text>            
                        <Text headline semibold primaryColor>Date: {booking_info.date_from}</Text>            
                      </View>
    } else if(booking_info.service_id == "4" || booking_info.service_id == "5"){
      booking_element = 
                      <View style={[styles.blockView, {borderBottomColor: colors.border}]}>
                        <Text headline semibold primaryColor>Total Amount: {booking_info.total}</Text>
                        <Text headline semibold primaryColor>Advance {100*BaseSetting.REACT_APP_PAID_PERCENT} %: {advance}</Text>  
                        <Text headline semibold primaryColor>Adult: {booking_info.adult}</Text>         
                        <Text headline semibold primaryColor>Child: {booking_info.child}</Text>
                        <Text headline semibold primaryColor>Infant: {booking_info.infant}</Text>         
                        <Text headline semibold primaryColor>Couple: {booking_info.couple}</Text>          
                      </View>
    }
    return booking_element;
  }
  const onCheckOut = () => {
    var path = method == "easy_paisa" || method == "bank_transfer" ?  BaseSetting.REACT_APP_EASY_PAISA: BaseSetting.REACT_APP_JAZZ_CASH ;
    if(method == "wallet"){
      path = BaseSetting.REACT_APP_WALLET_CASH;
    }
    const headerObj= { 'Content-Type': 'application/x-www-form-urlencoded'}
    const post_data = {
      amount: paid,
      order_id: booking_id,
      from: "mobile",
      payment_method: method,
      name: name,
      email: email,
      mobile: mobile
    };
    let url_encode_data = '',url_encoded_pair = [],key;
    for (key in post_data) {
      url_encoded_pair.push(encodeURIComponent(key) + '=' + encodeURIComponent(post_data[key]));
    }
    url_encode_data = url_encoded_pair.join('&').replace(/%20/g, '+');
    setWebview_source({uri: path, headers: headerObj, body: url_encode_data, method:'POST'});
    setWebview_show(true);
    setMessage("Please wait redirecting to payment system!");
};

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={t('check_out')}
        subTitle={"Booking# "+booking_id+" , Total:"+booking_info.total}
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
        renderRight={() => {
          return (
            <></>
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        onPressRight={() => {}}
      />
      {webview_show && <WebView
          style={{marginTop: 20}}
          javaScriptEnabled = {true}
          domStorageEnabled = {true}
          source={webview_source}
          onNavigationStateChange={(webViewState)=>{
            console.log("webview current url",webViewState.url, BaseSetting.REACT_APP_URL_PAYMENT_SUCCESS)
            if(webViewState.url.includes(BaseSetting.REACT_APP_URL_PAYMENT_SUCCESS)){
              navigation.navigate('ServiceBooking',{id: booking_info.service_id});
              console.log(booking_info.service_id, webViewState.url);
              //navigation.navigate("Home");
            }
          }}
        />
      }
      {!webview_show &&
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{flex: 1}}>
        
        <ScrollView contentContainerStyle={{paddingHorizontal: 20}}>
          <Text caption1 semibold grayColor>{message}</Text>
          {booking_detail()}
          <TextInput
            style={{marginTop: 10}}
            onChangeText={(text) => setName(text)}
            placeholder={"Name"}
            value={name}
          />
          <TextInput
            style={{marginTop: 10}}
            onChangeText={(text) => setMobile(text)}
            placeholder={"Mobile"}
            value={mobile}
          />
          <TextInput
            style={{marginTop: 10}}
            onChangeText={(text) => setEmail(text)}
            placeholder={"Email"}
            value={email}
          />

          <View style={{flex: 1,flexDirection: 'column', marginTop: 20}}>
            <Tag
              outline={method == 'mobi_cash' ? false : true}
              primary={method == 'mobi_cash' ? true : false}
              round
              onPress={() => setMethod("mobi_cash")} >
              Jazz Cash Mobile
            </Tag>
            <Tag
              style={{flex: 1,marginTop: 5}}
              outline={method == 'visa_card' ? false : true}
              primary={method == 'visa_card' ? true : false}
              round
              onPress={() => setMethod("visa_card")}>
              Visa Card
            </Tag>
            <Tag
              style={{flex: 1,marginTop: 5}}
              outline={method == 'easy_paisa' ? false : true}
              primary={method == 'easy_paisa' ? true : false}
              round
              onPress={() => setMethod("easy_paisa")}>
              Easy Paisa Mobile
            </Tag>
            <Tag
              style={{flex: 1,marginTop: 5}}
              outline={method == 'bank_transfer' ? false : true}
              primary={method == 'bank_transfer' ? true : false}
              round
              onPress={() => setMethod("bank_transfer")}>
              Bank Transfer
            </Tag>
            {is_assistant == 1 && <Tag
              style={{flex: 1,marginTop: 5}}
              outline={method == 'wallet' ? false : true}
              primary={method == 'wallet' ? true : false}
              round
              onPress={() => setMethod("wallet")}>
              Wallet
            </Tag>}
            {/* <Tag
              style={{flex: 1,marginTop: 5}}
              outline={method == 'mobi_voucher' ? false : true}
              primary={method == 'mobi_voucher' ? true : false}
              round
              onPress={() => setMethod("mobi_voucher")}>
              Jazz Cash Shop Voucher
            </Tag> */}
          </View>
        </ScrollView>
        <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
          <Button
            loading={loading}
            full
            onPress={() => {
              onCheckOut();
            }}>
            {t('check_out')+" ("+paid+")"}
          </Button>
        </View>
      </KeyboardAvoidingView>
      }
    </SafeAreaView>
  );
}
