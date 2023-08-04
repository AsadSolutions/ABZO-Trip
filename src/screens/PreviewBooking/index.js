import React, {useEffect, useState} from 'react';
import {View, ScrollView, FlatList, TouchableOpacity} from 'react-native';
import {BaseStyle, BaseColor, useTheme, BaseSetting} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  HotelItem,
  BookingTime,
  Tag,
  QuantityPicker,
  TextInput,
} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {useSelector, useDispatch} from 'react-redux';
import {BookingActions} from '@actions';
import DatePicker from 'react-native-date-picker';
var moment = require('moment');

export default function PreviewBooking({navigation}) {
  var today = new Date();
  today =
    today.getFullYear() +
    '-' +
    ('0' + (today.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + today.getDate()).slice(-2);

  const {t} = useTranslation();
  const {colors} = useTheme();
  let login_info = useSelector(state => state.auth);
  login_info = login_info.login.data;
  const booking_item = useSelector(state => state.booking.booking_item);
  var mypre_state = {};
  var myroom_list = [];
  if (booking_item.page == 'filter') {
    if (booking_item.type == 'ride') {
      mypre_state = useSelector(state => state.booking.ride_filter);
    } else if (booking_item.type == 'stay') {
      mypre_state = useSelector(state => state.booking.stay_filter);
    } else if (booking_item.type == 'guide') {
      mypre_state = useSelector(state => state.booking.guide_filter);
    } else if (booking_item.type == 'package') {
      mypre_state = useSelector(state => state.booking.package_filter);
    } else if (booking_item.type == 'pilgrim') {
      mypre_state = useSelector(state => state.booking.pilgrim_filter);
    }
  }
  console.log('Filter state preview ', mypre_state);
  if (booking_item.type == 'stay') {
    var total_title = 'ROOM';
    if (booking_item.detail_info.subcategory_id == 7) {
      total_title = 'BED';
    } else if (booking_item.detail_info.subcategory_id == 11) {
      total_title = 'CAMP';
    }
    myroom_list = booking_item.detail_info.rooms_list.map((val, index) => {
      let booking_title =
        index + 1 + ': Rs.' + val.price + ' ' + total_title + '-' + val.id;
      return {
        id: val.id,
        name: booking_title,
        price: val.price,
        checked: false,
        availability: val.availability,
      };
    });
  }
  //console.log("booking_item", booking_item);
  //console.log("login", login_info);
  const dispatch = useDispatch();
  const [pre_state] = useState(mypre_state);
  const [editable, setEditable] = useState(true);
  const [show_book, setShow_book] = useState(false);
  const [quantity, setQuantity] = useState(1);
  //Stay
  const [room_list, setRoom_list] = useState(myroom_list);
  //Package, Pilgrimage
  const [distance, setDistance] = useState(
    mypre_state ? mypre_state.distance : 0,
  );
  const [adult, setAdult] = useState(1);
  const [child, setChild] = useState(0);
  const [infant, setInfant] = useState(0);
  const [couple, setCouple] = useState(0);
  const [message, setMessage] = useState('');
  const [price, setPrice] = useState(booking_item.price);
  console.log('Preview Booking', booking_item, login_info);

  //Stay, Guide
  const [from_date, setFrom_date] = useState(today);
  const [open, setOpen] = useState(false);
  const [to_date, setTo_date] = useState(from_date);
  const calculate_price = () => {
    var myprice = 0;
    if (booking_item.type == 'ride' && booking_item.page == 'filter') {
      if (booking_item.detail_info.rent_type == 2) {
        myprice = booking_item.detail_info.price_day
          ? parseFloat(quantity * booking_item.detail_info.price_day)
          : 0;
        setTo_date(
          moment(from_date, 'YYYY-MM-DD')
            .add(quantity - 1, 'days')
            .format('YYYY-MM-DD'),
        );
      } else if (booking_item.detail_info.rent_type == 3) {
        myprice = booking_item.detail_info.price_seat
          ? quantity * parseFloat(booking_item.detail_info.price_seat)
          : 0;
      } else {
        if (distance <= 25) {
          myprice = booking_item.detail_info.price
            ? parseFloat(booking_item.detail_info.price)
            : 0;
        } else if (distance <= 50) {
          myprice = booking_item.detail_info.price_25_50_km
            ? parseFloat(booking_item.detail_info.price_25_50_km)
            : 0;
        } else {
          myprice =
            distance *
            (booking_item.detail_info.price_50_500_km
              ? parseFloat(booking_item.detail_info.price_50_500_km)
              : 0);
        }
      }
      myprice =
        quantity == 1 && booking_item.detail_info.one_way_discount > 0
          ? myprice -
            parseInt(
              (booking_item.detail_info.one_way_discount * myprice) / 100,
            )
          : myprice;
    } else if (booking_item.type == 'stay') {
      myroom_list = room_list.filter(record => record.checked);
      myprice = myroom_list.reduce(
        (sum, record) => sum + parseFloat(record.price),
        0,
      );
      myprice = myprice * quantity;
      setTo_date(
        moment(from_date, 'YYYY-MM-DD')
          .add(quantity - 1, 'days')
          .format('YYYY-MM-DD'),
      );
      setPrice(myprice);
    } else if (booking_item.type == 'guide') {
      myprice = parseFloat(booking_item.detail_info.price) * quantity;
      setTo_date(
        moment(from_date, 'YYYY-MM-DD')
          .add(quantity - 1, 'days')
          .format('YYYY-MM-DD'),
      );
    } else if (
      booking_item.type == 'package' ||
      booking_item.type == 'pilgrim'
    ) {
      setQuantity(adult + child + infant + 2 * couple);
      console.log('price', booking_item.detail_info);
      myprice =
        parseFloat(booking_item.detail_info.price) * adult +
        parseFloat(booking_item.detail_info.child_price) * child +
        parseFloat(booking_item.detail_info.infant_price) * infant +
        parseFloat(booking_item.detail_info.couple_price) * couple;
      console.log('preview price', myprice, booking_item.detail_info);
    }
    setPrice(myprice);
    setShow_book(false);
    return myprice;
  };
  useEffect(
    () => calculate_price(),
    [quantity, adult, child, infant, couple, room_list, from_date],
  );

  const CheckBooking = () => {
    var success_message = 'Congratulation! is available, you can book now!';
    console.log(
      'preview Booking Booked days already',
      booking_item.detail_info,
    );

    if (booking_item.type == 'ride') {
      var mydate = '';
      var booked_days = booking_item.detail_info.booked_days;

      var html_messsage = [];
      var loop = booking_item.detail_info.rent_type == 3 ? 1 : quantity;
      var date_array = booking_item.detail_info.date_list.map(
        (dateinfo, index) => {
          return dateinfo['date'].split('T')[0];
        },
      );
      if (booking_item.detail_info.rent_type == 3) {
        //per seats
        mydate = moment(from_date, 'YYYY-MM-DD').format('YYYY-MM-DD');
        let booked_seats = booked_days[mydate]
          ? booked_days[mydate].reduce((pre, val) => pre + parseInt(val), 0)
          : 0;
        if (
          booked_seats + parseInt(quantity) >
          parseInt(booking_item.detail_info.seats)
        ) {
          html_messsage.push(
            'Date: ' +
              mydate +
              ' out of total ' +
              booking_item.detail_info.seats +
              ' already booked ' +
              booked_seats +
              ', So only ' +
              (booking_item.detail_info.seats - booked_seats) +
              ' seats are available',
          );
        }
      } else {
        for (var i = 0; i < loop; i++) {
          mydate = moment(from_date, 'YYYY-MM-DD')
            .add(i, 'days')
            .format('YYYY-MM-DD');
          if (!date_array.includes(mydate)) {
            html_messsage.push('Date: ' + mydate + ' is not avaible');
          } else if (booked_days[mydate]) {
            //per km or days
            html_messsage.push('Date: ' + mydate + ' is already booked');
          }
        }
      }
      if (html_messsage.length > 0) {
        setShow_book(false);
        setMessage(html_messsage.join(','));
      } else {
        setShow_book(true);
        setMessage(success_message);
      }
    } else if (booking_item.type == 'stay') {
      myroom_list = room_list.filter(record => record.checked);
      if (myroom_list.length == 0) {
        setShow_book(true);
        setMessage('You need to select atleast one room!');
        return;
      }
      var date = '';
      var booked_days = booking_item.detail_info.booked_days;
      var html_messsage = [];
      for (var i = 0; i < quantity; i++) {
        date = moment(from_date, 'YYYY-MM-DD')
          .add(i, 'days')
          .format('YYYY-MM-DD');
        myroom_list.map((record, index) => {
          var date_array = record.availability
            ? record.availability.split(',')
            : [];
          var booking_title = record.name;
          var booked_rooms = booked_days[date] ? booked_days[date] : [];
          booked_rooms = booked_rooms.filter(val => booking_title == val);
          console.log(
            'checking map booking',
            date,
            booking_title,
            booked_rooms,
            booked_days[date],
          );
          if (!date_array.includes(date)) {
            html_messsage.push('Date: ' + date + ' is not avaible');
          } else if (booked_rooms.length > 0) {
            html_messsage.push(
              'Date: ' + date + ' is already booked for room#' + index + 1,
            );
          }
        });
      }
      if (html_messsage.length > 0) {
        setShow_book(false);
        setMessage(html_messsage.join(','));
      } else {
        setShow_book(true);
        setMessage(success_message);
      }
    } else if (booking_item.type == 'guide') {
      var mydate = '';
      var booked_days = booking_item.detail_info.booked_days;
      var html_messsage = [];
      var date_array = booking_item.detail_info.date_list.map(
        (dateinfo, index) => {
          return dateinfo['date'].split('T')[0];
        },
      );

      for (var i = 0; i < quantity; i++) {
        mydate = moment(from_date, 'YYYY-MM-DD')
          .add(i, 'days')
          .format('YYYY-MM-DD');
        //console.log("New Qnty: ",mydate,quantity);
        if (!date_array.includes(mydate)) {
          html_messsage.push('Date: ' + mydate + ' is not avaible');
        } else if (mydate in booked_days) {
          html_messsage.push('Date: ' + mydate + ' is already booked');
        }
      }
      if (html_messsage.length > 0) {
        setShow_book(false);
        setMessage(html_messsage.join(','));
      } else {
        setShow_book(true);
        setMessage(success_message);
      }
    } else if (booking_item.type == 'package') {
      console.warn(
        'Check booking is called',
        quantity,
        booking_item.detail_info.available_seats,
        booking_item,
      );
      if (quantity <= booking_item.detail_info.available_seats) {
        setShow_book(true);
        setMessage(success_message);
      } else {
        setShow_book(false);
        setMessage(
          `Required number of seats ${quantity} are not available, Total available ${booking_item.detail_info.available_seats}!`,
        );
      }
    } else if (booking_item.type == 'pilgrim') {
      setShow_book(true);
      setMessage(success_message);
    }
  };

  const onSelectRoom_list = select => {
    setRoom_list(
      room_list.map(item => {
        if (item.name == select.name) {
          return {
            ...item,
            checked: item.checked ? false : true,
          };
        } else {
          return item;
        }
      }),
    );
  };
  const SubmitBooking = booking_id => {
    myroom_list = room_list.filter(record => record.checked);
    myroom_list = room_list.map((record, index) => record.name);
    const detail_booking = {
      price: calculate_price(),
      quantity: quantity,
      number: myroom_list.join(','),
      booking_id: booking_id,
      adult: adult,
      child: child,
      infant: infant,
      couple: couple,
      from_date: from_date,
      to_date: to_date,
    };
    console.warn('Process Booking', detail_booking);
    booking_item.detail_booking = detail_booking;
    dispatch(BookingActions.onBOOKING_ITEM(booking_item));
    navigation.navigate('CheckOut', {booking_id: booking_id});
  };
  const ProcessBooking = () => {
    var post_data = new FormData();
    //post_data.append("subcategory_id", booking_item.detail_info.subcategory_id);
    post_data.append('subcategory_id', booking_item.detail_info.id);
    post_data.append('status', 'pending');
    post_data.append('user_id', login_info.id);
    post_data.append('currency_id', 1);
    if (booking_item.type == 'guide') {
      post_data.append('city', pre_state.city);
      post_data.append('country', pre_state.country);
      post_data.append('src_address', pre_state.address);
      post_data.append('src_latitude', pre_state.latitude);
      post_data.append('src_longitude', pre_state.longitude);

      post_data.append('quantity', quantity);
      post_data.append('dest_address', '');
      post_data.append('dest_latitude', '');
      post_data.append('dest_longitude', '');
      post_data.append('service_id', 3);
      post_data.append('total', price);
      post_data.append('date_from', from_date);
      post_data.append('date_to', to_date);
    } else if (booking_item.type == 'ride') {
      post_data.append('city', pre_state.from_city);
      post_data.append('country', pre_state.from_country);
      post_data.append('src_address', pre_state.ride_from);
      post_data.append('src_latitude', pre_state.from_lat);
      post_data.append('src_longitude', pre_state.from_lng);
      post_data.append('dest_address', pre_state.ride_to);
      post_data.append('dest_latitude', pre_state.to_lat);
      post_data.append('dest_longitude', pre_state.to_lng);
      post_data.append('type', booking_item.detail_info.rent_type);

      post_data.append('service_id', 1);
      post_data.append('total', price);
      post_data.append('date_from', from_date);
      post_data.append('date_to', to_date);
      post_data.append('two_way', quantity);
      post_data.append('quantity', quantity);
      post_data.append('number', quantity);
    } else if (booking_item.type == 'stay') {
      myroom_list = room_list
        .filter(record => record.checked)
        .map((record, index) => record.name);
      post_data.append('country', pre_state.country);
      post_data.append('city', pre_state.city_name);
      post_data.append('src_address', pre_state.address);
      post_data.append('src_latitude', pre_state.latitude);
      post_data.append('src_longitude', pre_state.longitude);
      post_data.append('dest_address', '');
      post_data.append('dest_latitude', '');
      post_data.append('dest_longitude', '');
      post_data.append('service_id', 2);
      post_data.append('total', price);

      post_data.append('date_from', from_date);
      post_data.append('date_to', to_date);
      post_data.append('quantity', quantity);
      post_data.append('adult', adult);
      post_data.append('child', child);
      post_data.append('number', myroom_list.join(','));
    } else if (
      booking_item.type == 'package' ||
      booking_item.type == 'pilgrim'
    ) {
      post_data.append('quantity', quantity);
      post_data.append('city', pre_state ? pre_state.city : '');
      post_data.append('country', pre_state ? pre_state.country : '');
      post_data.append('src_address', pre_state ? pre_state.address : '');
      post_data.append('src_latitude', '');
      post_data.append('src_longitude', '');
      post_data.append('dest_address', pre_state ? pre_state.tocity : '');
      post_data.append('dest_latitude', '');
      post_data.append('dest_longitude', '');
      post_data.append('service_id', booking_item.type == 'package' ? 4 : 5);

      post_data.append('total', price);
      post_data.append('date_from', from_date);
      post_data.append('date_to', to_date);
      post_data.append('adult', adult);
      post_data.append('child', child);
      post_data.append('infant', infant);
      post_data.append('couple', couple);
    }
    const request = new Request(
      BaseSetting.REACT_APP_BASE_PATH + 'UpsertBooking',
      {method: 'POST', body: post_data},
    );
    fetch(request)
      .then(res => {
        res.json().then(json => {
          SubmitBooking(json.id);
        });
      })
      .catch(err => {
        this.setMessage(err.message);
      });
  };

  const booking_form = () => {
    var booking_element = <Text>...</Text>;
    if (booking_item.type == 'ride') {
      let quantity_input = <Text>...</Text>;
      let to_date_input = <Text>...</Text>;
      if (booking_item.detail_info.rent_type == 1) {
        //per KM
        quantity_input = (
          <View style={styles.flightType}>
            <Text caption1 semibold grayColor>
              {distance} KM
            </Text>
            <Tag
              outline={quantity == 2 ? false : true}
              primary={quantity == 2 ? true : false}
              round
              onPress={() => setQuantity(2)}
              style={{marginHorizontal: 20}}>
              {t('round_trip')}
            </Tag>
            <Tag
              outline={quantity == 1 ? false : true}
              primary={quantity == 1 ? true : false}
              round
              onPress={() => setQuantity(1)}>
              {t('one_way')}
            </Tag>
          </View>
        );
      } else if (booking_item.detail_info.rent_type == 2) {
        //per Day
        quantity_input = (
          <QuantityPicker
            editable={editable}
            label="Days"
            value={quantity}
            onChange={val => {
              setQuantity(val);
            }}
          />
        );
        to_date_input = (
          // <TouchableOpacity
          //   style={{
          //     backgroundColor: '#FDC60A',
          //     paddingVertical: 12,
          //     paddingHorizontal: 24,
          //     borderRadius: 8,
          //     alignItems: 'center',
          //     width: 150,
          //     height: 50,
          //   }}
          //   onPress={() => setOpen(true)}>
          //   <Text style={{color: 'white', fontSize: 16}}>Select Date</Text>
          // </TouchableOpacity>
          <DatePicker
            modal
            open={open}
            // date={date}
            date={new Date()}
            mode="date"
            minimumDate={today}
            onConfirm={date => {
              setOpen(false);
              setTo_date(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
          // <DatePicker
          //   editable={false}
          //   date={to_date} // Initial date from state
          //   mode="date" // The enum of date, datetime and time
          //   placeholder="To Date"
          //   format="YYYY-MM-DD"
          //   confirmBtnText="Confirm"
          //   cancelBtnText="Cancel"
          //   style={{marginTop: 10}}
          //   customStyles={{
          //     dateIcon: {
          //       //display: 'none',
          //       marginTop: 10,
          //       position: 'absolute',
          //       left: 0,
          //       top: 4,
          //       marginLeft: 0,
          //     },
          //     dateInput: {
          //       marginTop: 20,
          //       marginLeft: 36,
          //     },
          //   }}
          //   onDateChange={date => {
          //     setTo_date(date);
          //   }}
          // />
        );
      } else if (booking_item.detail_info.rent_type == 3) {
        //per seat
        quantity_input = (
          <QuantityPicker
            editable={editable}
            label="Seats"
            value={quantity}
            onChange={val => {
              setQuantity(val);
            }}
          />
        );
      }
      booking_element = (
        <View>
          {quantity_input}
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
            // date={date}
            date={new Date()}
            mode="date"
            minimumDate={today}
            onConfirm={date => {
              setOpen(false);
              setFrom_date(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
          {/* <DatePicker
            editable={false}
            date={from_date} // Initial date from state
            mode="date" // The enum of date, datetime and time
            placeholder={
              booking_item.detail_info.rent_type == 2 ? 'From Date' : 'Date'
            }
            minDate={today}
            format="YYYY-MM-DD"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            style={{marginTop: 10}}
            customStyles={{
              dateIcon: {
                //display: 'none',
                marginTop: 10,
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                marginTop: 20,
                marginLeft: 36,
              },
            }}
            onDateChange={date => {
              setFrom_date(date);
            }}
          /> */}
          {to_date_input}
        </View>
      );
    } else if (booking_item.type == 'stay') {
      booking_element = (
        <View>
          <View style={styles.contentRow}>
            <FlatList
              contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={room_list}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <Tag
                  style={{marginLeft: 15, marginTop: 10, marginBottom: 10}}
                  outline={!item.checked}
                  primary={item.checked}
                  onPress={() => onSelectRoom_list(item)}>
                  {item.name}
                </Tag>
              )}
            />
          </View>
          <QuantityPicker
            editable={editable}
            label="Days"
            value={quantity}
            onChange={val => {
              setQuantity(val);
            }}
          />
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
            // date={date}
            date={new Date()}
            mode="date"
            minimumDate={today}
            onConfirm={date => {
              setOpen(false);
              setFrom_date(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
          {/* <DatePicker
            editable={false}
            date={from_date} // Initial date from state
            mode="date" // The enum of date, datetime and time
            minDate={today}
            placeholder="From Date"
            format="YYYY-MM-DD"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            style={{marginTop: 10}}
            customStyles={{
              dateIcon: {
                //display: 'none',
                marginTop: 10,
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                marginTop: 20,
                marginLeft: 36,
              },
            }}
            onDateChange={date => {
              setFrom_date(date);
              setTo_date(
                moment(date, 'YYYY-MM-DD')
                  .add(quantity, 'days')
                  .format('YYYY-MM-DD'),
              );
            }}
          /> */}
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
            // date={date}
            date={new Date()}
            mode="date"
            minimumDate={today}
            onConfirm={date => {
              setOpen(false);
              setTo_date(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
          {/* <DatePicker
            editable={false}
            date={to_date} // Initial date from state
            mode="date" // The enum of date, datetime and time
            placeholder="To Date"
            format="YYYY-MM-DD"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            style={{marginTop: 10}}
            customStyles={{
              dateIcon: {
                //display: 'none',
                marginTop: 10,
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                marginTop: 20,
                marginLeft: 36,
              },
            }}
            onDateChange={date => {
              setTo_date(date);
            }}
          /> */}
          <View style={{marginTop: 20, flexDirection: 'row'}}>
            <QuantityPicker
              editable={editable}
              label={t('adults')}
              value={adult}
              onChange={val => {
                setAdult(val);
              }}
            />
            <QuantityPicker
              editable={editable}
              label={'children (Age 4-9 Year)'}
              value={child}
              style={{marginHorizontal: 15}}
              onChange={val => {
                setChild(val);
              }}
            />
          </View>
        </View>
      );
    } else if (booking_item.type == 'guide') {
      booking_element = (
        <View>
          <QuantityPicker
            editable={editable}
            label="Days"
            value={quantity}
            onChange={val => {
              setQuantity(val);
            }}
          />
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
            // date={date}
            date={new Date()}
            mode="date"
            minimumDate={today}
            onConfirm={date => {
              setOpen(false);
              setFrom_date(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
          {/* <DatePicker
            editable={false}
            date={from_date} // Initial date from state
            mode="date" // The enum of date, datetime and time
            minDate={today}
            placeholder="From Date"
            format="YYYY-MM-DD"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            style={{marginTop: 10}}
            customStyles={{
              dateIcon: {
                //display: 'none',
                marginTop: 10,
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                marginTop: 20,
                marginLeft: 36,
              },
            }}
            onDateChange={date => {
              setFrom_date(date);
              setTo_date(
                moment(date, 'YYYY-MM-DD')
                  .add(quantity, 'days')
                  .format('YYYY-MM-DD'),
              );
            }}
          /> */}
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
            // date={date}
            date={new Date()}
            mode="date"
            minimumDate={today}
            onConfirm={date => {
              setOpen(false);
              setTo_date(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
          {/* <DatePicker
            editable={false}
            date={to_date} // Initial date from state
            mode="date" // The enum of date, datetime and time
            placeholder="To Date"
            format="YYYY-MM-DD"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            style={{marginTop: 10}}
            customStyles={{
              dateIcon: {
                //display: 'none',
                marginTop: 10,
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                marginTop: 20,
                marginLeft: 36,
              },
            }}
            onDateChange={date => {
              setTo_date(date);
            }}
          /> */}
        </View>
      );
    } else if (
      booking_item.type == 'package' ||
      booking_item.type == 'pilgrim'
    ) {
      booking_element = (
        <View>
          <View style={{marginTop: 20, flexDirection: 'row'}}>
            <QuantityPicker
              editable={editable}
              label={t('adults')}
              value={adult}
              onChange={val => {
                setAdult(val);
              }}
            />
            <QuantityPicker
              editable={editable}
              label={'children (4-9 Year)'}
              value={child}
              style={{marginHorizontal: 15}}
              onChange={val => {
                setChild(val);
              }}
            />
          </View>

          <View style={{marginTop: 20, flexDirection: 'row'}}>
            <QuantityPicker
              editable={editable}
              label="Infant (1-4 Year)"
              value={infant}
              onChange={val => {
                setInfant(val);
              }}
            />
            <QuantityPicker
              editable={editable}
              label="Couple"
              value={couple}
              style={{marginHorizontal: 15}}
              onChange={val => {
                setCouple(val);
              }}
            />
          </View>
        </View>
      );
    }
    //console.warn("render", booking_element);
    return booking_element;
  };
  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={t('preview_booking')}
        subTitle="..."
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
      <ScrollView>
        <View style={{paddingHorizontal: 20}}>
          <Text caption1 semibold grayColor>
            {message}
          </Text>
          <View style={[styles.blockView, {borderBottomColor: colors.border}]}>
            <HotelItem
              param={booking_item}
              style={{marginBottom: 15, marginLeft: 10, marginRight: 10}}
              list={true}
              onPress={() => {}}
            />
          </View>
          <View style={{paddingVertical: 10}}>{booking_form()}</View>
        </View>
      </ScrollView>
      <View
        style={[styles.contentButtonBottom, {borderTopColor: colors.border}]}>
        <View>
          <Text caption1 semibold grayColor>
            Price
          </Text>
          <Text title3 primaryColor semibold>
            {price}
          </Text>
          <Text caption1 semibold grayColor style={{marginTop: 5}}>
            PKR
          </Text>
        </View>
        {!show_book && price > 0 && (
          <Button onPress={() => CheckBooking()}>Check Booking</Button>
        )}
        {show_book && (
          <Button onPress={() => ProcessBooking()}>Confirm Booking</Button>
        )}
      </View>
    </SafeAreaView>
  );
}
