import React from "react";
import { View, TouchableOpacity } from "react-native";
import YouTube from 'react-native-youtube-iframe';
import { Image, Text, Icon } from "@components";
import HTMLView from 'react-native-htmlview';
import { WebView } from 'react-native-webview';
import styles from "./styles";
import PropTypes from "prop-types";
import { BaseColor, useTheme,BaseSetting } from "@config";
export default function PostItem(props) {
  const {navigation} = props;
  const { colors } = useTheme();
  const { style, children, title, description, onPress, image, name, video } = props;
  var picture = image ? image.split(",")[0]: "upload/default.png";
  picture = {uri: BaseSetting.REACT_APP_BASE_PATH + picture};
  var videoid = video;
  var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = videoid.match(regExp);
  videoid = (match && match[2].length == 11) ? match[2] : false;
  
  var video_element = videoid && videoid != "" ?  <YouTube
                      apiKey={BaseSetting.REACT_APP_YOUTUBE_KEY} 
                      height={300}
                      play={false}
                      videoId={videoid}
                    /> : <Text>.</Text>;

  return (
    <View style={style}>
      {children}
      <TouchableOpacity onPress={() => {}}>
        <Image style={styles.imagePost} source={picture} />
      </TouchableOpacity>
      <View style={[styles.content, { borderBottomColor: colors.border }]}>
        <Text headline semibold style={{ marginBottom: 6 }}>
          {title} Posted By {name}
        </Text>
        <HTMLView value={description} />
        {video_element}
      </View>
    </View>
  );
}

PostItem.propTypes = {
  image: PropTypes.node.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element)
  ]),
  title: PropTypes.string,
  name: PropTypes.string,
  video: PropTypes.string,
  description: PropTypes.string,
  onPress: PropTypes.func
};

PostItem.defaultProps = {
  image: "",
  title: "",
  name: "",
  video: "",
  description: "",
  style: {},
  onPress: () => {}
};
