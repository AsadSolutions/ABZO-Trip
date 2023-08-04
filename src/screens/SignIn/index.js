import React, {useEffect, useState} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import {AuthActions} from '@actions';
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {BaseStyle, useTheme, BaseSetting} from '@config';
import {Header, SafeAreaView, Icon, Text, Button, TextInput} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';

export default function SignIn({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const auth = useSelector(state => state.auth);
  const login = auth.login.success;
 //console.warn("login page ",login, auth);

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({id: true, password: true});

  useEffect(() => {
    dispatch(AuthActions.authentication({success: false, data: {}}));
  }, [])

  /**
   * call when action login
   *
   */
  const onLogin = () => {
    if (id == '' || password == '') {
      setSuccess({
        ...success,
        id: false,
        password: false,
      });
    } else {
      setLoading(true);
      const data = new FormData();
      data.append("email", id);
      data.append("password", password);
      data.append("device", "mobile");
      const request = new Request(BaseSetting.REACT_APP_BASE_PATH + "weblogin", { method: "POST", body: data });
      fetch(request).then(res => {
          res.json().then(json => {
              setLoading(false);              
              if (json.message) {
                setMessage(json.message);
              } else {
                setMessage("Account Created successfully!");
                dispatch(
                  AuthActions.authentication({success: true, data: json}, (response) => {
                    setLoading(false);
                    navigation.goBack();
                  }),
                );
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
        title={t('sign_in')}
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
            <Icon
              name="home"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        onPressRight={() => {
          navigation.navigate("Home");
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{flex: 1}}>
        <View style={styles.contain}>
          <Text>{message}</Text>
          <TextInput
            onChangeText={(text) => setId(text)}
            onFocus={() => {
              setSuccess({
                ...success,
                id: true,
              });
            }}
            placeholder="Email"
            success={success.id}
            value={id}
          />
          <TextInput
            style={{marginTop: 10}}
            onChangeText={(text) => setPassword(text)}
            onFocus={() => {
              setSuccess({
                ...success,
                password: true,
              });
            }}
            placeholder="Password"
            secureTextEntry={true}
            success={success.password}
            value={password}
          />
          <Button
            style={{marginTop: 20}}
            full
            loading={loading}
            onPress={() => {
              onLogin();
            }}>
            {t('sign_in')}
          </Button>
          <TouchableOpacity
            onPress={() => navigation.navigate('ResetPassword')}>
            <Text body1 grayColor style={{marginTop: 25}}>
              {t('forgot_your_password')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}>
            <Text body1 grayColor style={{marginTop: 25}}>
              Register
            </Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
