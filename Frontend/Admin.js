

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image
} from "react-native";



const Admin = () => {
  const [sneakerID, setSneakerID] = useState("");
  const [sneakerName, setSneakerName] = useState("");
  const [sneakerPrice, setSneakerPrice] = useState("");
  const [sneakerUrl, setSneakerUrl] = useState("");
  const [sneakerData, setSneakerData] = useState([]);

  const sendSneakerData =  () => {
      
  };

  const getSneakerData = () => {

  };

  const clearInputFields = () => {
    setSneakerID("");
    setSneakerName("");
    setSneakerPrice("");
    setSneakerUrl("");
  };

  const updateSneakerData =  () => {

  };

  const deleteSneakerData = () => {
   };

  const renderSneakerItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.id}</Text>
      <Text style={styles.tableCell}>{item.name}</Text>
      <Text style={styles.tableCell}>{item.price}</Text>
       <View style={styles.imageContainer}>
        <Image source={{ uri: item.url }} style={styles.image} />
      </View>
      <TouchableOpacity onPress={() => deleteSneakerData()}>
        <Text style={styles.tableCell}>Delete</Text>
      </TouchableOpacity>
    </View>
  );


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputStyles}
        value={sneakerID}
        placeholder="Enter Sneaker ID"
        onChangeText={(text) => setSneakerID(text)}
      />
      <TextInput
        style={styles.inputStyles}
        value={sneakerName}
        placeholder="Enter Sneaker Name"
        onChangeText={(text) => setSneakerName(text)}
      />
      <TextInput
        style={styles.inputStyles}
        value={sneakerPrice}
        placeholder="Enter Sneaker Price"
        onChangeText={(text) => setSneakerPrice(text)}
      />
      <TextInput
        style={styles.inputStyles}
        value={sneakerUrl}
        placeholder="Enter Image URL"
        onChangeText={(text) => setSneakerUrl(text)}
      />

      <TouchableOpacity onPress={getSneakerData}>
        <Text style={styles.btnCon}>Get Data</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={sendSneakerData}>
        <Text style={styles.btnCon}>Send Data</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={clearInputFields}>
        <Text style={styles.btnCon}>Clear Fields</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={updateSneakerData}>
        <Text style={styles.btnCon}>Update Data</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Admin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  inputStyles: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 3,
    backgroundColor: "#f3f3f3",
    marginBottom: 10,
  },
  btnCon: {
    padding: 20,
    backgroundColor: "#000",
    color: "#fff",
    textAlign: "center",
    borderRadius: 100,
    marginTop: 5,
  },
  tableContainer: {
    borderWidth: 1,
    borderRadius: 3,
    borderColor: "#ccc",
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  tableHeaderText: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
  },
  tableData: {
    maxHeight: 200,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
    gap: 5,
    paddingHorizontal: 5,
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
  },
  image: {
    width: 50,
    height: 50,
  },
});