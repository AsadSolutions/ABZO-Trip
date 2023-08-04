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
import * as Utils from '@utils';
import {useTranslation} from 'react-i18next';
import {useSelector, useDispatch} from 'react-redux';
import {BookingActions} from '@actions';

export default function InfoFilter({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const storeFilter = useSelector(state => state.booking.info_filter);
  const auth = useSelector(state => state.auth);
  const mylogin = auth.login.success;
  const [login] = useState(mylogin);

  const dispatch = useDispatch();
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [cat_list, setCat_list] = useState([]);
  const [subcat_list, setSubcat_list] = useState([]);
  //form element
  const [cat_id, setCat_id] = useState(0);
  const [subcat_id, setSubcat_id] = useState(0);
  const [from_city, setFrom_city] = useState('');
  const [to_city, setTo_city] = useState('');

  const getList1 = () => {
    const request = new Request(
      BaseSetting.REACT_APP_BASE_PATH + 'InfoCategory?status=true',
      {method: 'GET'},
    );
    fetch(request)
      .then(res => {
        res.json().then(obj => {
          var listItems = [];
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
  const getList2 = () => {
    const request = new Request(
      BaseSetting.REACT_APP_BASE_PATH +
        'InfoSubCategory?status=true&category_id=' +
        cat_id,
      {method: 'GET'},
    );
    fetch(request)
      .then(res => {
        res.json().then(obj => {
          var listItems = [];
          Object.keys(obj).forEach(function (key) {
            listItems.push({value: obj[key].id, label: obj[key].title});
          });
          setSubcat_list(listItems);
          return obj;
        });
      })
      .catch(err => {
        console.log('Error in Get menu', err);
      });
  };
  useEffect(() => {
    getList1();
    if (storeFilter) {
      setCat_id(storeFilter.cat_id);
      setSubcat_id(storeFilter.subcat_id);
      setFrom_city(storeFilter.from_city);
      setTo_city(storeFilter.to_city);
    }
  }, []);
  useEffect(() => {
    getList2();
  }, [cat_id]);
  const apply = () => {
    var info_filter = {
      cat_id: cat_id,
      subcat_id: subcat_id,
      from_city: from_city,
      to_city: cat_id == 1 ? to_city : '',
    };
    dispatch(BookingActions.onINFO_FILTER(info_filter));
    navigation.navigate('InfoList');
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title="Info Filter"
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
            Category
          </Text>
          <DropDownPicker
            listMode="MODAL"
            open={open1}
            setOpen={setOpen1}
            value={cat_id}
            items={cat_list}
            setValue={setCat_id}
            setItems={setCat_list}
          />
        </View>
        <View style={{padding: 20}}>
          <Text headline semibold>
            Sub Category
          </Text>
          <DropDownPicker
            listMode="MODAL"
            open={open2}
            setOpen={setOpen2}
            value={subcat_id}
            items={subcat_list}
            setValue={setSubcat_id}
            setItems={setSubcat_list}
          />
        </View>

        <View style={{padding: 20}}>
          <Text headline semibold>
            {cat_id == 1 ? 'From City' : 'City'}
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
        {cat_id == 1 && (
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
                value={from_city}
                placeholder={'Select City ' + from_city}
                keepResultsAfterBlur={true}
                fetchDetails={true}
                onPress={(place, details) => {
                  setTo_city(place.terms[place.terms.length - 2].value);
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
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
