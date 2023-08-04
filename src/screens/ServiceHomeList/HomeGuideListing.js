import React,{useState, useEffect} from 'react'
import {View,FlatList} from 'react-native';
import {Text,EventCard} from '@components';
import {BaseSetting} from '@config';
import {useSelector, useDispatch} from 'react-redux';
import {BookingActions} from '@actions';

export default function HomeGuideListing(props) {
  const [list, setList] = useState([]);
  const dispatch = useDispatch();
  const {navigation} = props;
  //console.log("Package list", props);
  useEffect(() => {
    console.log("Guide home listing");
      var post_data  = new FormData();
      post_data.append("limit", "4");
      const request = new Request(BaseSetting.REACT_APP_BASE_PATH+"GuideFilter" , {method: "POST", body: post_data});
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
                 var picture = item.picture ? item.picture.split(",")[0] : "upload/default.png";
                 picture = {uri : BaseSetting.REACT_APP_FILE_PATH+picture};
                 var param = {
                    id: item.id, 
                    picture: picture, 
                    title: item.category,
                    category: item.category,
                    price: item.price,
                    username: item.user_name,
                    item_list: item.city.split(",").slice(0,4),
                    booked: item.booked > 0 ? "YES" : "NO",
                    remaining: item.booked > 0 ? "NO" : "YES",
                    rating: 3,
                    type : "guide",
                    page : "home",
                    detail_info: item
                  }
                 return <EventCard param = {param}  
                 onPress={() => {
                    dispatch(BookingActions.onBOOKING_ITEM(param));
                    navigation.navigate('GuideDetail',{id: item.id});
                  }} style = {{marginLeft: 15}} /> 
               }}
     />     
   }
  return (
      <View>
        {handlerlisting(list)}
      </View>
  );
}

