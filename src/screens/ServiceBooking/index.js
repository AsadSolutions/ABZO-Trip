import React, {useState,useEffect} from 'react';
import {FlatList, RefreshControl,ScrollView, View,TouchableOpacity} from 'react-native';
import {BaseStyle, useTheme,BaseSetting} from '@config';
import {Header, SafeAreaView, Text, Icon} from '@components';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import styles from './styles';

export default function ServiceBooking(props) {
  const {navigation, route} = props; 
  const auth = useSelector(state => state.auth);
  const logininfo = auth.login.data;

  const {t} = useTranslation();
  const {colors} = useTheme();

  const [refreshing] = useState(false);
  const [user_id] = useState(logininfo.id);
  const [id] = useState(route.params ? route.params.id : 1);
  var mytitle = "";
  var widthArr = [];
  var mydata_collumn = []
  if(id == 1){
    mytitle = "Ride";
    widthArr = [
      40, 60, 60, 80, 100, 200, 
      40, 100, 100,100,100,100,
      40,80,80,120,120
    ];
    mydata_collumn = [
      'ID','Total','Paid','Method', 'Status', 'Remaining',
      'Number', 'Title', 'Category','Name','Email','Mobile',
      'Two Way','From Date', 'To Date', 'Source', 'Destination'
    ];
  } else if(id == 2){
    mytitle = "Stay";
    widthArr = [
      40, 60, 60, 80, 100, 200, 
      40, 100, 100,100,100,100,
      100,100,80,80,40,120
    ];
    mydata_collumn = [
        'ID','Total','Paid','Method', 'Status', 'Remaining',
        'Number','Adult','Kids', 'Title', 'Category','Name',
        'Email','Mobile','From Date', 'To Date','Days', 'Source'
    ];
  } else if(id == 3){
    mytitle = "Guide";
    widthArr = [
      40, 60, 60, 80, 100, 200, 
      40, 100, 100,100,100,100,
      80,80,120
    ];
    mydata_collumn = [
        'ID','Total','Paid','Method', 'Status', 'Remaining',
        'Days', 'Title', 'Category','Name','Email','Mobile',
        'From Date', 'To Date', 'Source'
    ];
  } else if(id == 4){
    mytitle = "Package";
    widthArr = [
      40, 60, 60, 80, 100, 200, 
      40, 40, 40,40,100,100,
      100,100,100,80,80,120
    ];
    mydata_collumn = [
        'ID','Total','Paid','Method', 'Status', 'Remaining',
        'Adult','Child','Kids','Couple', 'Title','Category',
        'Name','Email','Mobile','From Date', 'To Date', 'Departure'
    ];
  } else if(id == 5){
    mytitle = "Pilgrim";
    widthArr = [
      40, 60, 60, 80, 100, 200, 
      40, 40, 40,40,100,100,
      100,100,100,80,80,120
    ];
    mydata_collumn = [
        'ID','Total','Paid','Method', 'Status', 'Remaining',
        'Adult','Child','Kids','Couple', 'Title','Category',
        'Name','Email','Mobile','From Date', 'To Date', 'Departure'
    ];
  }
  const [title] = useState(mytitle);
  const [width_array] = useState(widthArr);
  const [booking_list, setBooking_list] = useState([]);
  const [data_collumn, setData_collumn] = useState(mydata_collumn);

  const getinfo = (id) => {
    const request = new Request(BaseSetting.REACT_APP_BASE_PATH+"MyBooking?user_id="+user_id+"&category_id="+id, {method: "GET"});
    console.log("getinfo", id, request);
    fetch(request).then(res => {
      res.json().then(obj => {
        console.log("about content",id,obj);
        //obj = obj.filter((item,index) => item.payment_status != "unpaid");
        setBooking_list(obj);
      });
    }).catch(err => {
      console.log("Error in Get menu", err);
    });
  };
  useEffect(() => {
    getinfo(id);
  },[]);

  const elementButton = (item) => {
    let remaining = parseInt(item.total) - parseInt(item.paid);
    return remaining > 0 ? <TouchableOpacity onPress={() => checkout(item.id)}>
      <View style={{height: 18, marginLeft: 2,marginRight:2, backgroundColor: '#c8e1ff', borderRadius: 1 }}>
        <Text style={{textAlign: 'center'}}>PAY {remaining}</Text>
      </View>
    </TouchableOpacity> : <Text>-</Text>;
  };

  const checkout = (booking_id) => {
    navigation.navigate('CheckOut',{booking_id: booking_id});
  }

  /**
   * render Item
   *
   * @param {*} item
   * @returns
   */
  
  const renderItem = (product, index) => {
    if(id == 1){
      let title = product.rent_type == 1 ? "KM" : (product.rent_type == 2 ? "Day" : "Seat");
      return (
        <Row key={index} widthArr={width_array} data={[
            product.id, product.total,product.paid,product.method, product.payment_status, elementButton(product),
            product.quantity+' '+title, product.service, product.category, product.user_name, product.user_email, product.user_mobile,
            product.two_way == 2 ? 'YES':'NO',product.date_from, product.date_to,product.src_address, product.dest_address
        ]} textStyle={styles.text} style={[styles.row, index%2 && {backgroundColor: '#F7F6E7'}]} />
      );
    } else if(id == 2){
      return (
        <Row key={index} widthArr={width_array} data={[
              product.id, product.total,product.paid,product.method, product.payment_status, elementButton(product),
              product.number,product.adult,product.child, product.service, product.category, product.user_name,
              product.user_email, product.user_mobile,product.date_from, product.date_to,product.quantity,product.src_address
          ]} textStyle={styles.text} style={[styles.row, index%2 && {backgroundColor: '#F7F6E7'}]} />
      );
    } else if(id == 3){
      return (
        <Row key={index} widthArr={width_array} data={[
              product.id, product.total,product.paid,product.method, product.payment_status, elementButton(product),
              product.quantity, product.service, product.category, product.user_name, product.user_email, product.user_mobile,
              product.date_from, product.date_to,product.src_address
          ]} textStyle={styles.text} style={[styles.row, index%2 && {backgroundColor: '#F7F6E7'}]} />
      );
    } else if(id == 4 || id == 5){
      return (
        <Row key={index} widthArr={width_array} data={[
              product.id, product.total,product.paid,product.method, product.payment_status, elementButton(product),
              product.adult,product.child,product.infant,product.couple, product.service, product.category, 
              product.user_name,product.user_email, product.user_mobile,product.date_from, product.date_to,product.src_address
        ]} textStyle={styles.text} style={[styles.row, index%2 && {backgroundColor: '#F7F6E7'}]} />
      );
    }
  };

  /**
   * @description Loading booking item history one by one
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   * @returns
   */
  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={title+" Booking History"}
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
          //navigation.goBack();
          navigation.navigate("Home");
        }}
      />
      <ScrollView horizontal={true}>
          <View>
            <ScrollView >
              <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                <Row key={-1} widthArr={width_array} data={data_collumn} style={styles.head} textStyle={styles.text}/>
                {
                  booking_list.map((item, index) => {
                    return renderItem(item, index)
                  })
                }
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
    </SafeAreaView>
  );
}
