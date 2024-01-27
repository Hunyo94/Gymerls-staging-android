import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
  KeyboardAvoidingView,
} from "react-native";
import React from "react";
import { DatePickerModal, es, tr } from "react-native-paper-dates";
import { Button, List } from "react-native-paper";
import { useState, useEffect, useCallback, useRef } from "react";
const { width } = Dimensions.get("window");

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Entypo } from "@expo/vector-icons";
import SelectDropdown from "react-native-select-dropdown";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { en, registerTranslation } from "react-native-paper-dates";
import { useRouter } from "expo-router";

registerTranslation("en", en);

const index = () => {
  const router = useRouter();

  const [expanded, setExpanded] = React.useState(false);
  const [dateValue, setDateValue] = React.useState(new Date());
  const [openCalendar, setOpenCalendar] = React.useState(false);
  const [inputDate, setInputDate] = React.useState(new Date());
  const [username, setUsername] = useState("");
  const [reservationData, setReservationData] = useState([]);
  const [showAddNewReserve, setAddNewReserve] = useState(false);
  const [showSchedules, setShowSchedules] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [newReservationData, setNewReservationData] = useState([]);
  const [membershipType, setMembershipType] = useState("");
  const [showSchedByMemberTypeShip, setShowSchedByMemberTypeShip] =
    useState(true);
  const [ipAddress, setIpAdress] = useState("");
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const onDismissSingle = React.useCallback(() => {
    onFilterStatus();
    onRefresh();
    setOpenCalendar(false);
  }, [setOpenCalendar]);

  const onConfirmSingle = React.useCallback(
    (params) => {
      onFilterStatus();
      onRefresh();
      setOpenCalendar(false);
      setDateValue(params.date);
    },
    [setOpenCalendar, setDateValue]
  );
  const setterFilterOptions = [
    "All",
    "Pending",
    "Confirmed",
    "Cancelled",
    "Declined",
    "Completed",
  ];

  const getUserData = async (membership_type) => {
    try {
      const value = await AsyncStorage.getItem("username");
      if (value !== null) {
        setMembershipType(value);
        membership_type(value);
      } else {
      }
    } catch (e) {}
  };

  useEffect(() => {
    var formattedDate = formatDate(dateValue);

    getUserData(function (membership_type) {
      fetch("http://192.168.100.243:3031/api/get-user-by-username", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: membership_type,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          res[0].membership_type !== "Premium"
            ? setShowSchedByMemberTypeShip(false)
            : setShowSchedByMemberTypeShip(true);
        });
    });

    getData(function (callback) {
      fetch(
        "http://192.168.100.243:3031/api/get-reservation-by-username-and-date",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            username: callback,
            reservation_date: formattedDate,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setReservationData(data);
          if (filterStatus == "All") {
            setNewReservationData(data);
            if (data.length != []) {
              setShowSchedules(false);
            }
          }
        });
    });
  }, [refreshing]);

  const onFilterStatus = (selectedItem) => {
    const newData = reservationData.filter((item) => {
      return item.status == selectedItem;
    });
    if (newData.length == []) {
      setNewReservationData(reservationData);
    } else {
    }
    if (selectedItem == "All") {
      setNewReservationData(reservationData);
      if (reservationData.length == []) {
        setShowSchedules(true);
      } else {
        setShowSchedules(false);
      }
    } else {
      setNewReservationData(newData);
      if (newData.length == []) {
        setShowSchedules(true);
      } else {
        setShowSchedules(false);
      }
    }
  };

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

  const formatDate = (date) => {
    var dateToFormat = new Date(date);
    var year = dateToFormat.toLocaleString("default", { year: "numeric" });
    var month = dateToFormat.toLocaleString("default", { month: "2-digit" });
    var day = dateToFormat.toLocaleString("default", { day: "2-digit" });

    var formattedDate = year + "-" + month + "-" + day;
    return formattedDate;
  };

  var dateFIlter = formatDate(dateValue);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.mealcontainer}>
          <Text style={styles.headertext}>SCHEDULE</Text>
        </View>
        {showSchedByMemberTypeShip ? (
          <>
            <View
              style={{
                justifyContent: "center",
                flex: 1,
                alignItems: "center",
              }}
            >
              <DatePickerModal
                locale="en"
                mode="single"
                visible={openCalendar}
                onDismiss={onDismissSingle}
                date={dateValue}
                onConfirm={onConfirmSingle}
              />
            </View>
            <View
              style={{
                marginVertical: "2%",
                backgroundColor: "#fff",
                paddingVertical: "2%",
              }}
            >
              <ScrollView
                horizontal={true}
                style={{
                  flexDirection: "row",
                  backgroundColor: "white",
                }}
              >
                <View style={{ paddingRight: "3%", width: 150 }}>
                  <Button
                    style={{
                      backgroundColor: "white",
                      borderWidth: 1,
                      borderColor: "grey",
                    }}
                    mode="outlined"
                    icon="plus"
                    textColor="black"
                    size={28}
                    onPress={() => {
                      router.push("/(tabs)/Schedule/reservation");
                    }}
                  >
                    Schedules
                  </Button>
                </View>
                <View style={{ paddingRight: "3%", width: 170 }}>
                  <Button
                    style={{
                      backgroundColor: "white",
                      borderWidth: 1,
                      borderColor: "grey",
                    }}
                    mode="outlined"
                    textColor="black"
                    backgroundColor="white"
                    icon="calendar"
                    size={24}
                    onPress={() => setOpenCalendar(true)}
                  >
                    {dateFIlter}
                  </Button>
                </View>
                <View style={{ paddingRight: "3%" }}>
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
                    defaultValueByIndex={0}
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
                    rowTextStyle={styles.dropdown1RowTxtStyle}
                  />
                </View>
              </ScrollView>
            </View>
            <View
              style={{
                borderRadius: 5,
                width: "100%",
                alignSelf: "center",
                marginTop: "2%",
              }}
            >
              {showSchedules ? (
                <>
                  <View
                    style={{
                      alignItems: "center",
                      marginTop: "20%",
                    }}
                  >
                    <Text
                      style={{
                        color: "grey",
                        fontWeight: "bold",
                      }}
                    >
                      scroll down to reload..
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "grey",
                      }}
                    >
                      No data to show/.
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <View>
                    {newReservationData.map((res) => {
                      return (
                        <View key={res.id} style={{ paddingTop: "2%" }}>
                          <View
                            style={{
                              width: "90%",
                              flexDirection: "row",
                              alignSelf: "center",
                              marginBottom: "5%",
                            }}
                          >
                            <View
                              style={{
                                flex: 1,
                                elevation: 10,
                                backgroundColor: "#1687A7",
                                padding: "3%",
                                borderBottomLeftRadius: 10,
                                borderTopLeftRadius: 10,
                                justifyContent: "center",
                              }}
                            >
                              <Text
                                style={{
                                  fontWeight: "700",
                                  fontSize: 30,
                                  color: "#FEFCF3",
                                  alignSelf: "center",
                                }}
                              >
                                {res.reservation_date.slice(8, 10)}
                              </Text>
                              <Text
                                style={{
                                  fontWeight: "500",
                                  fontSize: 10,
                                  color: "#ffff",
                                  alignSelf: "center",
                                }}
                              >
                                {res.reservation_date.slice(0, 7)}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 10,
                                  color: "#444",
                                  alignSelf: "center",
                                  fontWeight: "700",
                                }}
                              >
                                {res.time_slot}
                              </Text>
                            </View>
                            <View
                              style={{
                                elevation: 10,
                                flex: 4,
                                padding: "2%",
                                backgroundColor: "#FFFFFF",
                                flexDirection: "column",
                              }}
                            >
                              <View
                                style={{ flex: 4, justifyContent: "center" }}
                              >
                                <Text
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: 14,
                                    margin: "2%",
                                  }}
                                >
                                  {res.notes}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flex: 1,
                                  borderTopWidth: 1,
                                  borderColor: "grey",
                                  justifyContent: "center",
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 12,
                                    fontWeight: "600",
                                    color: "#444",
                                  }}
                                >
                                  {res.coach_name}
                                </Text>
                              </View>
                            </View>
                            <View
                              style={[
                                res.status,
                                res.status === "Pending"
                                  ? styles.pending
                                  : res.status === "Confirmed"
                                  ? styles.confirmed
                                  : res.status === "Cancelled"
                                  ? styles.cancelled
                                  : res.status === "Completed"
                                  ? styles.completed
                                  : styles.declined,
                              ]}
                            >
                              <Text
                                style={{
                                  alignSelf: "center",
                                  color: "#ffff",
                                  fontFamily: "EncodeSansSemiCondensed_700Bold",
                                  letterSpacing: 1,
                                }}
                              >
                                {res.status}
                              </Text>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </>
              )}
            </View>
          </>
        ) : (
          <>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginVertical: "20%",
              }}
            >
              <Text
                style={{
                  fontFamily: "EncodeSansSemiCondensed_700Bold",
                  fontSize: 18,
                  color: "grey",
                }}
              >
                Upgrade to premium now!
              </Text>
            </View>
          </>
        )}
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
    padding: 10,
    borderRadius: 10,
    elevation: 10,
  },
  headertext: {
    fontSize: 30,
    color: "#444",
    fontWeight: "700",
  },
  pending: {
    backgroundColor: "#ed6c02",
    flex: 2,
    justifyContent: "center",
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    elevation: 10,
  },
  confirmed: {
    flex: 2,
    justifyContent: "center",
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "#2e7d32",
    elevation: 10,
  },
  completed: {
    backgroundColor: "#1976d2",
    flex: 2,
    justifyContent: "center",
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    elevation: 10,
  },
  cancelled: {
    flex: 2,
    justifyContent: "center",
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "#d32f2f",
    elevation: 10,
  },
  declined: {
    flex: 2,
    justifyContent: "center",
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "#9c27b0",
    elevation: 10,
  },
  listItem: { fontSize: 12, fontWeight: "800", zIndex: 10 },
  listItemDisabled: {
    fontSize: 12,
    fontWeight: "800",
    color: "grey",
    zIndex: 10,
  },

  dropdown1BtnStyle: {
    width: 150,
    height: 43,
    backgroundColor: "#FFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "grey",
  },
  dropdown1BtnTxtStyle: {
    color: "black",
    textAlign: "left",
    fontSize: 15,
    fontWeight: "500",
  },
  dropdown1DropdownStyle: {
    backgroundColor: "white",
    borderRadius: 5,
    width: 150,
  },

  dropdown1RowTxtStyle: { color: "#444", textAlign: "left", fontWeight: "500" },
  form: {
    zIndex: 2,
  },
});
export default index;
