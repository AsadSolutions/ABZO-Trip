import React, {useState, useEffect} from 'react';
import {View, ScrollView, TouchableOpacity} from 'react-native';
import {BaseStyle, useTheme, BaseSetting} from '@config';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  ProfileDescription
} from '@components';
import {useTranslation} from 'react-i18next';

export default function Partner({navigation}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [open1, setOpen1] = useState(false);
  const [city_id, setCity_id] = useState(0);
  const [city_list, setCity_list] = useState([]);
  const [message, setMessage] = useState("");
  const [list, setList] = useState([]);


  const getinfo = () => {
    var where = city_id > 0 ? "&city=" + city_id : "";
    const request = new Request(BaseSetting.REACT_APP_BASE_PATH + "assistant?status=1&mystatus=1&is_show=true" + where, { method: "GET" });
    fetch(request).then(res => {
      res.json().then(json => {
        console.log("partner list", json);
        setList(json);
      });
    }).catch(err => {
      setMessage(err.message);
    });
  };
  getCity = () => {
    const request = new Request(BaseSetting.REACT_APP_BASE_PATH + "City?status=true", { method: "GET" });
    fetch(request).then(res => {
      res.json().then(obj => {
        var listItems = [];
        listItems.push({ "value": 0, "label": "All" });
        Object.keys(obj).forEach(function (key) {
          listItems.push({ "value": obj[key].id, "label": obj[key].title });
        });
        setCity_list(listItems);
      });
    }).catch(err => {
      console.log("Error in Get menu", err);
    });
  };

  useEffect(() => {
    getinfo();
    getCity();
  }, [])
  useEffect(() => {
    getinfo();
  }, [city_id])
  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={'Nearby Abzo Offices'}
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
      <DropDownPicker
          listMode="MODAL"
          open={open1}
          value={city_id}
          items={city_list}
          setOpen={setOpen1}
          setValue={setCity_id}
          setItems={setCity_list}
        />
      <ScrollView>
      <View style={{paddingHorizontal: 20,marginTop:20}}>
          {list.map((item, index) => {
            var picture_array = item.picture ? item.picture.split(',') : [];
            var picture = picture_array.length > 0 ? picture_array[0]: "upload/default.png";
            picture = {uri: BaseSetting.REACT_APP_FILE_PATH + picture};
            return (
              <ProfileDescription
                key={'service' + index}
                image={picture}
                name={item.name}
                subName={item.mobile}
                email={item.email}
                description={item.address}
                style={{marginBottom: 10}}
                onPress={() => navigation.navigate(item.screen)}
              />
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
