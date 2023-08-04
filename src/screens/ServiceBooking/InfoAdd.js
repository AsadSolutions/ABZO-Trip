import React, {useState,useEffect} from 'react';
import {StyleSheet,View, KeyboardAvoidingView, Platform, ScrollView,Pressable, Text,TouchableOpacity,Image} from 'react-native';
import {BaseStyle, useTheme,BaseSetting} from '@config';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux'; 
import {Header, SafeAreaView, Icon, Button, TextInput} from '@components';
import DropDownPicker from 'react-native-dropdown-picker';
import {launchImageLibrary} from 'react-native-image-picker';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import axios from 'axios';

export default function InfoAdd({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const auth = useSelector(state => state.auth);
  const [user_id] = useState(auth.login.data.id);
  const [cat_list, setCat_list] = useState([]);
  const [subcat_list, setSubcat_list] = useState([]);
  const [category_id, setCategory_id] = useState(0);
  const [subcategory_id, setSubcategory_id] = useState(0);
  const [from_city, setFrom_city] = useState("");
  const [to_city, setTo_city] = useState("");
  const [video, setVideo] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState("");
  const [fileupload, setFileupload] = useState(null);

  const [selected, setSelected] = useState("");
  const [show_to_city, setShow_to_city] = useState(false);
  const [location_title, setLocation_title] = useState("From City");
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);  

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (category_id == 1) {
      setShow_to_city(true);
      setLocation_title("From City");
    } else {     
      setShow_to_city(false);
      setLocation_title("Location");
    }  
    if(category_id > 0){
      getSubList(category_id);
    }
  }, [category_id])

  useEffect(() => {
    getList();
  }, [])

 const getList = () => {
    const request = new Request(BaseSetting.REACT_APP_BASE_PATH + "InfoCategory?status=true", { method: "GET" });
    fetch(request).then(res => {
      res.json().then(obj => {
        var listItems = [];
        Object.keys(obj).forEach(function (key) {
          listItems.push({ "value": obj[key].id, "label": obj[key].title });
        });
        setCat_list(listItems);
      });
    }).catch(err => {
      console.log("Error in Get menu", err);
    });
  };
  
  const getSubList = (cat_id) => {
    const request = new Request(BaseSetting.REACT_APP_BASE_PATH + "InfoSubCategory?status=true&category_id=" + cat_id, { method: "GET" });
    fetch(request).then(res => {
      res.json().then(obj => {
        var listItems = [];
        Object.keys(obj).forEach(function (key) {
          listItems.push({ "value": obj[key].id, "label": obj[key].title });
        });
        setSubcat_list(listItems);
      });
    }).catch(err => {
      console.log("Error in Get menu", err);
    });
  };
  const onSubmit = () => {
    if (fileupload) {
      file_upload();
    } else {
      save_data("");
    }
  };

  const chooseFile = () => {
    launchImageLibrary({}, (response) => {
      if (response && !response.didCancel) {
        response = response["assets"][0];
        response.name = response.fileName;
        setFileupload(response);
      }
    });
  };

  const file_upload = () => {
    setLoading(true);
    console.log("file upload", fileupload);
    var formdata = new FormData();
    formdata.append("fileupload", fileupload, fileupload.uri);
    var requestOptions = {
      method: 'POST',
      headers: new Headers(),
      body: formdata,
      redirect: 'follow'
    };
    fetch(BaseSetting.REACT_APP_BASE_PATH+"uploadprofileimg", requestOptions)
      .then(response => response.json())
      .then(result => {
        setLoading(false);
        console.log(result);
        setPicture(result.filename);
        setTimeout(() => {
          save_data(result.filename);
        }, 1000);
      })
      .catch(error => {
        setLoading(false);
        console.log('error', error);
        setMessage(err.message);
    });
  }

  const save_data = (photo) => {
      setLoading(true);
      const data = new FormData();
      data.append("category_id", category_id);
      data.append("subcategory_id", subcategory_id);
      data.append("user_id", user_id);
      data.append("from_city", from_city);
      data.append("to_city", to_city);
      data.append("description", description);
      data.append("picture", photo);
      console.log(data);
      const request = new Request(BaseSetting.REACT_APP_BASE_PATH+"InfoPages", {method: "POST", body: data});
        fetch(request).then(res => {
        res.json().then(json => {	
          setLoading(false);
          setMessage(json.message);
          setTimeout(() => {
            alert("Info saved successfully!");
            navigation.goBack();
          }, 2000);
        });
      }).catch(err => {
        setLoading(false);
        setMessage(err.message);
      });
  };
  
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={"Add Info Page"}
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
          <Text headline primaryColor style={{marginVertical: 10}}>{message}</Text>

          <View style={{padding: 20}}>
            <Text headline semibold>
              Select Category
            </Text>
            <DropDownPicker
                listMode="MODAL"
                open={open1}
                value={category_id}
                items={cat_list}
                setOpen={setOpen1}
                setValue={setCategory_id}
              />
          </View>
          <View style={{padding: 20}}>
            <Text headline semibold>
              Select Sub Category 
            </Text>
            <DropDownPicker
                listMode="MODAL"
                open={open2}
                value={subcategory_id}
                items={subcat_list}
                setOpen={setOpen2}
                setValue={setSubcategory_id}
              />
          </View>

          <View style={{padding: 20}}>
            <Text headline semibold>
              {location_title}
            </Text>
            <View keyboardShouldPersistTaps='always' style={{flex: 1,padding: 10,backgroundColor: '#ecf0f1'}} >
                <GooglePlacesAutocomplete
                  value = {from_city}
                  placeholder={from_city ? from_city : 'Select City'}
                  keepResultsAfterBlur={true}
                  fetchDetails ={true}
                  textInputProps={{ onBlur: () => { console.log("Blur") } }}
                  onPress={(place, details) => {
                      setFrom_city(place.terms[place.terms.length - 2].value);
                  }}
                  listViewDisplayed={'auto'}  
                  keyboardShouldPersistTaps={"handled"}
                  query={{key:  BaseSetting.REACT_APP_GOOGLE_KEY,language: 'en',location: 'Pakistan'}}
              />
            </View>
          </View>

          {show_to_city && <View style={{padding: 20}}>
            <Text headline semibold>
              To City
            </Text>
            <View keyboardShouldPersistTaps='always' style={{flex: 1,padding: 10,backgroundColor: '#ecf0f1'}} >
                <GooglePlacesAutocomplete
                  value = {to_city}
                  placeholder={to_city ? to_city : 'Select City'}
                  keepResultsAfterBlur={true}
                  fetchDetails ={true}
                  textInputProps={{ onBlur: () => { console.log("Blur") } }}
                  onPress={(place, details) => {
                      setTo_city(place.terms[place.terms.length - 2].value);
                  }}
                  listViewDisplayed={'auto'}  
                  keyboardShouldPersistTaps={"handled"}
                  query={{key:  BaseSetting.REACT_APP_GOOGLE_KEY,language: 'en',location: 'Pakistan'}}
              />
            </View>
          </View>}
          
          <TextInput
            onChangeText={(text) => setVideo(text)}
            textAlignVertical="top"
            multiline={true}
            placeholder={'Video'}
            value={video}
          />
          
          <TextInput
            style={{marginTop: 10, height: 120}}
            onChangeText={(text) => setDescription(text)}
            textAlignVertical="top"
            multiline={true}
            placeholder={'Description'}
            value={description}
          />

 

        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={chooseFile}>
          <Text style={styles.textStyle}>
            Choose Image
          </Text>
        </TouchableOpacity>

        {fileupload && <Image source={{uri: fileupload.uri}} style={styles.imageStyle} />}

        </ScrollView>
        
        <View style={{paddingVertical: 15, paddingHorizontal: 20}}>
          <Button
            loading={loading}
            full
            onPress={() => {
              onSubmit();
            }}>
            {t('save')}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  textStyle: {
    padding: 10,
    color: 'black',
  },
  buttonStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#DDDDDD',
    padding: 5,
    marginTop: 10,
  },
  imageStyle: {
    width: 200,
    height: 200,
    margin: 5,
  },
});