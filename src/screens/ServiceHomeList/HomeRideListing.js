import React, {useState, useEffect} from 'react';
import {View, FlatList} from 'react-native';
import {Text, EventCard} from '@components';
import {BaseSetting} from '@config';
import {useSelector, useDispatch} from 'react-redux';
import {BookingActions} from '@actions';

export default function HomeRideListing(props) {
  const [list, setList] = useState([]);
  const dispatch = useDispatch();
  const {navigation} = props;
  //console.log("Package list", props);
  useEffect(() => {
    console.log('Ride home listing');
    var post_data = new FormData();
    post_data.append('limit', '4');
    const request = new Request(
      BaseSetting.REACT_APP_BASE_PATH + 'RideFilter',
      {method: 'POST', body: post_data},
    );
    fetch(request)
      .then(res => {
        res.json().then(json => {
          setList(json);
        });
      })
      .catch(err => {
        console.log('Error in Get menu', err.message);
      });
  }, []);

  handlerlisting = ItemList => {
    return (
      <FlatList
        contentContainerStyle={{
          paddingRight: 20,
          paddingLeft: 5,
        }}
        horizontal={true}
        data={ItemList}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => item.id}
        renderItem={({item, index}) => {
          var picture = item.picture
            ? item.picture.split(',')[0]
            : 'upload/default.png';
          picture = {uri: BaseSetting.REACT_APP_FILE_PATH + picture};
          var remaining = item.seats - item.booked;
          var rent_price = '';
          if (item.rent_type == 1) {
            //KM
            rent_price = (
              <View>
                <Text>From 0-25/KM: {item.price}</Text>
                <Text>From 25-50/KM: {item.price_25_50_km}</Text>
                <Text>From 50_500/KM: {item.price_50_500_km}</Text>
              </View>
            );
          } else if (item.rent_type == 3) {
            //Seat
            rent_price = item.price_seat + '/Seat';
          } else {
            //day
            rent_price = item.price_day + '/Day';
          }

          var param = {
            id: item.id,
            picture: picture,
            title: item.title,
            category: item.category,
            price: rent_price,
            username: item.user_name,
            address: item.address,
            booked: item.booked,
            remaining: remaining,
            type: 'ride',
            page: 'home',
            rating: 3,
            detail_info: item,
          };
          return (
            <EventCard
              param={param}
              onPress={() => {
                dispatch(BookingActions.onBOOKING_ITEM(param));
                navigation.navigate('RideDetail', {id: item.id});
              }}
              style={{marginLeft: 15}}
            />
          );
        }}
      />
    );
  };

  return <View>{handlerlisting(list)}</View>;
}
