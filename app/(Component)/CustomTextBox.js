import {
  View,
  Text,
  TextInput,
  StyleSheet,
  editable,
  inputMode,
} from "react-native";
import React from "react";

const CustomTextInput = ({
  value,
  setValue,
  placeholder,
  secureTextEntry,
  editable,
  inputMode,
  keyboardType,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        style={styles.input}
        secureTextEntry={secureTextEntry}
        editable={editable}
        inputMode={inputMode}
        keyboardType={keyboardType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#A0A0A0",
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 5,
    alignSelf: "center",
    paddingHorizontal: 12,
    marginVertical: 10,
    color: "black",
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
});

export default CustomTextInput;
