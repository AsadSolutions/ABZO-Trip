import React, {useState} from 'react';
import {View, KeyboardAvoidingView, Platform,TouchableOpacity} from 'react-native';
import {BaseStyle, useTheme, BaseSetting} from '@config';
import {Header, SafeAreaView, Icon, TextInput, Button, Text} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';

export default function ResetPassword({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [email, seteEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState({email: true});

  /**
   * call when action reset pass
   */
  const onReset = () => {
    if (email == '') {
      setSuccess({
        ...success,
        email: false,
      });
    } else {
      setLoading(true);
      const data = new FormData();
      data.append("email", email);
      data.append("device", "mobile");
      const request = new Request(BaseSetting.REACT_APP_BASE_PATH + "webforgot", { method: "POST", body: data });
      fetch(request).then(res => {
          res.json().then(json => {
              setLoading(false);              
              setMessage(json.message);
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
        title={t('reset_password')}
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
        <View
          style={{
            flex: 1,
            padding: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>{message}</Text>
          <TextInput
            onChangeText={(text) => seteEmail(text)}
            onFocus={() => {
              setSuccess({
                ...success,
                email: true,
              });
            }}
            placeholder={t('email_address')}
            success={success.email}
            value={email}
            selectionColor={colors.primary}
          />
          <Button
            style={{marginTop: 20}}
            full
            onPress={() => {
              onReset();
            }}
            loading={loading}>
            {t('reset_password')}
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
