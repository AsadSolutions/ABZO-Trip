import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import styles from './styles';
import PropTypes from 'prop-types';
import {Image, Text} from '@components';
import {Images, useTheme} from '@config';

export default function EventCard(props) {
  const {colors} = useTheme();
  const {style, onPress} = props;
  //console.log("props event log ", props);
  var {title, picture,category,username,price} = props.param;
  //if(props.param.type == "ride" || props.param.type == "stay" || props.param.type == "guide"){
      description = <View>
                      <Text>Booked: {props.param.booked} </Text> 
                      <Text>Available: {props.param.remaining} </Text>
                    </View>;
  //}
  return (
    <TouchableOpacity
      style={[styles.content, {borderColor: colors.border}, style]}
      onPress={onPress}
      activeOpacity={0.9}>
      <Image source={picture} style={styles.imageBanner} />
      <View
        style={{
          padding: 10,
          flexDirection: 'row',
        }}>
        <View style={{alignItems: 'center', marginRight: 10}}>
          <Text body2 primaryColor semibold>
            {price}
          </Text>
          <Text body1 grayColor semibold>
            PKR
          </Text>
          <Text overline secondaryColor semibold>
            {category} 
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'flex-start'}}>
          <Text body2 semibold numberOfLines={1} style={{flex: 1}}>
            {title}
          </Text>
          <Text overline grayColor style={{marginVertical: 5}}>
           {username}
          </Text>
          <Text overline grayColor>
            {description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

EventCard.propTypes = {
  image: PropTypes.node.isRequired,
  title: PropTypes.string,
  time: PropTypes.string,
  location: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func,
};

EventCard.defaultProps = {
  picture: Images.profile2,
  title: 'BBC Music Introducing',
  style: {},
  onPress: () => {},
};
