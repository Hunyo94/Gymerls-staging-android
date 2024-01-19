import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";

const CustomButton = ({ onPress, text }) => {
  return (
    <View style={styles.root}>
      <TouchableOpacity onPress={onPress} style={styles.textcontainer}>
        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: "100%",
  },
  textcontainer: {
    width: "90%",
    alignItems: "center",
    borderRadius: 5,
    marginVertical: 5,
    alignSelf: "center",
    marginVertical: 20,
    backgroundColor: "#ad0000",
  },
  text: {
    padding: 12,
    color: "white",
    fontSize: 25,
  },
});

export default CustomButton;
