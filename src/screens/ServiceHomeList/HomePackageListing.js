import React, {useState, useEffect} from 'react'
import {View,FlatList} from 'react-native';
import {Text,EventCard} from '@components';
import {BaseSetting} from '@config';
import {useSelector, useDispatch} from 'react-redux';
import {BookingActions} from '@actions';

export default function HomePackageListing(props) {
  const [list, setList] = useState([]);
  const dispatch = useDispatch();
  const {navigation} = props;
  //console.log("Package list", props);
  useEffect(() => {
      var post_data  = new FormData();
      post_data.append("limit", "4");
      const request = new Request(BaseSetting.REACT_APP_BASE_PATH+"PackageFilter" , {method: "POST", body: post_data});
      fetch(request).then(res => {
      res.json().then(json => {	
          setList(json);	            
        });
      }).catch(err => {
          console.log("Error in Get menu", err.message);
      });
  },[])
  handlerlisting = (ItemList) => {
    return <FlatList
               contentContainerStyle={{
                 paddingRight: 20,
                 paddingLeft: 5,
               }}
               horizontal={true}
               data={ItemList}
               showsHorizontalScrollIndicator={false}
               keyExtractor={(item, index) => item.id}
               renderItem={({item, index}) => {
                console.log("item", item);
                  var picture = item.attraction_picture ? item.attraction_picture.split(",")[0] : "upload/default.png";
                  picture = {uri : BaseSetting.REACT_APP_FILE_PATH+picture};
                  var param = {
                    id: item.id, 
                    picture: picture, 
                    title: item.title,
                    category: item.category,
                    username: item.departure_date.split("T")[0],
                    booked: item.booked,
                    remaining: item.business_seats + item.folding_seats - item.booked,
                    price: item.price,
                    item_list: item.fromcity.split(",").slice(0,4),
                    date: item.departure_date.split("T")[0],
                    address: item.city_name,
                    type : "package",
                    page : "home",
                    detail_info: item
                  }

                  return <EventCard param = {param}  
                  onPress={() => {
                    dispatch(BookingActions.onBOOKING_ITEM(param));
                    navigation.navigate('PackageDetail',{id: item.id});
                  }} style = {{marginLeft: 15}} /> 
               }}
     />     
   }

    return (
        <View>
          {handlerlisting(list) }
        </View>
    );
  
}


