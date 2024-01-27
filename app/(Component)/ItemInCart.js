import React, { useContext } from "react";
import { Card, Button, Provider, TextInput } from "react-native-paper";
import { View, TouchableOpacity, Text, Pressable } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { IconButton, Colors } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ItemInCart = ({
  Quantity,
  onPressDecrement,
  onPressIncrement,
  source,
  Product_name,
  Description,
  Price,
  Sub_total,
  onPressremoveCart,
  setValueSubTotal,
  onChangeTextSubtotal,
  setValueQuantity,
  onChangeTextQuantity,
  disableDecrement,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [subTotals, setSubTotals] = useState(0);
  const [product, setProducts] = useState([]);
  const [username, setUsername] = useState("");
  const [Show, setShow] = useState(false);
  const [cart, setCart] = useState([]);

  const storeDataUser = async () => {
    const valueUsername = await AsyncStorage.getItem("username");
    try {
      setUsername(valueUsername);
      return true;
    } catch (exception) {
      return false;
    }
  };

  useEffect(() => {
    storeDataUser();

    getData(function (callback) {
      fetch("http://192.168.100.243:3031/api/get-cart-by-id", {
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
          setCart(result);
        });
    });
  }, [cart]);

  const getData = async (callback) => {
    try {
      const value = await AsyncStorage.getItem("username");
      if (value !== null) {
        setUsername(value);
        callback(value);
      } else {
      }
    } catch (e) {}
  };

  return (
    <View>
      {Show ? (
        <>
          <View style={{ alignItems: "center", marginVertical: "20%" }}>
            <Text
              style={{
                fontFamily: "EncodeSansSemiCondensed_700Bold",
                color: "grey",
              }}
            >
              MAKE YOUR PURCHASE
              <Ionicons name="cart-outline" size={24} color="grey" />.
            </Text>
          </View>
        </>
      ) : (
        <>
          <View
            style={{
              width: "90%",
              alignSelf: "center",
              flex: 1,
            }}
          >
            <View
              style={{
                width: "100%",
                marginTop: "10%",
                marginBottom: "5%",
              }}
            >
              <Card>
                <Card.Cover
                  source={source}
                  resizeMode="contain"
                  style={{ backgroundColor: "#fff" }}
                />
                <View
                  style={{
                    width: "100%",
                    alignItems: "center",
                    paddingVertical: "2%",
                    borderTopWidth: 0.5,
                    borderBottomWidth: 0.5,
                    borderColor: "#444",
                    marginVertical: 1,
                    backgroundColor: "#fff",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "EncodeSansSemiCondensed_700Bold",
                    }}
                  >
                    {Product_name}
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: "#F9F9F9",
                    width: "100%",
                  }}
                >
                  <Text
                    style={{
                      paddingLeft: "2%",
                      fontWeight: "bold",
                      marginVertical: "2%",
                      color: "#444",
                    }}
                  >
                    {Description}
                  </Text>
                  <View style={{}}>
                    <View
                      style={{
                        marginBottom: "2%",
                        marginHorizontal: "2%",
                        borderBottomWidth: 0.5,
                        borderColor: "#444",
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "700",
                          color: "#023047",
                        }}
                      >
                        ₱ {Price}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "100%",
                        paddingHorizontal: "2%",
                        flexDirection: "row",
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          padding: "2%",
                          borderRadius: 5,
                          backgroundColor: "#0A6EBD",
                          width: "10%",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        mode="contained"
                        disabled={disableDecrement}
                        onPress={onPressDecrement}
                      >
                        <Entypo name="minus" size={18} color="white" />
                      </TouchableOpacity>
                      <Text
                        style={{
                          paddingHorizontal: "4%",
                          fontWeight: "bold",
                          paddingVertical: "1%",
                          fontSize: 16,
                        }}
                        setValue={setValueQuantity}
                        onChangeText={onChangeTextQuantity}
                      >
                        {Quantity}
                      </Text>
                      <TouchableOpacity
                        style={{
                          padding: "2%",
                          borderRadius: 5,
                          backgroundColor: "#0A6EBD",
                          width: "10%",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onPress={onPressIncrement}
                      >
                        <Entypo name="plus" size={18} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text
                    style={{
                      fontWeight: "bold",
                      margin: "2%",
                      paddingHorizontal: "2%",
                      paddingBottom: "2%",
                      paddingTop: "2%",
                      borderRadius: 5,
                    }}
                    setValue={setValueSubTotal}
                    onChangeText={onChangeTextSubtotal}
                  >
                    Total: {Sub_total}
                  </Text>

                  <TouchableOpacity
                    onPress={onPressremoveCart}
                    style={{
                      backgroundColor: "#0079FF",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        marginVertical: "3%",
                        color: "white",
                        fontFamily: "EncodeSansSemiCondensed_700Bold",
                      }}
                    >
                      REMOVE{" "}
                      <MaterialCommunityIcons
                        name="trash-can-outline"
                        size={24}
                        color="white"
                      />
                    </Text>
                  </TouchableOpacity>
                </View>
              </Card>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default ItemInCart;
