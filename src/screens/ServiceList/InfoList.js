import React, {useEffect, useState} from 'react';
import {FlatList, RefreshControl, View, Animated} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Button, FilterSort,PostItem, ProfileAuthor} from '@components';
import styles from './styles';
import * as Utils from '@utils';
import {useTranslation} from 'react-i18next';
import {BaseSetting} from '@config';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {BookingActions} from '@actions';

export default function InfoList(props) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const storeFilter = useSelector(state => state.booking.info_filter);
  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);
  const [islogin] = useState(auth.login.success);


  const [modeView, setModeView] = useState('list');
  const [subtitle, setSubTitle] = useState('');
  const [list, setList] = useState([]);
  const [refreshing] = useState(false);
  const scrollAnim = new Animated.Value(0);
  const offsetAnim = new Animated.Value(0);
  const clampedScroll = Animated.diffClamp(
    Animated.add(
      scrollAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolateLeft: 'clamp',
      }),
      offsetAnim,
    ),
    0,
    40,
  );
  
  useEffect(() => {
    if(storeFilter){
      setSubTitle(storeFilter.from_city ? storeFilter.from_city + (storeFilter.cat_id == 1 ? " - " + storeFilter.to_city : "") : "");
      let extra_param = `category_id=${storeFilter.cat_id}&subcategory_id=${storeFilter.subcat_id}&from_city=${storeFilter.from_city}&to_city=${storeFilter.to_city}`;
      const request = new Request( BaseSetting.REACT_APP_BASE_PATH + "InfoPages?"+extra_param,{ method: "GET"});
      fetch(request).then((res) => {
          res.json().then((json) => {
            setList(json);
          });
      }).catch((err) => {
          console.log("Error in Get menu", err.message);
      });
    }    
  }, [isFocused])
  
  const onChangeSort = () => {};

  /**
   * @description Open modal when filterring mode is applied
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */
  const onFilter = () => {
    navigation.navigate('InfoFilter');
  };

  /**
   * @description Open modal when view mode is pressed
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */
  const onChangeView = () => {
    Utils.enableExperimental();
    switch (modeView) {
      case 'block':
        setModeView('grid');
        break;
      case 'grid':
        setModeView('list');

        break;
      case 'list':
        setModeView('block');

        break;
      default:
        setModeView('block');
        break;
    }
  };

  /**
   * @description Render container view
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   * @returns
   */
  const renderContent = () => {
      const navbarTranslate = clampedScroll.interpolate({
        inputRange: [0, 40],
        outputRange: [0, -40],
        extrapolate: 'clamp',
      });
      return (
        <View style={{flex: 1}}>
          <Animated.FlatList
            contentContainerStyle={{
              paddingTop: 50,
            }}
            
            refreshControl={
              <RefreshControl
                colors={[colors.primary]}
                tintColor={colors.primary}
                refreshing={refreshing}
                onRefresh={() => {}}
              />
            }
            scrollEventThrottle={1}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      y: scrollAnim,
                    },
                  },
                },
              ],
              {useNativeDriver: true},
            )}
            data={list}
            key={modeView}
            keyExtractor={(item, index) => item.id}
            renderItem={({item, index}) => {
              return <PostItem
                image={item.picture}
                title={item.title}
                name={item.user_id ? item.user_id.name : "-"}
                video={item.video}
                description={item.description}
                onPress={() => {}} />
            }}
          />
          <Animated.View
            style={[
              styles.navbar,
              {transform: [{translateY: navbarTranslate}]},
            ]}>
            <FilterSort
              onChangeSort={onChangeSort}
              onFilter={onFilter}
            />
          </Animated.View>
        </View>
      );
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title="Info"
        subTitle={subtitle}
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
      {islogin && <View style={{padding: 20}}>
          <Button onPress={() => navigation.navigate('InfoAdd')}>Add</Button>
      </View>}
      {renderContent()}
    </SafeAreaView>
  );
}
