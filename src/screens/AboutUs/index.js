import React, {useState, useEffect} from 'react';
import {View, ScrollView, ImageBackground, FlatList} from 'react-native';
import {useTranslation} from 'react-i18next';
import HTMLView from 'react-native-htmlview';
import {BaseStyle, Images, useTheme, BaseSetting} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text
} from '@components';
import styles from './styles';

export default function AboutUs(props) {
  const {navigation, route} = props; 
  const {colors} = useTheme();
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [id, setId] = useState(route.params ? route.params.id : 1);
  const getinfo = (id) => {
    const request = new Request(BaseSetting.REACT_APP_BASE_PATH + "pages/"+id, { method: "GET" });
    fetch(request).then(res => {
      res.json().then(obj => {
        setTitle(obj.title);
        setDescription(obj.description);
      });
    }).catch(err => {
      console.log("Error in Get menu", err);
    });
  };
  useEffect(() => {
    getinfo(id);
  },[])

  const HTML = `
      <h1>This Is A Heading</h1>
      <h2>And below is my dog</h2>
      <img src="https://www.kindacode.com/wp-content/uploads/2020/10/dog_sample.jpg" alt="My Dog"/>
      <br/>
      <hr/>
      <br/>
      <em style="textAlign: center;">Have a nice day with React Native</em>
      <div>
        <p>This is a paragraph</p>
      </div>
      `;

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={title}
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
      <ScrollView style={{flex: 1}}>
        <ImageBackground source={Images.trip4} style={styles.banner}>
          <Text title1 semibold whiteColor>
            {title}
          </Text>
        </ImageBackground>
          <View style={styles.content}>
          <HTMLView value={description} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
