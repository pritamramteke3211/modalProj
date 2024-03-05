import React from 'react';
import {Pressable} from 'react-native';

const FlexSBContainer = ({children, containerStyle, ...any}) => {
  return (
    <Pressable
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        containerStyle,
      ]}
      {...any}>
      {children}
    </Pressable>
  );
};

export default FlexSBContainer;
