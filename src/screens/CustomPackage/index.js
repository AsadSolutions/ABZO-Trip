import React, {useState, useEffect} from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Text,
} from 'react-native';
import {BaseStyle, useTheme, BaseSetting} from '@config';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {
  Header,
  SafeAreaView,
  Icon,
  Button,
  TextInput,
  QuantityPicker,
} from '@components';
import DropDownPicker from 'react-native-dropdown-picker';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Calendar} from 'react-native-calendars';
var moment = require('moment');

export default function CustomPackage({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const auth = useSelector(state => state.auth);
  const mylogin = auth.login.success ? auth.login.data : {};

  const myvehicle_list = [
    {value: 'Car', label: 'Car'},
    {value: 'Fortuner', label: 'Fortuner'},
    {value: 'Prado', label: 'Prado'},
    {value: 'BRV', label: 'BRV'},
    {value: 'Hiace', label: 'Hiace'},
    {
      value: 'A.C Saloon coaster 22 seater',
      label: 'A.C Saloon coaster 22 seater',
    },
    {
      value: 'A.C Luxury Coach 35 to 53 seater',
      label: 'A.C Luxury Coach 35 to 53 seater',
    },
  ];
  const myseat_list = [
    {value: '4 Seater', label: '4 Seater'},
    {value: '7 Seater', label: '7 Seater'},
    {value: '12 Seater', label: '12 Seater'},
    {
      value: '29 seater with 6 folding seat',
      label: '29 seater with 6 folding seat',
    },
    {value: '22 seater (Business)', label: '22 seater (Business)'},
    {
      value: '35 to 53 seater (A.C Luxury Coach )',
      label: '35 to 53 seater (A.C Luxury Coach )',
    },
  ];
  const myhotel_list = [
    {value: 'Normal Hotel', label: 'Normal Hotel'},
    {value: 'Standard Hotel', label: 'Standard Hotel'},
    {value: 'Luxurary Hotel', label: 'Luxurary Hotel'},
    {value: '2 star Hotel', label: '2 star Hotel'},
    {value: '3 star Hotel', label: '3 star Hotel'},
    {value: '4 star Hotel', label: '4 star Hotel'},
    {value: '5 star Hotel', label: '5 star Hotel'},
    {value: 'Camping stay', label: 'Camping stay'},
    {value: 'Woods Hut', label: 'Woods Hut'},
    {value: 'Camping pods', label: 'Camping pods'},
    {value: 'Camping pods', label: 'Camping pods'},
  ];
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [vehicle_list] = useState(myvehicle_list);
  const [seat_list] = useState(myseat_list);
  const [hotel_list] = useState(myhotel_list);

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [name, setName] = useState(mylogin.name);
  const [mobile, setMobile] = useState(mylogin.mobile);
  const [email, setEmail] = useState(mylogin.email);
  const [from_city, setFrom_city] = useState('');

  const [vehicle, setVehicle] = useState([]);
  const [seat, setSeat] = useState([]);
  const [hotel, setHotel] = useState([]);
  const [items, setItems] = useState([]);
  const [days, setDays] = useState(0);
  const [food_detail, setFood_detail] = useState('');
  const [tour_detail, setTour_detail] = useState('');
  const [other_detail, setOther_detail] = useState('');
  const [adult, setAdult] = useState(0);
  const [child, setChild] = useState(0);
  const [infant, setInfant] = useState(0);
  const [couple, setCouple] = useState(0);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState({
    name: true,
    email: true,
    message: true,
  });
  const [loading, setLoading] = useState(false);
  const _format = 'YYYY-MM-DD';
  const _today = moment().format(_format);
  const _maxDate = moment().add(100, 'days').format(_format);
  const [_markedDates, setMarkedDates] = useState([_today]);
  const [selectedDates, setSelectdates] = useState([]);
  const onDaySelect = day => {
    let temp = [...selectedDates];
    const _selectedDay = moment(day.dateString).format(_format);
    let selected = true;
    if (_markedDates[_selectedDay]) {
      delete temp[_selectedDay];
      selected = !_markedDates[_selectedDay].selected;
    } else {
      temp.push(_selectedDay);
      setSelectdates(temp);
    }
    const updatedMarkedDates = {
      ..._markedDates,
      ...{[_selectedDay]: {selected}},
    };
    setMarkedDates(updatedMarkedDates);
  };

  /**
   * @description Called when user sumitted form
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */
  const onSubmit = () => {
    //validate
    if (
      name == '' ||
      mobile == '' ||
      email == '' ||
      from_city == '' ||
      vehicle.length == 0 ||
      seat.length == 0 ||
      hotel.length == 0 ||
      items.length == 0 ||
      days == 0 ||
      food_detail == '' ||
      (adult == 0 && child == 0 && infant == 0 && couple == 0)
    ) {
      setMessage('Filled all fields before submit!');
      return false;
    }
    setLoading(true);
    const data = new FormData();
    data.append('name', name);
    data.append('mobile', mobile);
    data.append('email', email);
    data.append('from_city', from_city);
    data.append('destination_places', items.join(','));
    data.append('days', days);
    data.append('def_dates', Object.keys(_markedDates).join(','));
    data.append('vehicle_item', vehicle.join(','));
    data.append('hotel_item', hotel.join(','));
    data.append('seat_item', seat.join(','));
    data.append('adult', adult);
    data.append('child', child);
    data.append('infant', infant);
    data.append('couple', couple);
    data.append('food_detail', food_detail);
    data.append('tour_detail', tour_detail);
    data.append('other_detail', other_detail);
    //console.log(data);
    const request = new Request(
      BaseSetting.REACT_APP_BASE_PATH + 'custompackage',
      {method: 'POST', body: data},
    );
    fetch(request)
      .then(res => {
        res.json().then(json => {
          setLoading(false);
          setMessage(json.message);
        });
      })
      .catch(err => {
        setLoading(false);
        setMessage(err.message);
      });
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={'Customized'}
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
          <Text headline bold primaryColor style={{marginVertical: 10}}>
            Request for Customized Package
          </Text>
          <Text headline primaryColor style={{marginVertical: 10}}>
            {message}
          </Text>
          <TextInput
            onChangeText={text => setName(text)}
            placeholder={t('name')}
            success={success.name}
            value={name}
          />
          <TextInput
            style={{marginTop: 10}}
            onChangeText={text => setMobile(text)}
            placeholder={'Mobile'}
            value={mobile}
          />
          <TextInput
            style={{marginTop: 10}}
            onChangeText={text => setEmail(text)}
            placeholder={t('email')}
            keyboardType="email-address"
            value={email}
          />
          <View style={{padding: 20}}>
            <Text headline semibold>
              Departure City
            </Text>
            <View
              keyboardShouldPersistTaps="always"
              style={{flex: 1, padding: 10, backgroundColor: '#ecf0f1'}}>
              <GooglePlacesAutocomplete
                value={from_city}
                placeholder={from_city ? from_city : 'Select City'}
                keepResultsAfterBlur={true}
                fetchDetails={true}
                onPress={(place, details) => {
                  setFrom_city(place.terms[place.terms.length - 2].value);
                }}
                listViewDisplayed={'auto'}
                keyboardShouldPersistTaps={'handled'}
                query={{
                  key: BaseSetting.REACT_APP_GOOGLE_KEY,
                  language: 'en',
                  location: 'Pakistan',
                }}
              />
            </View>
          </View>
          <View style={{padding: 20}}>
            <Text headline semibold>
              Visiting Cities
            </Text>
            <View
              keyboardShouldPersistTaps="always"
              style={{flex: 1, padding: 10, backgroundColor: '#ecf0f1'}}>
              <GooglePlacesAutocomplete
                placeholder={'Select City'}
                keepResultsAfterBlur={true}
                fetchDetails={true}
                onPress={(place, details) => {
                  setItems([
                    ...items,
                    place.terms[place.terms.length - 2].value,
                  ]);
                }}
                listViewDisplayed={'auto'}
                keyboardShouldPersistTaps={'handled'}
                query={{
                  key: BaseSetting.REACT_APP_GOOGLE_KEY,
                  language: 'en',
                  location: 'Pakistan',
                }}
              />
              {items.map((val, index) => {
                return (
                  <Pressable
                    onPress={() => {
                      var newitem = items.filter((val2, index2) => {
                        return val != val2;
                      });
                      console.log(newitem, val);
                      setItems(newitem);
                    }}>
                    <Text>X {val}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <TextInput
            style={{marginTop: 10, height: 120}}
            onChangeText={text => setFood_detail(text)}
            textAlignVertical="top"
            multiline={true}
            placeholder={'Food Detail'}
            value={food_detail}
          />
          <TextInput
            style={{marginTop: 10, height: 120}}
            onChangeText={text => setTour_detail(text)}
            textAlignVertical="top"
            multiline={true}
            placeholder={'Tour Detail'}
            value={tour_detail}
          />
          <View style={{marginTop: 20, flexDirection: 'row'}}>
            <QuantityPicker
              true={true}
              label={'Tour Duration Days'}
              value={days}
              onChange={val => {
                setDays(val);
              }}
            />
          </View>

          <View style={{marginTop: 20, flexDirection: 'row'}}>
            <QuantityPicker
              true={true}
              label={t('adults')}
              value={adult}
              onChange={val => {
                setAdult(val);
              }}
            />
            <QuantityPicker
              true={true}
              label={'children (Age 4-9 Year)'}
              value={child}
              style={{marginHorizontal: 15}}
              onChange={val => {
                setChild(val);
              }}
            />
          </View>
          <View style={{marginTop: 20, flexDirection: 'row'}}>
            <QuantityPicker
              true={true}
              label="Infant (Age 1-4 Year)"
              value={infant}
              onChange={val => {
                setInfant(val);
              }}
            />
            <QuantityPicker
              true={true}
              label="Couple"
              value={couple}
              style={{marginHorizontal: 15}}
              onChange={val => {
                setCouple(val);
              }}
            />
          </View>
          <View style={{padding: 20}}>
            <Text headline semibold>
              Vehcile Type
            </Text>
            <DropDownPicker
              multiple={true}
              listMode="MODAL"
              open={open1}
              value={vehicle}
              items={vehicle_list}
              setOpen={setOpen1}
              setValue={setVehicle}
            />
          </View>
          <View style={{padding: 20}}>
            <Text headline semibold>
              Seat Capacity
            </Text>
            <DropDownPicker
              multiple={true}
              listMode="MODAL"
              open={open2}
              value={seat}
              items={seat_list}
              setOpen={setOpen2}
              setValue={setSeat}
            />
          </View>
          <View style={{padding: 20}}>
            <Text headline semibold>
              Hotel Type
            </Text>
            <DropDownPicker
              multiple={true}
              listMode="MODAL"
              open={open3}
              value={hotel}
              items={hotel_list}
              setOpen={setOpen3}
              setValue={setHotel}
            />
          </View>
          <View style={{marginLeft: 10}}>
            <Text subhead semibold>
              Departure Dates (Select multiple){' '}
            </Text>
            <Calendar
              style={{width: '100%', height: 250}}
              onDayPress={onDaySelect}
              markedDates={_markedDates}
            />
          </View>
          <TextInput
            style={{marginTop: 10, height: 120}}
            onChangeText={text => setOther_detail(text)}
            textAlignVertical="top"
            multiline={true}
            placeholder={'Other Detail'}
            value={other_detail}
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
