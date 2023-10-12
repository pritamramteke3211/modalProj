import * as React from 'react';
import {Image, Pressable, ScrollView, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import { moderateScale, moderateScaleVertical } from '../../theme/responsiveSize';
import commonStyles from '../../utils/commonStyles';
import WrapperContainer from '../../components/WrapperContainer';
import styles from './styles';
import useUploadImage from '../../hooks/useUploadImage';
import imagePath from '../../config/imagePath';
import TextInputCustom from '../../components/TextInputCustom';
import FlexSBContainer from '../../components/FlexSBContainer';
import colors from '../../theme/colors';
import { registerSchema } from '../../validation/validation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateAuthUserData } from '../../redux/reducer/AuthSlice/authSlice';
import { updateLocation } from '../../redux/reducer/LocationUpdateSlice/locationUpdateSlice';
import { showError } from '../../utils/showMsg';
import MainButton from '../../components/MainButton';


const CreateProfile = (_) => {

  const [genderType, setGenderType] = React.useState(-1);
  
  const [name, setName] = React.useState('');
  
  const [lastName, setLastName] = React.useState('');
  
  const [email, setEmail] = React.useState('');
  
  const [loading, setLoading] = React.useState
  (false);
  
  const dispatch = useDispatch();
  // const userData = useSelector(state => state.authUser.authUser);

  const {openDialog, image: uploaded, baseImage} = useUploadImage();

  const createProfile = async () => {
    try {
      const validateData = await registerSchema.validate({email: email, gender: genderType, firstName: name, lastName: lastName});
      
      setLoading(true);
      
      const formData = new FormData();
      
      if (validateData.email) {
        formData.append('email', validateData.email);
      }
      
      formData.append('gender', validateData.gender);
      
      formData.append('firstName', validateData.firstName);
      
      formData.append('lastName', validateData.lastName);
      
      if (uploaded) {
        formData.append('profilePic', {
          uri: uploaded?.path,
          type: 'images/jpeg',
          name: 'image.jpg',
        });
      }
      const update = await updateProfile(formData);
      
      setLoading(false);
      
      let userData = await AsyncStorage.getItem('userData');
      userData = JSON.parse(userData);
      dispatch(updateAuthUserData({...update, accessToken: userData?.accessToken}));
      if (update?.latitude && update?.longitude) {
        dispatch(updateLocation(true));
      } else {
        dispatch(updateLocation(false));
      }
    } catch (error) {
      setLoading(false);
      showError((error).message);
    }
  };

  return (
    <WrapperContainer isLoading={loading}>
      <ScrollView>
        <View style={{flex: 1, padding: 15}}>
          <Text style={{...commonStyles.fontBold28, marginTop: moderateScaleVertical(40), marginBottom: moderateScaleVertical(20)}}>{'Create your profile'}</Text>
          
          <Pressable onPress={openDialog} style={styles.imageContainer}>
            <Image style={styles.userImage} source={baseImage ? {uri: baseImage} : imagePath.user} />
            <View style={styles.penBackground}>
              <Image style={styles.penIcon} source={imagePath.edit} />
            </View>
          </Pressable>

          <TextInputCustom
            onChangeText={setName}
            textInputStyle={{
              marginTop: moderateScaleVertical(40),
            }}
            placeHolderString={'Enter first name'}
          />

          <TextInputCustom
            onChangeText={setLastName}
            textInputStyle={{
              marginTop: moderateScaleVertical(40),
            }}
            placeHolderString={'Enter last name'}
          />

          <TextInputCustom
            onChangeText={setEmail}
            textInputStyle={{
              marginVertical: moderateScaleVertical(30),
            }}
            keyboardType="email-address"
            placeHolderString={'Enter Email'}
          />

          <Text style={commonStyles.fontSize13}>{'Select Gender'}</Text>
          <FlexSBContainer containerStyle={{flex: 1, marginVertical: moderateScaleVertical(20)}}>
            <FlexSBContainer onPress={() => setGenderType(1)} containerStyle={{...styles.genderContainer, marginEnd: 10, borderColor: genderType === 1 ? colors.themeColor : colors.grey}}>
              <Image style={{...styles.genderIcon, tintColor: genderType === 1 ? colors.themeColor : colors.black}} source={imagePath.male} />
              <Text style={{...commonStyles.fontSize14, color: genderType === 1 ? colors.themeColor : colors.black, marginStart: moderateScale(10)}}>{'Male'}</Text>
            </FlexSBContainer>
            <FlexSBContainer onPress={() => setGenderType(2)} containerStyle={{...styles.genderContainer, borderColor: genderType === 2 ? colors.themeColor : colors.grey}}>
              <Image style={{...styles.genderIcon, tintColor: genderType === 2 ? colors.themeColor : colors.black}} source={imagePath.femenine} />
              <Text style={{...commonStyles.fontSize14, color: genderType === 2 ? colors.themeColor : colors.black, marginStart: moderateScale(10)}}>{'Female'}</Text>
            </FlexSBContainer>
          </FlexSBContainer>
          <MainButton btnStyle={{marginTop: moderateScaleVertical(30)}} onPress={createProfile} btnText={"Let's Go"} />
        </View>
      </ScrollView>
    </WrapperContainer>
  );
};
export default CreateProfile;
