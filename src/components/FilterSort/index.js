import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import styles from './styles';
import {Icon, Text, Button} from '@components';
import PropTypes from 'prop-types';
import {BaseColor, useTheme} from '@config';
import Modal from 'react-native-modal';
import {useTranslation} from 'react-i18next';

export default function FilterSort(props) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const backgroundColor = colors.background;
  const cardColor = colors.card;

  const [sortOption, setSortOption] = useState(props.sortOption);
  const [sortSelected, setSortSelected] = useState(props.sortSelected);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setSortOption(
      sortOption.map(item => {
        return {
          ...item,
          checked: item.value == sortSelected.value,
        };
      }),
    );
  }, []);

  const onSelectFilter = selected => {
    setSortOption(
      sortOption.map(item => {
        return {
          ...item,
          checked: item.value == selected.value,
        };
      }),
    );
  };

  const onOpenSort = () => {
    setModalVisible(true);

    setSortOption(
      sortOption.map(item => {
        return {
          ...item,
          checked: item.value == sortSelected.value,
        };
      }),
    );
  };

  const onApply = () => {
    const {onChangeSort} = props;
    const sorted = sortOption.filter(item => item.checked);
    if (sorted.length > 0) {
      setSortSelected(sorted[0]);
      setModalVisible(false);
      onChangeSort(sorted[0]);
    }
  };

  const iconModeView = modeView => {
    switch (modeView) {
      case 'block':
        return 'square';
      case 'grid':
        return 'th-large';
      case 'list':
        return 'th-list';
      default:
        return 'th-list';
    }
  };

  const {style, modeView, onFilter, onChangeView, labelCustom} = props;
  const customAction =
    modeView != '' ? (
      <TouchableOpacity onPress={onChangeView} style={{flexDirection: 'row', alignItems: 'center'}}>
        <Icon
          name={iconModeView(modeView)}
          size={16}
          color={BaseColor.grayColor}
          solid
        />
         <Text headline grayColor style={{marginLeft: 5}}>
          View
        </Text>
      </TouchableOpacity>
    ) : (
      <Text headline grayColor numberOfLines={1} style={styles.contentModeView}>
        {labelCustom}
      </Text>
    );

  return (
    <View style={[styles.contain, {backgroundColor}, style]}>
      {customAction}
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity onPress={onFilter} style={styles.contentFilter}>
          <Icon name="filter" size={16} color={BaseColor.grayColor} solid />
          <Text headline grayColor style={{marginLeft: 5}}>
            {t('filter')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

FilterSort.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  sortOption: PropTypes.array,
  sortSelected: PropTypes.object,
  modeView: PropTypes.string,
  labelCustom: PropTypes.string,
  onChangeSort: PropTypes.func,
  onChangeView: PropTypes.func,
  onFilter: PropTypes.func,
};

FilterSort.defaultProps = {
  style: {},
  sortOption: [
    {
      value: 'low_price',
      icon: 'sort-amount-up',
      text: 'lowest_price',
    },
    {
      value: 'hight_price',
      icon: 'sort-amount-down',
      text: 'hightest_price',
    },
    {
      value: 'high_rate',
      icon: 'sort-amount-up',
      text: 'hightest_rating',
    },
    {
      value: 'popular',
      icon: 'sort-amount-down',
      text: 'popularity',
    },
  ],
  sortSelected: {
    value: 'high_rate',
    icon: 'sort-amount-up',
    text: 'hightest_rating',
  },
  modeView: '',
  labelCustom: '',
  onChangeSort: () => {},
  onChangeView: () => {},
  onFilter: () => {},
};
