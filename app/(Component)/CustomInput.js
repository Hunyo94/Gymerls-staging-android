import { View, Text, TextInput, StyleSheet, editable } from "react-native";
import React from "react";

const CustomInput = ({
  value,
  setValue,
  placeholder,
  secureTextEntry,
  editable,
}) => {
  return (
    <View style={styles.container}>
      <Text
        onChangeText={setValue}
        placeholder={placeholder}
        style={styles.input}
        secureTextEntry={secureTextEntry}
        editable={editable}
      >
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    width: "100%",
  },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#A0A0A0",
    padding: "2%",
    borderRadius: 5,
    alignSelf: "center",
    paddingHorizontal: 10,
    marginVertical: 10,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    fontSize: 18,
    backgroundColor: "#ebebeb",
  },
});

export default CustomInput;
