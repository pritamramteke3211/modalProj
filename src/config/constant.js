
import { Dimensions, Platform } from "react-native";
import insets from './insets'

export const HOME_HEADER = 58 * 2.4;
export const DURATIONS = [2, 4, 6, 8, 16, 24];

export const MODAL_TYPE = {
  1: 'Add Identity',
  2: 'Company type',
  3: 'Country',
  4: 'State',
  5: 'City',
  6: 'Employment type',
  7: 'Department',
};

export const STATIC_MODAL_TYPE = {
  1: 'Workplace type',
  2: 'Time Period',
};

export const DEVICE_TYPE = 'mobile';
export const T_AND_C = 'https://helpersfamily.com/terms';
export const ABOUT = 'https://helpersfamily.com/about';
export const PRIVACY_POLICY = 'https://helpersfamily.com/privacypolicy';
export const HELP = 'https://helpersfamily.com/contact';

export const FILE_BASE_URL = 'https://helpersfamily.s3.ap-south-1.amazonaws.com/';

export const CONTENT_SPACING = 15;

const SAFE_BOTTOM =
  Platform.select({
    ios: insets?.bottom,
  }) ?? 0;

export const SAFE_AREA_PADDING = {
  paddingLeft: insets?.left + CONTENT_SPACING,
  paddingTop: insets?.top + CONTENT_SPACING,
  paddingRight: insets?.right + CONTENT_SPACING,
  paddingBottom: SAFE_BOTTOM + CONTENT_SPACING,
};

// The maximum zoom _factor_ you should be able to zoom in
export const MAX_ZOOM_FACTOR = 20;

export const SCREEN_WIDTH = Dimensions.get('window').width;

export const SCREEN_HEIGHT = Platform.select({
  android: Dimensions.get('screen').height - insets.bottom,
  ios: Dimensions.get('window').height,
});

// Capture Button
export const CAPTURE_BUTTON_SIZE = 78;

export const ANDROID_URL = 'market://details?id=com.helpersfamily';

export const IPHONE_URL = 'https://itunes.apple.com/app/id1611893849';
