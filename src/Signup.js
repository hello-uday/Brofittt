import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios, { setTokenHeader } from './constants/Axios';
import { View, Text, TouchableOpacity } from 'react-native';
import Background from './components/Background';
import Btn from './components/Btn';
import { bgColor, neon } from './constants/Constants';
import Field from './components/Field';

const Signup = (props) => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gymId: '',
    password: '',
    confirmPassword: '',
  });

  const handleSignup = async () => {
    const { name, email, gymId, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('user/signup', {
        name,
        email,
        gymId,
        password,
      });
      console.log(response.data.data);
      const userJSON = response.data.data.user;
      const user = JSON.stringify(userJSON);
      console.log('user', user);
      save('user', user);
      if (response.data.data.jwt) {
        const token = response.data.data.jwt;
        const expires = Date.now() + 1000 * 60 * 60; // 1hr
        const expireString = JSON.stringify(expires);
        async function save(key, value) {
          await SecureStore.setItemAsync(key, value);
        }
        save('expire', expireString);
        save('token', token)
          .then(() => {
            setTokenHeader();
            console.log('token saved');
          })
          .catch((error) => {
            console.log('token not saved', error);
          });

        console.log('token', token);
      }
      setLoading(false);
      setTokenHeader();
      alert('SignUp successful');
    } catch (error) {
      alert('SignUp failed');
      console.error('Error:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const nextPage = async () => {
    setTokenHeader();
    props.navigation.navigate('ProfileSetup');
  };

  return (
    <Background>
      <View style={{ alignItems: 'center', width: 400 }}>
        <Text
          style={{
            color: 'white',
            fontSize: 64,
            fontWeight: 'bold',
            marginTop: 50,
          }}>
          Welcome
        </Text>
        <Text
          style={{
            color: 'white',
            fontSize: 19,
            fontWeight: 'bold',
            marginBottom: 20,
          }}>
          Create a new account
        </Text>
        <View
          style={{
            backgroundColor: bgColor,
            height: 700,
            width: 400,
            borderTopLeftRadius: 130,
            paddingTop: 50,
            alignItems: 'center',
          }}>
          <Field
            placeholder="Name"
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
          />
          <Field
            placeholder="Email"
            keyboardType={'email-address'}
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
          />
          <Field
            placeholder="Gym_Id"
            value={formData.gymId}
            onChangeText={(value) => handleInputChange('gymId', value)}
          />
          <Field
            placeholder="Password"
            secureTextEntry={true}
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
          />
          <Field
            placeholder="Confirm Password"
            secureTextEntry={true}
            value={formData.confirmPassword}
            onChangeText={(value) =>
              handleInputChange('confirmPassword', value)
            }
          />
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              flexWrap: 'wrap',
              textAlign: 'center',
            }}>
            <Text
              style={{
                color: 'grey',
                fontSize: 16,
                flexWrap: 'wrap',
                textAlign: 'center',
              }}>
              By signing in, you agree to our{' '}
            </Text>
            <Text
              style={{
                color: neon,
                fontWeight: 'bold',
                fontSize: 16,
                flexWrap: 'wrap',
                textAlign: 'center',
              }}>
              Terms & Conditions
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              width: '78%',
              paddingRight: 16,
              marginBottom: 10,
            }}>
            <Text
              style={{
                color: 'grey',
                fontSize: 16,
                flexWrap: 'wrap',
                textAlign: 'center',
              }}>
              and{' '}
            </Text>
            <Text style={{ color: neon, fontWeight: 'bold', fontSize: 16 }}>
              Privacy Policy
            </Text>
          </View>
          <Btn
            textColor={bgColor}
            bgColor={neon}
            btnLabel="Signup"
            Press={handleSignup}
          />
          {loading ? null : (
            <Btn
              textColor={bgColor}
              bgColor={neon}
              btnLabel="Next"
              loading={loading}
              disable={loading}
              Press={nextPage}
            />
          )}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>
              Already have an account ?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Login')}>
              <Text style={{ color: neon, fontWeight: 'bold', fontSize: 16 }}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Background>
  );
};

export default Signup;
