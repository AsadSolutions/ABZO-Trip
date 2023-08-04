import React, {useState, useEffect} from 'react';
import {View, ScrollView, KeyboardAvoidingView, Platform} from 'react-native';
import {useDispatch,useSelector} from 'react-redux';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {BaseStyle, useTheme,BaseSetting} from '@config';
import {
  Image,
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  TextInput,
} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';

export default function ProfileEdit({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const auth = useSelector(state => state.auth);
  const login = auth.login;
 //console.warn("login page ",login);

  const [id, setId] = useState(login.data.id);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [currency_id, setCurrency_id] = useState(1);
  const [message, setMessage] = useState("");

  const [image] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const request = new Request(BaseSetting.REACT_APP_BASE_PATH + "user/" + id, { method: "GET" });
    fetch(request).then(res => {
      res.json().then(obj => {
        setName(obj.name);
        setEmail(obj.email);
        setMobile(obj.mobile);
        setPassword(obj.password);
        setAddress(obj.address);
        setCity(obj.city);
        setCountry(obj.country);
        setLatitude(obj.latitude);
        setLongitude(obj.longitude);
        setCurrency_id(obj.currency_id.id);
      });
    }).catch(err => {
      console.log("Error in Get menu", err);
    });
  }, [])

  
  const EditProfile = () => {
      setLoading(true);
      const data = new FormData();
      data.append("name", name);
      data.append("email", email);
      data.append("mobile", mobile);
      data.append("password", password);
      data.append("address", address);
      data.append("city", city);
      data.append("country", country);
      data.append("latitude", latitude);
      data.append("longitude", longitude);
      data.append("currency_id", 1);
      data.append("device", "mobile");
      const request = new Request(BaseSetting.REACT_APP_BASE_PATH + "user/" + id, { method: "PUT", body: data });
      console.log(request, data);
      fetch(request).then(res => {
          res.json().then(json => {
              setLoading(false);              
              if (json.message) {
                setMessage(json.message);
              } else {
                setMessage("Account updated successfully!");
              }
          });
      }).catch(err => {
          setLoading(false);         
          setMessage(err.message);
      });    
  };


  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={t('edit_profile')}
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
        onPressRight={() => {}}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{flex: 1}}>
        <ScrollView contentContainerStyle={styles.contain}>
          {/* <View>
            <Image source={image} style={styles.thumb} />
          </View> */}

          <Text>{message}</Text>
          <View style={styles.contentTitle}>
            <Text headline semibold>
              {t('name')}
            </Text>
          </View>
          <TextInput
            onChangeText={(text) => setName(text)}
            placeholder={t('input_name')}
            value={name}
          />

          <View style={styles.contentTitle}>
            <Text headline semibold>Mobile</Text>
          </View>
          <TextInput
            onChangeText={(text) => setMobile(text)}
            placeholder="Mobile"
            value={mobile}
          />

          <View style={styles.contentTitle}>
            <Text headline semibold>
              {t('email')}
            </Text>
          </View>
          <TextInput
            editable={false}
            onChangeText={(text) => setEmail(text)}
            placeholder={t('input_email')}
            value={email}
          />

          <View style={styles.contentTitle}>
            <Text headline semibold>
              {t('address')}
            </Text>
          </View>
          <View keyboardShouldPersistTaps='always' style={{
              flex: 1,
              padding: 2,
              width: "100%",
              backgroundColor: '#ecf0f1',
            }} >
              <GooglePlacesAutocomplete
                value = {address}
                placeholder={address}
                keepResultsAfterBlur={true}
                fetchDetails ={true}
                textInputProps={{ onBlur: () => { console.log("Blur") } }}
                onPress={(place, details) => {
                    //console.log(place, details);
                    setAddress(place.description);
                    setCity(place.terms[place.terms.length - 2].value);
                    setCountry(place.terms[place.terms.length - 1].value);
                    setLatitude(details.geometry.location.lat);
                    setLongitude(details.geometry.location.lng);
                }}
                listViewDisplayed={'auto'}  
                keyboardShouldPersistTaps={"handled"}
                query={{
                    key:  BaseSetting.REACT_APP_GOOGLE_KEY,
                    language: 'en',
                    location: 'Pakistan'
                }}
            />
        </View>

          <View style={styles.contentTitle}>
            <Text headline semibold>City</Text>
          </View>
          <TextInput
            onChangeText={(text) => setCity(text)}
            placeholder="City"
            value={city}
          />

          <View style={styles.contentTitle}>
            <Text headline semibold>Country</Text>
          </View>
          <TextInput
            onChangeText={(text) => setCountry(text)}
            placeholder="Country"
            value={country}
          />

          <View style={styles.contentTitle}>
            <Text headline semibold>Password</Text>
          </View>
          <TextInput
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            placeholder="Password"
            value={password}
          />


        </ScrollView>
        <View style={{paddingVertical: 15, paddingHorizontal: 20}}>
          <Button
            loading={loading}
            full
            onPress={() => {EditProfile()}}>
            {t('confirm')}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
