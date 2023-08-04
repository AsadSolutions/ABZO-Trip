import React from 'react';
import {View, TouchableOpacity, FlatList} from 'react-native';
import {Image, Text, Icon, StarRating, Tag} from '@components';
import {BaseColor, useTheme} from '@config';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import styles from './styles';
export default function HotelItem(props) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const {
    param,
    block,
    grid,
    style,
    onPress,
    onPressTag
  } = props;

  var description = param.description;
  //if(param.type == "ride" || param.type == "guide" || param.type == "stay"){
      //description = <Text caption1 semibold> Booked: {param.booked} , Available:  {param.remaining}</Text>
  //} 
// console.log("image",param.picture);
  /**
   * Display hotel item as block
   */
  const renderBlock = () => {

    return (
      <View style={style}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
          <Image source={param.picture} style={styles.blockImage} />
        </TouchableOpacity>
        <View style={{paddingHorizontal: 20}}>
          <Text title2 semibold style={{marginTop: 5}} numberOfLines={1}>
            {param.title} 
          </Text>
          <View style={styles.blockContentAddress}>
            <Icon name="map-marker-alt" color={colors.primaryLight} size={10} />
            <Text
              caption1
              grayColor
              style={{
                marginLeft: 3,
              }}
              numberOfLines={1}>
              {param.address}
            </Text>
          </View>
          <View style={styles.blockContentDetail}>
            <View style={{flex: 1}}>
              <Text caption1 primaryColor semibold>
                {param.price}
              </Text>
              <Text
                caption1
                accentColor
                style={{
                  marginTop: 3,
                }}
                numberOfLines={1}>
                {description}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'column',
              }}>
            
                <Text caption1 semibold style={{paddingBottom: 5}}>
                  {param.category}
                </Text>

                <Text caption1 semibold primaryColor style={{paddingBottom: 5}}>
                  {param.username}
                </Text>
                
            </View>
          </View>
        </View>
        <View style={styles.contentService}>
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={param.item_list}
            keyExtractor={(item, index) => item.id}
            renderItem={({item, index}) => (
              <View style={styles.serviceItemBlock} key={'block' + index}>
                <Text
                  overline
                  grayColor
                  style={{marginTop: 4}}
                  numberOfLines={1}>
                  {item}
                </Text>
              </View>
            )}
          />
          <TouchableOpacity
            style={{
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingHorizontal: 12,
            }}>
            <Icon name="angle-right" size={16} color={BaseColor.dividerColor} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  /**
   * Display hotel item as list
   */
  const renderList = () => {
    return (
      <View style={[styles.listContent, style]}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
          <Image source={param.picture} style={styles.listImage} />
        </TouchableOpacity>
        <View style={styles.listContentRight}>
          <Text headline semibold numberOfLines={1}>
            {param.title}
          </Text>
          <View style={styles.listContentRow}>
            <Icon name="map-marker-alt" color={colors.primaryLight} size={10} />
            <Text
              caption1
              grayColor
              style={{
                marginLeft: 3,
              }}
              numberOfLines={1}>
              {param.address}
            </Text>
          </View>
          <View style={styles.girdContentRate}>
              <Text caption1 semibold style={{paddingBottom: 5}}>
                  {param.username}
              </Text>
              <Text caption1 primaryColor semibold style={{paddingBottom: 5}}>
                {param.category}
              </Text>
          </View>
          <Text
            caption1
            primaryColor
            semibold
            style={{marginTop: 5, marginBottom: 5}}>
            {param.price}
          </Text>
          <Text
            caption1
            accentColor
            style={{
              marginTop: 3,
            }}
            numberOfLines={1}>
            {description}
          </Text>
        </View>
      </View>
    );
  };

  /**
   * Display hotel item as grid
   */
  const renderGrid = () => {
    return (
      <View style={[styles.girdContent, style]}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
          <Image source={param.picture} style={styles.girdImage} />
        </TouchableOpacity>
        <View style={styles.girdContentLocation}>
          <Icon name="map-marker-alt" color={colors.primary} size={10} />
          <Text
            caption2
            grayColor
            style={{
              marginHorizontal: 5,
            }}
            numberOfLines={1}>
            {param.address}
          </Text>
        </View>
        <Text
          body2
          semibold
          style={{
            marginTop: 5,
          }}>
          {param.title}
        </Text>
        <View style={styles.girdContentRate}>
          <Text caption1  semibold style={{paddingBottom: 5}}>
            {param.username}
          </Text>
          <Text caption2 primaryColor semibold style={{paddingBottom: 5}}>
          {param.category}
          </Text>
        </View>
        <Text
          caption1
          primaryColor
          semibold
          style={{
            marginTop: 5,
          }}>
          {param.price}
        </Text>
      </View>
    );
  };

  if (grid) return renderGrid();
  else if (block) return renderBlock();
  else return renderList();
}

HotelItem.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  list: PropTypes.bool,
  block: PropTypes.bool,
  grid: PropTypes.bool,  
  param: PropTypes.array,
  onPress: PropTypes.func,
  onPressTag: PropTypes.func,
};

HotelItem.defaultProps = {
  style: {},
  image: '',
  list: true,
  block: false,
  grid: false,
  param: [],
  onPress: () => {},
  onPressTag: () => {},
};
