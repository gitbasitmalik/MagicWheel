import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity} from 'react-native';
import { TextInput, Text } from 'react-native-paper';
 import { useNavigation } from '@react-navigation/native';
 import { getAuth ,signInWithEmailAndPassword  } from "firebase/auth";
import { app } from './config';
const LoginScreen = () => {

  const navigation=useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth(app);

const loginButton = ()=>
{
  signInWithEmailAndPassword(auth, email, password)
.then(() => {
  navigation.replace("Home")
  if (email === 'mbasit467@gmail.com' && password === 'malik467') {
    navigation.navigate('Admin');
}
})
.catch((error) => {
  const errorMessage = error.message;
  alert(errorMessage)
});


}
  return (
    
    <View style={styles.container}>
    <Text style={styles.title}>Hello Again!</Text>
    <Text style={{fontSize : 20 , top : 40 , fontFamily : "Optima",}}>Fill your details or continue with google.</Text>
   <View style={styles.fieldBox}>
   <Text style={{top: 20}}>Email Address:</Text>
    <TextInput
      style={styles.input}
      placeholder="Email"
      onChangeText={(text) => setEmail(text)}
      
    />
    <Text style={{top: 20}}>Password:</Text>
    <TextInput
      style={styles.input}
      placeholder="Password"
      secureTextEntry
      onChangeText={(text) => setPassword(text)}
      
    />
    <TouchableOpacity onPress={()=>navigation.navigate('Forget')}>
    <Text>Forget Password?</Text>
    </TouchableOpacity>
   </View>
    <TouchableOpacity style={styles.LoginButton} onPress={()=>loginButton()} >
      <Text style={styles.LoginButtonText}>Login </Text>
    </TouchableOpacity>
    {/* <TouchableOpacity style={styles.button} onPress={()=>googleLogin()} >
      <Text style={styles.buttonText}>Login with Google</Text>
    </TouchableOpacity> */}
    <View >
    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
      <Text style={styles.signupText}>New User? Create Account</Text>
    </TouchableOpacity>
    </View>
  </View>
    
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  fieldBox:
  {
    marginTop: 60,
    
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius : 15,
    marginTop: 25,
    paddingHorizontal: 10,
  },
  button: {
    top: 40, 
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily : "Optima",
    fontSize : 18,
  },
  LoginButton:
  {
    top: 20, 
    width: '100%',
    backgroundColor: '#522C90',
    padding: 20,
    marginTop: 10,
    borderRadius: 10,
    

  },
  LoginButtonText:
  {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily : "Optima",
    fontSize : 18,
  },
  signupText: {
    marginTop: 250,
    fontSize: 16,
    alignSelf : "center",
    fontFamily : "Optima",
  },
  title:
  {
    top : 30,
    fontWeight : "700",
    fontSize : 40,
    fontFamily : "Optima",
    alignSelf : "center",
  }
});