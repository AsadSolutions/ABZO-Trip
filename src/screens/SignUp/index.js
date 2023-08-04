import React, {useState} from 'react';
import {View, KeyboardAvoidingView, Platform,TouchableOpacity} from 'react-native';
import {BaseStyle, useTheme, BaseSetting} from '@config';
import {Header, SafeAreaView, Icon, Button, TextInput, Text} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';

export default function SignUp({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [refer_by, setRefer_by] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({
    name: true,
    email: true,
    mobile: true,
  });

  /**
   * call when action signup
   *
   */
  const onSignUp = () => {
    if (name == '' || email == '' || mobile == '') {
      setSuccess({
        ...success,
        name: name != '' ? true : false,
        email: email != '' ? true : false,
        mobile: mobile != '' ? true : false,
      });
    } else {
      setLoading(true);
      const data = new FormData();
      data.append("name", name);
      data.append("email", email);
      data.append("mobile", mobile);
      data.append("refer_by", 0);
      data.append("device", "mobile");
      const request = new Request(BaseSetting.REACT_APP_BASE_PATH + "UserSignUp", { method: "POST", body: data });
      fetch(request).then(res => {
          res.json().then(json => {
              setLoading(false);              
              if (json.message) {
                setMessage(json.message);
              } else {
                setMessage("Account created successfully, Check your email!");
                setTimeout(() => {
                  navigation.navigate('SignIn');
                }, 3000);
               
              }
          });
      }).catch(err => {
          setMessage(err.message);
          console.log("Error in Get menu", err.message);
      });
    }
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={t('sign_up')}
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
        <View style={styles.contain}>
          <Text>{message}</Text>
          <TextInput
            onChangeText={(text) => setName(text)}
            placeholder="Name"
            success={success.name}
            value={name}
          />
          <TextInput
            style={{marginTop: 10}}
            onChangeText={(text) => setEmail(text)}
            placeholder="Email"
            keyboardType="email-address"
            success={success.email}
            value={email}
          />
          <TextInput
            style={{marginTop: 10}}
            onChangeText={(text) => setMobile(text)}
            placeholder="Mobile"
            success={success.mobile}
            value={mobile}
          />
          <Button
            full
            style={{marginTop: 20}}
            loading={loading}
            onPress={() => onSignUp()}>
            {t('sign_up')}
          </Button>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignIn')}>
            <Text body1 grayColor style={{marginTop: 25}}>
              {t('sign_in')}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
