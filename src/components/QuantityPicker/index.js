import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { Text, Icon } from "@components";
import styles from "./styles";
import { BaseColor, useTheme } from "@config";

export default function QuantityPicker(props) {
  const [value, setValue] = useState(props.value);
  const { style, label, detail } = props;
  const { colors } = useTheme();

  const onChange = type => {
    var newval = value;
    if (type == "up") {
      newval = value + 1;
    } else {
      newval = value - 1 > 0 ? value - 1 : 0;
    }
    setValue(newval);
    if(props.onChange){
      props.onChange(newval);
    }
  };

  return (
    <View
      style={[styles.contentPicker, { backgroundColor: colors.card }, style]}
    >
      <Text body1 numberOfLines={1} style={{ marginBottom: 5 }}>
        {label}
      </Text>
      <TouchableOpacity onPress={() => onChange("up")}>
        <Icon name="plus-circle" size={24} color={colors.primary} />
      </TouchableOpacity>
      <Text title1>{value}</Text>
      <TouchableOpacity onPress={() => onChange("down")}>
        <Icon name="minus-circle" size={24} color={BaseColor.grayColor} />
      </TouchableOpacity>
    </View>
  );
}

QuantityPicker.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  label: PropTypes.string,
  detail: PropTypes.string,
  value: PropTypes.number,
  onChange: PropTypes.func
};

QuantityPicker.defaultProps = {
  style: {},
  label: "Adults",
  detail: ">= 12 years",
  value: 1,
  onChange: () => {}
};
