import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { TouchableOpacity } from "react-native";

const CustomIconButton = ({ onPress, text }) => {
  return (
    <View>
      <View style={styles.root}>
        <TouchableOpacity onPress={onPress} style={styles.textcontainer}>
          {/* <FontAwesome name="sign-out" size={45}/> */}
          <Text style={styles.text}>Singout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {},
  textcontainer: {
    alignItems: "center",
    borderRadius: 5,
    alignSelf: "center",
    marginVertical: 8,
    paddingVertical: 8,
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
  },
});

export default CustomIconButton;
