import React, {useState,useEffect} from 'react';
import {View, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import {BaseStyle, useTheme,BaseSetting} from '@config';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux'; 
import {Header, SafeAreaView, Icon, Text, Button, TextInput} from '@components';
import DropDownPicker from 'react-native-dropdown-picker';

export default function CallBack({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const auth = useSelector(state => state.auth);
  const mylogin = auth.login.data;
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
  const [open1, setOpen1] = useState(false);
  const [network_list, setNetwork_list] = useState([
    { "value": "jazz", "label": "Jazz" },
    { "value": "ufone", "label": "Ufone" },
    { "value": "warid", "label": "Warid" },
    { "value": "telenor", "label": "Telenor" },
    { "value": "ptcl", "label": "PTCL" },
    { "value": "other", "label": "Other" }
  ]);

  const [name, setName] = useState(mylogin.name);
  const [network, setNetwork] = useState('');
  const [mobile, setMobile] = useState(mylogin.mobile);
  const [message, setMessage] = useState('');
  const [message2, setMessage2] = useState('');
  const [success, setSuccess] = useState({
    name: true,
    mobile: true,
    message: true,
  });
  const [loading, setLoading] = useState(false);

  /**
   * @description Called when user sumitted form
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */
  const onSubmit = () => {
    if (name == '' || mobile == '' || message == '') {
      setSuccess({
        ...success,
        mobile: mobile != '' ? true : false,
        name: name != '' ? true : false,
        message: message != '' ? true : false,
      });
    } else {
      setLoading(true);
      const data = new FormData();
      data.append("name", name);
      data.append("mobile", mobile);
      data.append("network", network);
      data.append("description", message);
      const request = new Request(BaseSetting.REACT_APP_BASE_PATH+"webcallback", {method: "POST", body: data});
        fetch(request).then(res => {
        res.json().then(json => {	
          setLoading(false);
          setMessage2(json.message);
        });
      }).catch(err => {
        setLoading(false);
        setMessage2(err.message);
      });
    }
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={"Quick Callback"}
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{flex: 1}}>
        <ScrollView contentContainerStyle={{paddingHorizontal: 20}}>
    
          <Text headline primaryColor style={{marginVertical: 10}}>
            {message2 ? message2 : 'Quick Callback'} 
          </Text>
          <TextInput
            onChangeText={(text) => setName(text)}
            placeholder={t('name')}
            success={success.name}
            value={name}
          />
          <DropDownPicker
              style={{marginTop: 10}}
              listMode="MODAL"
              open={open1}
              value={network}
              items={network_list}
              setOpen={setOpen1}
              setValue={setNetwork}
              setItems={setNetwork_list}
            />
          <TextInput
            style={{marginTop: 10}}
            onChangeText={(text) => setMobile(text)}
            placeholder={t('mobile')}
            keyboardType="mobile"
            success={success.mobile}
            value={mobile}
          />
          <TextInput
            style={{marginTop: 10, height: 120}}
            onChangeText={(text) => setMessage(text)}
            textAlignVertical="top"
            multiline={true}
            placeholder={t('message')}
            success={success.message}
            value={message}
          />
        </ScrollView>
        <View style={{paddingVertical: 15, paddingHorizontal: 20}}>
          <Button
            loading={loading}
            full
            onPress={() => {
              onSubmit();
            }}>
            {t('send')}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
