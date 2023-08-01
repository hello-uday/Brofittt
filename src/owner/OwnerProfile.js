import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { GradientBG, Hr, Hi } from '../components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  bgColor,
  neon,
  bgLight,
  bgGlassLight,
  bgGlass,
} from '../constants/Constants';
import axios from '../constants/Axios';
import * as SecureStore from 'expo-secure-store';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState(null);
  const [editable, setEditable] = useState(false);
  // const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editHeight, setEditHeight] = useState('');
  const [editWeight, setEditWeight] = useState('');
  const [Id, setId] = useState('');
  const [planExiper, setPlanExiper] = useState(null);

  const fetchUserProfileData = async () => {
    try {
      const userString = await SecureStore.getItemAsync('user');
      const user = JSON.parse(userString);
      setUsername(user.name);
      const userID = user?.gymId;
      // console.log('User ID', userID);
      const response = await axios.get(`/gym/${userID}`);
      const data = await response.data;
      // console.log('User Profile data', data.data);
      setUserData(data.data);
      setId(data.data._id);
    } catch (error) {
      console.log('User Profile data fetch Error', error);
    }
  };

  const getDifferenceInDays = async (dateString) => {
    if (!dateString) return null;

    const [day, month, year] = dateString.split('-').map(Number);
    const givenDate = new Date(year, month - 1, day);
    if (isNaN(givenDate.getTime())) return null;
    const currentDate = new Date();
    const timeDifferenceInMilliseconds = givenDate - currentDate;
    const differenceInDays = Math.floor(
      timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24)
    );
    setPlanExiper(differenceInDays);
    return differenceInDays;
  };

  useEffect(() => {
    const fetchAndCalculatePlanExpiry = async () => {
      fetchUserProfileData();
      const givenDateString = userData?.planExpiryDate;

      if (userData && givenDateString) {
        const differenceInDays = await getDifferenceInDays(givenDateString);
        setPlanExiper(differenceInDays);
      }
    };
    fetchAndCalculatePlanExpiry();
  }, [userData?.planExpiryDate]);

  if (!userData)
    return (
      <GradientBG style={{ flex: 1 }}>
        <View style={styles.profileCard}>
          <Hi />
        </View>
      </GradientBG>
    );

  return (
    <GradientBG style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.profileCard}>
          <View style={styles.profileContainer}>
            <Image
              source={require('../assets/images/profile.jpg')}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
            <Text style={styles.userName}>{userData?.gymName}</Text>
            <Text
              style={{
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: 16,
                color: bgLight,
              }}>
              {userData?.email}
            </Text>
          </View>
          <View style={styles.profileIcons}>
            <View
              style={{
                alignItems: 'center',
                borderColor: bgColor,
                width: '30%',
                borderWidth: 2,
                padding: 10,
                borderRadius: 30,
              }}>
              <MaterialCommunityIcons
                name="card-bulleted-outline"
                size={30}
                color={bgColor}
              />
              <Text>Plans</Text>
              <Text>{userData?.plans.length}</Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                borderColor: bgColor,
                width: '30%',
                borderWidth: 2,
                padding: 10,
                borderRadius: 30,
              }}>
              <MaterialCommunityIcons
                name="clipboard-outline"
                size={30}
                color={bgColor}
              />
              <Text>Gym.Id</Text>
              <Text>{userData?.gymId}</Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                borderColor: bgColor,
                width: '30%',
                borderWidth: 2,
                padding: 10,
                borderRadius: 30,
              }}>
              <MaterialCommunityIcons
                name="calendar-clock-outline"
                size={30}
                color={bgColor}
              />
              <Text>Users</Text>
              <Text>50</Text>
            </View>
          </View>
        </View>

        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <View style={styles.smContainer}>
            <Text>Height</Text>
            <Text style={styles.smHeader}>{userData?.height}</Text>
            <Text style={{ fontSize: 12 }}>Inch</Text>
          </View>
          <View style={styles.smContainer}>
            <Text>Weight</Text>
            <Text style={styles.smHeader}>{userData?.weight}</Text>
            <Text style={{ fontSize: 12 }}>KG</Text>
          </View>
          <View style={styles.smContainer}>
            <Text>Age</Text>
            <Text style={styles.smHeader}>{userData?.age}</Text>
            <Text style={{ fontSize: 12 }}>Yrs</Text>
          </View>
        </View>
        <Hr /> */}

        <View
          style={{
            paddingHorizontal: 20,
            backgroundColor: 'orange',
            borderRadius: 20,
            borderRightWidth: 3,
            borderBottomWidth: 3,
            marginBottom: 10,
          }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: bgColor }}>
            Plan Details
          </Text>

          {userData?.plans.map((item, index) => {
            return (
              <View key={index}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 20,
                  }}>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: bgLight }}>
                      Plan Name
                    </Text>
                    <Text style={{ fontSize: 16, color: bgColor }}>
                      {item.name}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: bgLight }}>
                      Plan Price
                    </Text>
                    <Text style={{ fontSize: 16, color: bgColor }}>
                      {item.price}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: bgLight }}>
                      Plan Days
                    </Text>
                    <Text style={{ fontSize: 16, color: bgColor }}>
                      {item.validity}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </GradientBG>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: neon,
    borderRadius: 30,
    borderColor: bgColor,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    marginBottom: 10,
  },
  profileContainer: {
    paddingBottom: 30,
    paddingTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    color: bgColor,
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  profileIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 40,
    paddingBottom: 30,
  },
  smContainer: {
    backgroundColor: '#F8FFDB',
    height: 200,
    width: 125,
    marginHorizontal: 10,
    borderRadius: 30,
    marginTop: 10,
    padding: 20,
    alignItems: 'flex-start',
    borderColor: bgColor,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderRadius: 30,
  },
  smHeader: {
    fontSize: 38,
    fontWeight: 'bold',
    paddingVertical: 15,
  },
});

export default ProfilePage;
