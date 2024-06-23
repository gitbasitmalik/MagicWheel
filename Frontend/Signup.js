
import { StyleSheet, Text, View , TextInput , TouchableOpacity  } from 'react-native'
import React, { useState } from 'react'
import { getAuth ,createUserWithEmailAndPassword , getRedirectResult} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { app } from './config';

const Signup = ({navigation}) => {
  const [name , setName] = useState(null);
  const [email , setEmail] = useState(null);
  const [password , setPassword] = useState(null);
  const auth = getAuth(app);
  
  const signupButton = ()=>
  {
    
    createUserWithEmailAndPassword(auth, email, password)
  .then(() => {
    alert("User Created Successfully");
    navigation.replace("Home");
  })
  .catch((error) => {
    const errorMessage = error.message;
    alert(errorMessage)
  });
  }
  const googleSignup = ()=>
    {
      const googleProvider = new GoogleAuthProvider();
getRedirectResult(auth , googleProvider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    console.log(token);
    const user = result.user;
  }).catch((error) => {
    console.error('Google signup error:', error);
  });
    }
  
  return (
    (
        <View style={styles.container}>
        <Text style={styles.title}>Register Account</Text>
        <Text style={{fontSize : 20,top : 50 ,fontFamily : "Optima",}}>Fill your details or continue with social media.</Text>
        <View style = {styles.fieldBox}>
        <Text style={{top:20 , }}>Your Name</Text>
          <TextInput
            style={styles.input}
            placeholder="xxxxxxx"
            onChangeText={(text) => setName(text)}
            
          />
        <Text style={{top:20}}>Your Email</Text>
          <TextInput
            style={styles.input}
            placeholder="xyz@gmail.com"
            onChangeText={(text) => setEmail(text)}
            
          />
          <Text style={{top:20}}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
            
          />
          
        </View>
          <TouchableOpacity style={styles.SignupButton} onPress={()=>signupButton()}>
            <Text style={styles.SignupButtonText}>Signup</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={()=>googleSignup()}>
            <Text style={styles.buttonText}>Signup with Google</Text>
          </TouchableOpacity>
         <View>
         <TouchableOpacity onPress={() => navigation.navigate('Login')} >
            <Text style={styles.loginText}>Already have an account? Login</Text>
          </TouchableOpacity>
         </View>
        </View>
  )
  )
}

export default Signup


    const styles = StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          padding: 20,
        },
        fieldBox:
        {
            marginTop : 60,
            
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
          marginTop: 15,
          borderRadius: 10,
        },
        buttonText: {
          color: 'black',
          textAlign: 'center',
          fontWeight: 'bold',
          fontFamily : "Optima",
          fontSize : 18,
        },
        SignupButton:
        {
          top: 20, 
          width: '100%',
          backgroundColor: '#522C90',
          padding: 20,
          marginTop: 10,
          borderRadius: 10,
      
        },
        SignupButtonText:
        {
          color: 'white',
          textAlign: 'center',
          fontWeight: 'bold',
          fontFamily : "Optima",
          fontSize : 18,
        },
        loginText: {
          marginTop: 70,
          fontSize: 16,
          alignSelf : "center",
          fontFamily : "Optima",
        },
        title:
        {
          top: 40,
          fontWeight : "700",
          fontSize : 40,
          fontFamily : "Optima",
          alignSelf : "center",
        }
      });

    