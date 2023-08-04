import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Button,
  Picker,
} from 'react-native';
import {BaseStyle, BaseColor, useTheme, BaseSetting} from '@config';
import {Header, SafeAreaView, Icon, Text, Tag} from '@components';
import DropDownPicker from 'react-native-dropdown-picker';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import DatePicker from 'react-native-date-picker';
import * as Utils from '@utils';
import {useTranslation} from 'react-i18next';
import {useSelector, useDispatch} from 'react-redux';
import {BookingActions} from '@actions';

export default function GuideFilter({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const storeFilter = useSelector(state => state.booking.guide_filter);
  const dispatch = useDispatch();
  const [scrollEnabled, setScrollEnabled] = useState(true);
  //console.warn("Store filter ", storeFilter);
  //custom code
  //var today = new Date();
  //var date = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
  //const [from_date, setFrom_date] = useState(date);
  //const [to_date, setTo_date] = useState(date);
  //const [def_cat, setDef_cat] = useState(0);

  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [city_list, setCity_list] = useState([]);
  const [cat_list, setCat_list] = useState([]);
  //form element
  const [cat_id, setCat_id] = useState(0);
  const [city_id, setCity_id] = useState(0);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [open, setOpen] = useState(false);
  const [today] = useState(new Date());

  const getList = () => {
    const request = new Request(
      BaseSetting.REACT_APP_BASE_PATH +
        'ServiceSubCategory?ServiceCategoryId=3&status=true',
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
          //console.log("output subcategory", listItems);
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
      BaseSetting.REACT_APP_BASE_PATH + 'City?guide=1&allow_booking=1',
      {method: 'GET'},
    );
    fetch(request)
      .then(res => {
        res.json().then(obj => {
          var listItems = [];
          Object.keys(obj).forEach(function (key) {
            listItems.push({value: obj[key].id, label: obj[key].title});
          });
          //console.log("output city", listItems);
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
      setCat_id(storeFilter.cat_id);
      setCity_id(storeFilter.city_id);
      setCity(storeFilter.city);
      setAddress(storeFilter.address);
      setCountry(storeFilter.country);
      setDate(storeFilter.date);
    }
  }, []);
  const apply = () => {
    if (!(city_id > 0)) {
      alert('City is required! ');
      return;
    }
    var guide_filter = {
      cat_id: cat_id,
      city_id: city_id,
      city: city,
      address: address,
      date: date,
      country: country,
    };
    dispatch(BookingActions.onGUIDE_FILTER(guide_filter));
    navigation.navigate('GuideList');
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title="Guide Filter"
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
      <ScrollView
        horizontal={false}
        scrollEnabled={scrollEnabled}
        onContentSizeChange={(contentWidth, contentHeight) =>
          setScrollEnabled(Utils.scrollEnabled(contentWidth, contentHeight))
        }>
        <View style={{padding: 20}}>
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
            City
          </Text>
          <View
            keyboardShouldPersistTaps="always"
            style={{
              flex: 1,
              padding: 10,
              backgroundColor: '#ecf0f1',
            }}>
            <GooglePlacesAutocomplete
              value={city}
              placeholder={'Select City ' + city}
              keepResultsAfterBlur={true}
              fetchDetails={true}
              textInputProps={{
                onBlur: () => {
                  console.log('Blur');
                },
              }}
              onPress={(place, details) => {
                //console.log(place, details);
                setAddress(place.description);
                setCity(place.terms[place.terms.length - 2].value);
                setCountry(place.terms[place.terms.length - 1].value);
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
      </ScrollView>
    </SafeAreaView>
  );
}
