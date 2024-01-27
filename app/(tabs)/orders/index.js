import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from "react-native";
import React, { useRef } from "react";
import { ScrollView, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthStore } from "../../../store";
import { useState, useEffect } from "react";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import SelectDropdown from "react-native-select-dropdown";
import CustomSeeReceipt from "../../(Component)/Receipt/CustomSeeReceipt";

const { width } = Dimensions.get("window");

const orders = () => {
  const [username, setUsername] = useState("");
  const [transaction, setTransaction] = useState([]);
  const [transactShow, setTransactShow] = useState(true);
  const [filterStatus, setFilterStatus] = useState([]);
  const [cities, setCities] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [filteredTransaction, setFilteredTransaction] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const formatDate = (date) => {
    var dateToFormat = new Date(date);
    var year = dateToFormat.toLocaleString("default", { year: "numeric" });
    var month = dateToFormat.toLocaleString("default", { month: "2-digit" });
    var day = dateToFormat.toLocaleString("default", { day: "2-digit" });

    var formattedDate = year + "-" + month + "-" + day;
    return formattedDate;
  };

  const setterFilterOptions = ["All", "Pending", "Completed"];
  useEffect(() => {
    storeDataPass(function (callback) {
      fetch("http://192.168.100.243:3031/api/get-transaction-by-username", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: callback,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.length == []) {
            setTransactShow(true);
          } else {
            setTransactShow(false);
            setFilterStatus("All");
            if (filterStatus == "All") {
              setFilteredTransaction(data);
            } else {
              setTransaction(data);
            }
          }
        });
    });
  }, [refreshing, transaction]);
  const storeDataPass = async (callback) => {
    AuthStore.update((s) => {
      s.isLoggedIn = false;
    });
    const valueUsername = await AsyncStorage.getItem("username");
    try {
      callback(valueUsername);
      setUsername(valueUsername);
      return true;
    } catch (exception) {
      return false;
    }
  };

  const onFilterStatus = (selectedItem) => {
    const newData = transaction.filter((item) => {
      return item.status === selectedItem;
    });
    if (selectedItem == "All") {
      onRefresh();
    }
    setFilteredTransaction(newData);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.mealcontainer}>
        <Text style={styles.headertext}>ORDERS</Text>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{
          borderRadius: 5,
          width: "98%",
          alignSelf: "center",
        }}
      >
        <SelectDropdown
          data={setterFilterOptions}
          onSelect={(selectedItem, index) => {
            setFilterStatus(selectedItem);
            onFilterStatus(selectedItem);
          }}
          defaultButtonText={"All"}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
          buttonStyle={styles.dropdown1BtnStyle}
          buttonTextStyle={styles.dropdown1BtnTxtStyle}
          renderDropdownIcon={(isOpened) => {
            return (
              <FontAwesome
                name={isOpened ? "chevron-up" : "chevron-down"}
                color={"#444"}
                size={18}
              />
            );
          }}
          dropdownIconPosition={"right"}
          dropdownStyle={styles.dropdown1DropdownStyle}
          rowStyle={styles.dropdown1RowStyle}
          rowTextStyle={styles.dropdown1RowTxtStyle}
        />
        <View style={styles.divider} />

        <View style={{}}>
          {transactShow ? (
            <>
              <View style={{ alignItems: "center", padding: "20%" }}>
                <Text style={{ fontWeight: "500", color: "grey" }}>
                  No data available/.
                </Text>
              </View>
            </>
          ) : (
            <>
              {filteredTransaction.map((trans) => {
                return (
                  <View key={trans.id} style={{}}>
                    <View style={{}}>
                      <View
                        style={{
                          width: "90%",
                          flexDirection: "row",
                          alignSelf: "center",
                          marginTop: "2%",
                          borderRadius: 10,
                          padding: "2%",
                          backgroundColor: "#fff",
                          elevation: 5,
                          borderWidth: 0.5,
                          borderColor: "#444",
                        }}
                      >
                        <View
                          style={{
                            width: "90%",
                            flex: 3,
                            padding: "2%",
                          }}
                        >
                          <Text
                            style={{ marginVertical: "1%", fontWeight: "400" }}
                          >
                            <Ionicons name="person" size={16} color="#444" />{" "}
                            {trans.fullname}
                          </Text>
                          <Text
                            style={{
                              fontWeight: "600",
                              marginVertical: "1%",
                              fontSize: 16,
                            }}
                          >
                            {trans.items}
                          </Text>

                          <Text
                            style={{
                              marginVertical: "1%",
                              fontSize: 16,
                            }}
                          >
                            <Text style={{ fontSize: 14 }}>₱</Text>{" "}
                            {trans.total}
                          </Text>

                          <Text
                            style={{
                              fontWeight: "600",
                              marginVertical: "1%",
                              color: "grey",
                            }}
                          >
                            <MaterialCommunityIcons
                              name={
                                trans.method === "Deliver"
                                  ? "truck-delivery-outline"
                                  : "handshake-outline"
                              }
                              size={16}
                              color="black"
                            />{" "}
                            {trans.method}
                          </Text>
                          <Text
                            style={{
                              fontWeight: "400",
                              color: "grey",
                              padding: "2%",
                              backgroundColor: "#ebebeb",
                              borderRadius: 2,
                            }}
                          >
                            <Entypo name="address" size={16} color="#444" />{" "}
                            {trans.address}
                          </Text>
                          <View>
                            <CustomSeeReceipt
                              receipt={trans.receipt_url}
                              Status={trans.status}
                            />
                          </View>
                        </View>
                        <View
                          style={{
                            flex: 1,
                          }}
                        >
                          <View
                            style={[
                              styles.status,

                              trans.status === "Pending"
                                ? styles.pending
                                : trans.status === "Out-Of-Stock"
                                ? styles.outofstock
                                : styles.confirmed,
                            ]}
                          >
                            <Text
                              style={{
                                fontWeight: "600",
                                color: "white",
                                fontSize: 12,
                              }}
                            >
                              {trans.status}
                            </Text>
                          </View>
                          <Text
                            style={{
                              fontWeight: "400",
                              marginVertical: "1%",
                              fontSize: 13,
                              alignSelf: "center",
                            }}
                          >
                            {formatDate(trans.transaction_date)}
                          </Text>
                          <Text
                            style={{
                              fontWeight: "400",
                              marginVertical: "1%",
                              fontSize: 13,
                              alignSelf: "center",
                            }}
                          >
                            Products - {trans.total_quantity}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </>
          )}
        </View>
      </ScrollView>
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
    marginBottom: "2%",
    padding: 10,
    borderRadius: 10,
    elevation: 10,
  },
  headertext: {
    fontSize: 30,
    color: "#444",
    fontWeight: "700",
  },
  status: {
    alignItems: "center",
    borderRadius: 5,
  },
  pending: {
    padding: "4%",
    borderRadius: 5,
    backgroundColor: "#ed6c02",
  },
  confirmed: {
    padding: "4%",
    backgroundColor: "#2e7d32",
    borderRadius: 5,
  },
  outofstock: {
    padding: "4%",
    backgroundColor: "#d32f2f",
    borderRadius: 5,
  },

  dropdown1BtnStyle: {
    width: 134,
    height: 43,
    backgroundColor: "#FFF",
    borderRadius: 20,
    borderWidth: 0.5,
    alignSelf: "flex-end",
    marginHorizontal: "3%",
    borderColor: "#444",
    elevation: 10,
    marginVertical: "2%",
  },
  dropdown1BtnTxtStyle: {
    color: "black",
    textAlign: "left",
    fontSize: 15,
    fontWeight: "500",
  },
  dropdown1DropdownStyle: {
    backgroundColor: "#fff",
    padding: "2%",
    borderRadius: 10,
    alignSelf: "center",
  },

  dropdown1RowTxtStyle: {
    color: "#444",
    textAlign: "right",
    fontWeight: "500",
  },
});

export default orders;
