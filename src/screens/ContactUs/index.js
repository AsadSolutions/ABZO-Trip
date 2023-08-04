import React, {useState,useEffect} from 'react';
import {View, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import {BaseStyle, useTheme,BaseSetting} from '@config';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux'; 
import {Header, SafeAreaView, Icon, Text, Button, TextInput} from '@components';
import styles from './styles';

export default function ContactUs({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const auth = useSelector(state => state.auth);
  const mylogin = auth.login.data;

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [company_info, setCompany_info] = useState({});
  const [name, setName] = useState(mylogin.name);
  const [email, setEmail] = useState(mylogin.email);
  const [message, setMessage] = useState('');
  const [message2, setMessage2] = useState('');
  const [success, setSuccess] = useState({
    name: true,
    email: true,
    message: true,
  });
  const [loading, setLoading] = useState(false);

  const getList = () => {
    const request = new Request(BaseSetting.REACT_APP_BASE_PATH + "setting?tag[]=contact_email&tag[]=company_address&tag[]=contact_mobile&tag[]=facebook&tag[]=youtube&tag[]=linkedin&tag[]=instagram&tag[]=twitter", { method: "GET" });
    fetch(request).then(res => {
        res.json().then(obj => {
            var company_info = {};
            for (const [key, value] of Object.entries(obj)) {
                console.log(`${key}: ${value}`);
                company_info[value.tag] = value.value;
            }
            console.log("OK", company_info);
            setCompany_info(company_info);
            return company_info;
        });
    }).catch(err => {
        console.log("Error in Get menu", err);
    });
  };
  useEffect(() => {
    getList();
  },[])

  /**
   * @description Called when user sumitted form
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */
  const onSubmit = () => {
    if (name == '' || email == '' || message == '') {
      setSuccess({
        ...success,
        email: email != '' ? true : false,
        name: name != '' ? true : false,
        message: message != '' ? true : false,
      });
    } else {
      setLoading(true);
      const data = new FormData();
      data.append("name", name);
      data.append("email", email);
      data.append("description", message);
      const request = new Request(BaseSetting.REACT_APP_BASE_PATH+"webcontact", {method: "POST", body: data});
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
        title={t('contact_us')}
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
          <View style={{marginVertical: 10}}>
              <Text headline semibold primaryColor>Address</Text>
              <Text body2 style={{marginTop: 5}}>{company_info.company_address}</Text>
          </View>
          <View style={{marginVertical: 10}}>
              <Text headline semibold primaryColor>Mobile</Text>
              <Text body2 style={{marginTop: 5}}>{company_info.contact_mobile}</Text>
          </View>
          <View style={{marginVertical: 10}}>
              <Text headline semibold primaryColor>Email</Text>
              <Text body2 style={{marginTop: 5}}>{company_info.contact_email}</Text>
          </View>
          
          <Text headline primaryColor style={{marginVertical: 10}}>
            {message2 ? message2 : 'Send Message Us'} 
          </Text>
          <TextInput
            onChangeText={(text) => setName(text)}
            placeholder={t('name')}
            success={success.name}
            value={name}
          />
          <TextInput
            style={{marginTop: 10}}
            onChangeText={(text) => setEmail(text)}
            placeholder={t('email')}
            keyboardType="email-address"
            success={success.email}
            value={email}
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
