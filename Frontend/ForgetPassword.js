
import { StyleSheet, Text, TextInput, View  , TouchableOpacity, Modal, Alert} from 'react-native'
import React  ,{ useState } from 'react'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { app } from './config';



const ForgetPassword = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState(null);

  const showModal = () => {
    
    setModalVisible(true);
    Reset();
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  const auth = getAuth(app);
  
  const Reset =()=>
  {
    sendPasswordResetEmail(auth, email)
  .then(() => {
    
  })
  .catch((error) => {
  
    const errorMessage = error.message;
    console.log(errorMessage);
  });

  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forget Password</Text>
      <Text style={{fontSize : 18,bottom : 210,fontFamily : "Optima",}}>Enter your Email account to reset your password</Text>
      
      <TextInput
       style={styles.input}
       placeholder="********"
        onChangeText={(text) => setEmail(text)}
       />
       <TouchableOpacity style={styles.resetButton} onPress = {showModal} >
        <Text style={styles.resetButtonText}>Reset Password </Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Check Your Email</Text>
          <Text>We have send password recovery code in your email</Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={closeModal}
          >
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}

export default ForgetPassword

const styles = StyleSheet.create({
    container: 
    {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        alignContent : "center"
    },
    title:
    {
        bottom :220,
          fontWeight : "700",
          fontSize : 40,
          fontFamily : "Optima",
          alignSelf : "center",
    },
    input : 
    {
        width: '100%',
        height: 55,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius : 15,
        paddingHorizontal: 10,
        fontSize : 18,
        bottom : 180,
          
    },

    resetButton:
    {
    
    width: '100%',
    backgroundColor: '#522C90',
    padding: 20,
    borderRadius: 20,
    bottom : 150
    },

    resetButtonText:
    {
      
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily : "Optima",
        fontSize : 18,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalText: {
      fontSize: 30,
      marginBottom: 20,
    },
    modalButton: {
      top : 30,
      padding: 10,
      backgroundColor: '#522C90',
      borderRadius: 6,
    },
    modalButtonText: {
      color: '#FFF',
      fontSize: 16,
    },

})