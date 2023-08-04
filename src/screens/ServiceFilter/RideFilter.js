import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Button,
} from 'react-native';
import {BaseStyle, useTheme, BaseSetting} from '@config';
import {Header, SafeAreaView, Icon, Text, Tag} from '@components';
import DropDownPicker from 'react-native-dropdown-picker';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import DatePicker from 'react-native-date-picker';
import * as Utils from '@utils';
import {useTranslation} from 'react-i18next';
import {useSelector, useDispatch} from 'react-redux';
import {BookingActions} from '@actions';

export default function RideFilter({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const storeFilter = useSelector(state => state.booking.ride_filter);
  const dispatch = useDispatch();
  const [scrollEnabled, setScrollEnabled] = useState(true);

  var rent_type_list = [
    {value: 1, label: 'Per KM'},
    {value: 2, label: 'Per Day'},
    {value: 3, label: 'Per Seat'},
  ];

  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [city_list, setCity_list] = useState([]);
  const [cat_list, setCat_list] = useState([]);
  const [rent_list, setRent_list] = useState(rent_type_list);
  //form element
  const [cat_id, setCat_id] = useState(0);
  const [city_id, setCity_id] = useState(0);
  const [rent_type, setRent_type] = useState(1);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [today] = useState(new Date());

  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [maxkm] = useState(500);
  const [from_lat, setFrom_lat] = useState('');
  const [from_lng, setFrom_lng] = useState('');
  const [from_country, setFrom_country] = useState('');
  const [ride_from, setRide_from] = useState('');

  const [from_city, setFrom_city] = useState('');
  const [to_lat, setTo_lat] = useState('');
  const [to_lng, setTo_lng] = useState('');
  const [to_country, setTo_country] = useState('');
  const [to_city, setTo_city] = useState('');
  const [ride_to, setRide_to] = useState('');

  const getList = () => {
    const request = new Request(
      BaseSetting.REACT_APP_BASE_PATH +
        'ServiceSubCategory?ServiceCategoryId=1&status=true',
      {method: 'GET'},
    );
    fetch(request)
      .then(res => {
        res.json().then(obj => {
          var listItems = [];
          listItems.push({value: '', label: 'All'});
          Object.keys(obj).forEach(function (key) {
            listItems.push({value: obj[key].id, label: obj[key].title});
          });
          setCat_list(listItems);
          return obj;
        });
      })
      .catch(err => {
        console.log('Error in Get menu', err);
      });
  };
  const getCityList = () => {
    const request = new Request(
      BaseSetting.REACT_APP_BASE_PATH + 'City?ride=1&allow_booking=1',
      {method: 'GET'},
    );
    fetch(request)
      .then(res => {
        res.json().then(obj => {
          var listItems = [];
          Object.keys(obj).forEach(function (key) {
            listItems.push({value: obj[key].id, label: obj[key].title});
          });
          setCity_list(listItems);
        });
      })
      .catch(err => {
        console.log('Error in Get menu', err);
      });
  };
  useEffect(() => {
    getList();
    getCityList();
    if (storeFilter) {
      setDistance(storeFilter.distance);
      setDuration(storeFilter.duration);
      setCat_id(storeFilter.cat_id);
      setCity_id(storeFilter.city_id);
      setDate(storeFilter.date);
      setRent_type(storeFilter.rent_type);
      setFrom_city(storeFilter.from_city);
      setFrom_country(storeFilter.from_country);
      setRide_from(storeFilter.ride_from);
      setFrom_lat(storeFilter.from_lat);
      setFrom_lng(storeFilter.from_lng);
      setTo_city(storeFilter.to_city);
      setTo_country(storeFilter.to_country);
      setTo_lat(storeFilter.to_lat);
      setTo_lng(storeFilter.to_lng);
      setRide_to(storeFilter.ride_to);
    }
  }, []);
  useEffect(() => {
    if (rent_type == 1 && from_lat != '' && to_lat != '') {
      getDirections(from_lat + ',' + from_lng, to_lat + ',' + to_lng);
    }
  }, [from_lat, from_lng, to_lat, to_lng]);

  const apply = () => {
    if (rent_type == 1 && distance > maxkm) {
      alert('You are not allowed more than ' + maxkm + ' KM');
      return;
    } else if (!(city_id > 0)) {
      alert('City is required! ');
      return;
    }
    var ride_filter = {
      to_lat: to_lat,
      from_lat: from_lat,
      to_lng: to_lng,
      from_lng: from_lng,
      from_city: from_city,
      from_country: from_country,
      ride_from: ride_from,
      to_city: to_city,
      to_country: to_country,
      ride_to: ride_to,
      duration: duration,
      distance: distance,
      rent_type: rent_type,
      city_id: city_id,
      cat_id: cat_id,
      date: date,
    };
    dispatch(BookingActions.onRIDE_FILTER(ride_filter));
    navigation.navigate('RideList');
  };

  const getDirections = (source, destination) => {
    const request = new Request(
      `https://maps.googleapis.com/maps/api/directions/json?&key=${BaseSetting.REACT_APP_GOOGLE_KEY}&origin=${source}&destination=${destination}`,
      {method: 'GET'},
    );
    fetch(request)
      .then(res => {
        res.json().then(obj => {
          try {
            obj = obj['routes'][0]['legs'][0];
            setDistance(parseInt(obj.distance.value / 1000));
            setDuration(parseInt(obj.duration.value / 60));
          } catch (e) {}
        });
      })
      .catch(err => {
        console.log('Error direction ', err);
      });
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title="Ride Filter"
        subTitle={`Distance ${distance} KM, Duration:${duration} Minute`}
        renderLeft={() => {
          return <Icon name="times" size={20} color={colors.primary} />;
        }}
        renderRight={() => {
          return (
            <Text headline primaryColor numberOfLines={1}>
              {t('apply')}
            </Text>
          );
        }}
        onPressLeft={() => navigation.goBack()}
        onPressRight={apply}
      />
      <FlatList
        contentContainerStyle={{padding: 20}}
        data={[1]} // Placeholder data, replace with your actual data or remove if not needed
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <>
            <View>
              <Text headline semibold>
                Select City
              </Text>
              <DropDownPicker
                listMode="MODAL"
                open={open1}
                value={city_id}
                items={city_list}
                setOpen={setOpen1}
                setValue={setCity_id}
                setItems={setCity_list}
              />
            </View>

            <View style={{padding: 20}}>
              <Text headline semibold>
                Select Category
              </Text>

              <DropDownPicker
                listMode="MODAL"
                open={open2}
                value={cat_id}
                items={cat_list}
                setOpen={setOpen2}
                setValue={setCat_id}
                setItems={setCat_list}
              />
            </View>
            <View style={{padding: 20}}>
              <Text headline semibold>
                Rent Type
              </Text>

              <DropDownPicker
                listMode="MODAL"
                open={open3}
                value={rent_type}
                items={rent_list}
                setOpen={setOpen3}
                setValue={setRent_type}
                setItems={setRent_list}
              />
            </View>

            <View style={{padding: 20}}>
              <Text headline semibold>
                From City
              </Text>
              <View
                keyboardShouldPersistTaps="always"
                style={{
                  flex: 1,
                  padding: 10,
                  backgroundColor: '#ecf0f1',
                }}>
                <GooglePlacesAutocomplete
                  value={from_city}
                  placeholder={'Select City ' + from_city}
                  keepResultsAfterBlur={true}
                  fetchDetails={true}
                  textInputProps={{onBlur: () => {}}}
                  onPress={(place, details) => {
                    setFrom_lat(details.geometry.location.lat);
                    setFrom_lng(details.geometry.location.lng);
                    setFrom_city(place.terms[place.terms.length - 2].value);
                    setFrom_country(place.terms[place.terms.length - 1].value);
                    setRide_from(place.description);
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
                To City
              </Text>
              <View
                keyboardShouldPersistTaps="always"
                style={{
                  flex: 1,
                  padding: 10,
                  backgroundColor: '#ecf0f1',
                }}>
                <GooglePlacesAutocomplete
                  value={to_city}
                  placeholder={'Select City ' + to_city}
                  keepResultsAfterBlur={true}
                  fetchDetails={true}
                  textInputProps={{onBlur: () => {}}}
                  onPress={(place, details) => {
                    setTo_lat(details.geometry.location.lat);
                    setTo_lng(details.geometry.location.lng);
                    setTo_city(place.terms[place.terms.length - 2].value);
                    setTo_country(place.terms[place.terms.length - 1].value);
                    setRide_to(place.description);
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
              <TouchableOpacity
                style={{
                  backgroundColor: '#FDC60A',
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  borderRadius: 8,
                  alignItems: 'center',
                  width: 150,
                  height: 50,
                }}
                onPress={() => setOpen(true)}>
                <Text style={{color: 'white', fontSize: 16}}>Select Date</Text>
              </TouchableOpacity>
              <DatePicker
                modal
                open={open}
                date={new Date()}
                mode="date"
                minimumDate={today}
                onConfirm={date => {
                  setOpen(false);
                  setSelectedDate(date);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
              {selectedDate && (
                <Text style={{marginTop: 10}}>
                  Selected Date: {selectedDate.toDateString()}
                </Text>
              )}
            </View>
          </>
        )}
      />
    </SafeAreaView>
  );
}
