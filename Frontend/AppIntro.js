import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Button } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import LoginScreen from './LoginScreen';

const slides = [
  {
    key: '1',
    title: 'Magic Wheel',
    text: 'The New Journey For You Cars and Bike',
    image: require('./assets/car.png'),
    description: ""
  },
  {
    key: '2',
    title: '',
    text: 'Let’s Start Journey With Magic Wheel',
    image: require('./assets/sparepart2.png'),
    description: "Smart, Gorgeous & Fashionable Collection Explore Now"
  },
  {
    key: '3',
    title: '',
    text: 'You Have the Power To',
    image: require('./assets/sparepart1.png'),
    description: "There are many products which make your vehicle attractive and efficient."
  },
  
];

const AppIntro = ({ navigation }) => {
  const [showRealApp, setShowRealApp] = useState(false);

  const handleGetStarted = () => {
    setShowRealApp(true);
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Text style={styles.title}>{item.title}</Text>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.text}>{item.text}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  const renderNextButton = () => {
    return <Text style={styles.buttonText}>Next</Text>
  };

  const renderDoneButton = () => {
    return (
      <TouchableOpacity style={styles.buttonText} onPress={handleGetStarted}>
      <Text>Get Started</Text>
    </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {showRealApp ?
        <LoginScreen/>
      :
      
      <AppIntroSlider 
        renderItem={renderItem}
        data={slides}
        renderNextButton={renderNextButton}
        renderDoneButton={renderDoneButton}
        onDone={() => setShowRealApp(true)}
      />
}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#522C90',
  },
  title: {
    fontSize: 40,
    bottom :40,
    fontWeight: "900",
    color : "white",
    textTransform : "uppercase",
    fontFamily : "Optima",
  },
  image: {
    width: 428,
    height: 400,
    resizeMode : "cover",
    backgroundColor: '#522C90',
  },
  text: {
    fontSize: 34,
    marginBottom: 20,
    textAlign: 'center',
    color: "white",
    fontWeight : "600",
    fontFamily : "Optima",

  },
  buttonText: {
    textAlign : "left",
    fontSize: 15,
    color : "white",
    padding : 15,
    
    
  },
  description:
  {
    color : "#D8D8D8",
    fontSize :18,
    textAlign: 'center'
    
  },
  realAppContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent : "center"
  },
});

export default AppIntro;
