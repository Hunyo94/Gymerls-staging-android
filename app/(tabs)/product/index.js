import { Redirect, Stack, useRouter } from "expo-router";
import { Link } from "expo-router";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import ItemInCart from "../../(Component)/ItemInCart";
import {
  ActivityIndicator,
  Button,
  MD2Colors,
  TextInput,
  RadioButton,
} from "react-native-paper";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Entypo } from "@expo/vector-icons";
import * as Device from "expo-device";
import * as Network from "expo-network";
import { TouchableOpacity } from "react-native";
import { clockRunning } from "react-native-reanimated";

const Tab5Index = () => {
  const router = useRouter();

  const [showCheckOut, setShowCheckOut] = useState(false);
  const [grandTotal, setGrandTotal] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [subTotals, setSubTotals] = useState(0);
  const [showNo, setShowNo] = useState(false);
  const [showGtotalCheckOut, setShowGtotalCheckOut] = useState(true);
  const [deliverPickup, setDeliverPickup] = useState(false);
  const [checked, setChecked] = React.useState("first");
  const [decrementDisable, setDisableDecrement] = useState(false);
  const [cart, setCart] = useState([]);
  const [username, setUsername] = useState("");
  const [show, setShow] = useState("");
  const [refreshing, setRefreshing] = React.useState(false);
  const [refreshingAdd, setRefreshingAdd] = React.useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [address, setAddress] = useState("");
  const [fullname, setFullname] = useState("");
  const [contact, setContactNo] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Deliver");
  const [loadOnAdd, setLoadOnAdd] = useState([]);
  const [ipAddress, setIpAdress] = useState("");
  const [personInfo, setPersonInfo] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(1);

  const getIpAddress = async (ipAddress) => {
    try {
      const ipAdd = await Network.getIpAddressAsync();
      if (ipAdd !== null) {
        setIpAdress(ipAdd);
        ipAddress(ipAdd);
      } else {
      }
    } catch (e) {
      console.log(e);
    }
  };

  const mappingTotalQuantity = () => {
    let t = 0;
    cart.map(({ quantity }) => (t = t + quantity));
    setTotalQuantity(t);

    return t;
  };

  const userLogsOnPlaceOrder = (username) => {
    console.log(username);
    getIpAddress(function (ipAddress) {
      fetch("https://gymerls-staging-server.vercel.app/api/insert-log", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          event_info: "Confirm - checkout",
          ip_address: ipAddress,
          platform: Device.osName,
        }),
      })
        .then((response) => response.json())
        .catch((error) => console.log(error));
    });
  };

  const userLogdelcart = (event) => {
    getIpAddress(function (ipAddress) {
      fetch("https://gymerls-staging-server.vercel.app/api/insert-log", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          event_info: "delete - " + event + "in cart",
          ip_address: ipAddress,
          platform: Device.osName,
        }),
      })
        .then((response) => response.json())
        .catch((error) => console.log(error));
    });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const onAddToCartRefresh = React.useCallback(() => {
    setRefreshingAdd(true);
    setTimeout(() => {
      setRefreshingAdd(false);
    }, 2000);
  }, []);

  const findValue = (result) => {
    onAddToCartRefresh(result);
    if (result.length == []) {
      setShowNo(true);
      setShowGtotalCheckOut(true);
    } else {
      setShowNo(false);
      setShowGtotalCheckOut(false);
    }
  };

  useEffect(() => {
    getDataPersonInfo(function (callback) {
      fetch(
        "https://gymerls-staging-server.vercel.app/api/get-user-by-username",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            username: callback,
          }),
        }
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (personinfo) {
          setPersonInfo(personinfo);
        });
    });
  }, []);

  useEffect(() => {
    getData(function (callback) {
      fetch("https://gymerls-staging-server.vercel.app/api/get-cart-by-id", {
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
          mappingTotalQuantity();
          setLoadOnAdd(result);
          setCart(result);
          findValue(result);
          onLoadMappingPrice(result);
          onAddToCartRefresh(result);
        });
    });
  }, [refreshing]);
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
  const getDataPersonInfo = async (callback) => {
    try {
      const value = await AsyncStorage.getItem("username");
      if (value !== null) {
        setUsername(value);
        callback(value);
      } else {
      }
    } catch (e) {}
  };

  const [newCart, setNewCart] = useState([]);
  const [item, setItem] = useState("");

  const onLoadMappingPrice = (result) => {
    let t = 0;
    result.map(({ sub_total }) => (t = t + sub_total));
    setGrandTotal(t);
    return t;
  };

  const mappingPrice = () => {
    let t = 0;
    cart.map(({ sub_total }) => (t = t + sub_total));
    setGrandTotal(t);
    return t;
  };

  const deleteCartItemAfterCheckout = (id) => {
    fetch("https://gymerls-staging-server.vercel.app/api/delete-cart", {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {});
  };
  const formatDate = (date) => {
    var dateToFormat = new Date(date);
    var year = dateToFormat.toLocaleString("default", { year: "numeric" });
    var month = dateToFormat.toLocaleString("default", { month: "2-digit" });
    var day = dateToFormat.toLocaleString("default", { day: "2-digit" });

    var formattedDate = year + "-" + month + "-" + day;
    return formattedDate;
  };

  const placeOder = () => {
    for (let post of cart) {
      deleteCartItemAfterCheckout(post.id);
    }
    for (let item of cart) {
      newCart.push(item.quantity + " X " + item.product_name);
    }

    var newItem = JSON.stringify(newCart).replace(/\[|\]/g, "");
    var replaceItem = newItem.replace(/"/g, " ");
    const transactionDate = formatDate(new Date());

    fetch("https://gymerls-staging-server.vercel.app/api/transaction", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        fullname: personInfo[0].name,
        contact: personInfo[0].contact,
        method: paymentMethod,
        address: personInfo[0].address,
        items: replaceItem,
        total_quantity: totalQuantity,
        total: grandTotal,
        status: "Pending",
        receipt_url: "image.jpg",
        transaction_date: transactionDate,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setShowCheckOut(false);
        onRefresh();
        userLogsOnPlaceOrder(username);
        alert("Transaction success");
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.mealcontainer}>
        <Text style={styles.headertext}>CART</Text>
      </View>
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{
            borderRadius: 5,
            width: "98%",
            alignSelf: "center",
            marginTop: "2%",
          }}
        >
          {showNo ? (
            <>
              <View style={{ alignItems: "center", marginVertical: "20%" }}>
                <Text
                  style={{
                    fontFamily: "EncodeSansSemiCondensed_700Bold",
                    color: "grey",
                  }}
                >
                  scroll down to reload..
                </Text>
                <Text
                  style={{
                    fontFamily: "EncodeSansSemiCondensed_700Bold",
                    color: "grey",
                  }}
                >
                  MAKE YOUR PURCHASE
                  <Ionicons name="cart-outline" size={24} color="grey" />.
                </Text>
                <Button
                  onPress={() => {
                    router.push("/(tabs)/store/entrymodal");
                  }}
                  style={{ marginTop: "2%", backgroundColor: "#0A6EBD" }}
                  mode="contained"
                >
                  Shop Now
                </Button>
                {/* <Link href="">back</Link> */}
              </View>
            </>
          ) : (
            <>
              {cart.map((item) => {
                const removeInCart = (product_name) => {
                  fetch(
                    "https://gymerls-staging-server.vercel.app/api/delete-cart",
                    {
                      method: "PATCH",
                      headers: {
                        "Content-type": "application/json",
                      },
                      body: JSON.stringify({
                        id: item.id,
                      }),
                    }
                  )
                    .then(function (response) {
                      return response.json();
                    })
                    .then((e) => {
                      userLogdelcart(product_name);
                    });
                };

                const incrementQuantity = (id) => {
                  console.log(totalQuantity);
                  cart.map((item) => {
                    if (id === item.id) {
                      setQuantity(item.quantity++);
                      setSubTotals(
                        (item.sub_total = item.quantity * item.price)
                      );
                      if (item.quantity >= 1) {
                        setDisableDecrement(false);
                      }
                      mappingPrice();
                      mappingTotalQuantity();
                    }
                  });
                };

                const decrementQuantity = (id) => {
                  console.log(totalQuantity);
                  cart.map((item) => {
                    if (id === item.id) {
                      setQuantity(item.quantity--);
                      setSubTotals(
                        (item.sub_total = item.quantity * item.price)
                      );
                      if (item.quantity <= 1) {
                        setDisableDecrement(true);
                      }
                      mappingPrice();
                      mappingTotalQuantity();
                    }
                  });
                };

                return (
                  <View key={item.id}>
                    <ItemInCart
                      Product_name={item.product_name}
                      Description={item.description}
                      Price={item.price}
                      source={{ uri: item.image_url }}
                      Quantity={item.quantity}
                      Sub_total={item.sub_total}
                      setValueQuantity={setQuantity}
                      disableDecrement={decrementDisable}
                      onChangeTextQuantity={(text) => setQuantity(text)}
                      onPressIncrement={() => incrementQuantity(item.id)}
                      onPressDecrement={() => decrementQuantity(item.id)}
                      onPressremoveCart={() => {
                        removeInCart(item.product_name);
                        onRefresh();
                      }}
                    />
                  </View>
                );
              })}
            </>
          )}

          {showGtotalCheckOut ? (
            <></>
          ) : (
            <>
              <View
                style={{
                  flexDirection: "row",
                  marginHorizontal: "2%",
                  marginTop: "2%",
                  backgroundColor: "#F9F9F9",
                  borderRadius: 5,
                  padding: "2%",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    marginHorizontal: "2%",
                    flex: 3,
                    fontSize: 19,
                    color: "#444",
                  }}
                  setValue={setGrandTotal}
                  onChangeText={(text) => setGrandTotal(text)}
                >
                  TOTAL:
                </Text>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 19,
                    fontWeight: "bold",
                    color: "#444",
                  }}
                >
                  {grandTotal}
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  alignSelf: "center",
                  backgroundColor: "#0079FF",
                  width: "95%",
                  alignItems: "center",
                  borderRadius: 5,
                  marginVertical: "3%",
                  zIndex: 2,
                }}
                onPress={() => {
                  console.log(totalQuantity);
                  mappingTotalQuantity();
                  setShowCheckOut(true);
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 20,
                    marginVertical: "3%",
                    color: "white",
                  }}
                >
                  CHECK OUT
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      {showCheckOut ? (
        <>
          <View
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              zIndex: 2,
              backgroundColor: "white",
              paddingTop: "8%",
            }}
          >
            <ScrollView>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    style={{
                      width: "10%",
                      alignItems: "center",
                      marginHorizontal: "1%",
                      justifyContent: "center",
                    }}
                    onPress={() => {
                      setShowCheckOut(false);
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "600",
                        fontSize: 14,
                      }}
                    >
                      <Entypo name="chevron-small-left" size={45} />
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ width: "100%", marginVertical: "1%" }}>
                <View>
                  <Text
                    style={{
                      marginVertical: "2%",
                      marginLeft: "3%",
                      fontSize: 20,
                      fontWeight: "600",
                    }}
                  >
                    Billing Details
                  </Text>
                </View>
                <View style={{ marginLeft: "3%" }}>
                  <Text
                    style={{ fontSize: 18, fontWeight: "400", color: "#444" }}
                  >
                    Name
                  </Text>
                </View>
                <TextInput
                  editable={false}
                  onChangeText={(text) => setFullname(text)}
                  setValue={setFullname}
                  value={personInfo[0].name}
                  placeholder="Fullname"
                  style={{
                    marginHorizontal: "3%",
                    marginBottom: "2%",
                    backgroundColor: "white",
                  }}
                  mode="outlined"
                  theme={{ colors: { text: "white", primary: "black" } }}
                />
                <View style={{ marginLeft: "3%" }}>
                  <Text
                    style={{ fontSize: 18, fontWeight: "400", color: "#444" }}
                  >
                    Contact
                  </Text>
                </View>
                <TextInput
                  editable={false}
                  onChangeText={(text) => setContactNo(text)}
                  value={personInfo[0].contact}
                  setValue={setContactNo}
                  placeholder="Contact no."
                  style={{
                    marginHorizontal: "3%",
                    marginBottom: "2%",
                    backgroundColor: "white",
                  }}
                  mode="outlined"
                  theme={{ colors: { text: "white", primary: "black" } }}
                  inputMode="numeric"
                  maxLength={11}
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  marginLeft: "2%",
                }}
              >
                <View>
                  <RadioButton
                    theme={{ colors: { text: "white", primary: "#0A6EBD" } }}
                    value="first"
                    status={checked === "first" ? "checked" : "unchecked"}
                    onPress={() => {
                      setChecked("first");
                      setDeliverPickup(false);

                      if (deliverPickup == true) {
                        setAddress("");
                        setPaymentMethod("Deliver");
                      }
                    }}
                  />
                </View>
                <View style={{ justifyContent: "center" }}>
                  <Text>Deliver</Text>
                </View>
                <View>
                  <RadioButton
                    theme={{ colors: { text: "white", primary: "#0A6EBD" } }}
                    value="second"
                    status={checked === "second" ? "checked" : "unchecked"}
                    onPress={() => {
                      setChecked("second");
                      setDeliverPickup(true);
                      if (deliverPickup == false) {
                        setAddress(
                          "3rd Floor , Dona Pacita Building beside PureGold Paniqui, Tarlac, Philippines"
                        );
                        setPaymentMethod("Pickup");
                      }
                    }}
                  />
                </View>
                <View style={{ justifyContent: "center" }}>
                  <Text>Pickup</Text>
                </View>
              </View>
              <View>
                {deliverPickup ? (
                  <>
                    <View
                      style={{
                        color: "grey",
                        borderWidth: 0.5,
                        padding: "3%",
                        borderRadius: 5,
                        backgroundColor: "#ebebeb",
                        fontWeight: "600",
                        marginHorizontal: "3%",
                      }}
                    >
                      <Text
                        style={{
                          color: "grey",
                          fontWeight: "600",
                        }}
                        mode="outlined"
                        editable={false}
                        label="Address"
                        setValue={setAddress}
                        onChangeText={(text) => setAddress(text)}
                      >
                        {address}
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View
                      style={{
                        color: "grey",
                        borderWidth: 0.5,
                        padding: "3%",
                        borderRadius: 5,
                        backgroundColor: "#ebebeb",
                        fontWeight: "600",
                        marginHorizontal: "3%",
                      }}
                    >
                      <Text
                        style={{
                          color: "grey",
                          fontWeight: "600",
                        }}
                        mode="outlined"
                        editable={false}
                        label="Address"
                        setValue={setAddress}
                        onChangeText={(text) => setAddress(text)}
                      >
                        {personInfo[0].address}
                      </Text>
                    </View>
                  </>
                )}
              </View>
              <View>
                {cart.map((item) => {
                  return (
                    <View key={item.id} style={{ borderBottomWidth: 0.5 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          width: "100%",

                          paddingVertical: "2%",
                          marginTop: "2%",
                        }}
                      >
                        <View style={{ flex: 1, marginLeft: "2%" }}>
                          <Image
                            source={{ uri: item.image_url }}
                            style={{ height: 50 }}
                          />
                        </View>
                        <View
                          style={{
                            flex: 3,
                            marginHorizontal: "5%",
                            justifyContent: "center",
                          }}
                        >
                          <Text style={{ fontWeight: "bold" }}>
                            {item.product_name}
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 3,
                            marginLeft: "2%",
                            justifyContent: "center",
                          }}
                        >
                          <Text style={{ fontWeight: "bold" }}>
                            {item.quantity} x
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 2,
                            justifyContent: "center",
                          }}
                        >
                          <Text style={{ fontWeight: "bold" }}>
                            {item.sub_total}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}

                <View>
                  <View
                    style={{
                      marginHorizontal: "2%",
                      flexDirection: "row",
                      marginVertical: "2%",
                      borderBottomWidth: 1,
                      paddingVertical: "2%",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 18,
                        flex: 1,
                      }}
                    >
                      Total:
                    </Text>

                    <Text
                      style={{
                        fontWeight: "600",
                        fontSize: 18,
                        marginHorizontal: "2%",
                      }}
                    >
                      {grandTotal}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      alignSelf: "center",
                      backgroundColor: "#0079FF",
                      width: "95%",
                      alignItems: "center",
                      borderRadius: 5,
                      marginTop: "4%",
                      marginBottom: "2%",
                    }}
                    onPress={() => {
                      placeOder();
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 20,
                        marginVertical: "3%",
                        color: "white",
                      }}
                    >
                      PLACE ORDER
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </>
      ) : (
        <></>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  root: {},
  mealcontainer: {
    alignItems: "center",
    alignSelf: "center",
    width: "98%",
    backgroundColor: "white",
    marginTop: "10%",
    padding: 10,
    borderRadius: 10,
    elevation: 10,
  },
  headertext: {
    fontSize: 30,
    color: "#444",
    fontWeight: "700",
  },
});
export default Tab5Index;
