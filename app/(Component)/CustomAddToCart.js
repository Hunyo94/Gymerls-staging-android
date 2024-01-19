import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CustomAddToCart = ({ text, onPress }) => {
  const [isDisable, setIsDisabled] = useState(false);
  const [cartItem, setCartItem] = useState([]);
  const [username, setUsername] = useState("");
  const [pressed, setPressed] = useState(false);
  const [AddT0Cart, setAddtoCart] = useState("ADD TO CART");

  useEffect(() => {
    storeDataUser(function (callback) {
      fetch("http://10.0.2.2:3031/api/get-cart-by-id", {
        method: "POST",
        headers: {
          "Content-type": " application/json",
        },
        body: JSON.stringify({
          username: callback,
          status: "cart",
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          setCartItem(result);
        });
      // console.log(cartItem);
    });
  }, [cartItem]);

  const storeDataUser = async (callback) => {
    const valueUsername = await AsyncStorage.getItem("username");
    try {
      setUsername(valueUsername);
      callback(valueUsername);
      return true;
    } catch (exception) {
      return false;
    }
  };
  const addToCart = () => {};
  return (
    <View>
      <View style={styles.root}>
        <Pressable
          onPressIn={() => {
            setPressed(true);
            setIsDisabled(true);
            setTimeout(() => {
              setPressed(false);
              setIsDisabled(false);
            }, 5000);
            addToCart();
          }}
          disabled={isDisable}
          onPress={onPress}
          testOnly_pressed={pressed}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "#444" : "#0A6EBD",
            },
            {
              borderRadius: 3,
            },
            styles.wrapperCustom,
          ]}
        >
          {({ pressed }) => (
            <Text style={styles.text}>
              {pressed ? "ADDED TO CART" : "ADD TO CART"}
              {/* {AddT0Cart} */}
            </Text>
          )}
        </Pressable>
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
    fontSize: 15,
    fontWeight: "600",
    color: "white",
    // fontWeight: "bold",
    alignSelf: "center",
    marginVertical: "4%",
  },
});

export default CustomAddToCart;
