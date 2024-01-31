import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import React, { Children } from "react";
import { DatePickerModal, es, tr } from "react-native-paper-dates";
import { Button, List } from "react-native-paper";
import { useState, useEffect, useCallback, useRef } from "react";
import { DatePickerInput } from "react-native-paper-dates";
const { width } = Dimensions.get("window");

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  IconButton,
  MD3Colors,
  TextInput,
  ActivityIndicator,
} from "react-native-paper";
import { TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import SelectDropdown from "react-native-select-dropdown";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { en, registerTranslation } from "react-native-paper-dates";
import * as Network from "expo-network";
import * as Device from "expo-device";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";

registerTranslation("en", en);

const Scheduleindex = () => {
  const router = useRouter();

  const [timeNow, setTimeNow] = useState(0);
  const [currentYear, setCurrentYear] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [currentDay, setCurrentDay] = useState(0);
  const [selectedTime, setSelectedTime] = useState("");

  const [expanded, setExpanded] = React.useState(false);
  const [dateValue, setDateValue] = React.useState(new Date());
  const [inputDate, setInputDate] = useState(new Date());
  const [username, setUsername] = useState("");
  const [reservationData, setReservationData] = useState([]);
  const [showSchedules, setShowSchedules] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [newReservationData, setNewReservationData] = useState([]);
  const [firstBatchIsDisabled, setFirstBatchIsDisabled] = useState(true);
  const [secondBatchIsDisabled, setSecondBatchIsDisabled] = useState(true);
  const [thirdBatchIsDisabled, setThirdBatchIsDisabled] = useState(true);
  const [fourthBatchIsDisabled, setFourthBatchIsDisabled] = useState(true);
  const [fifthBatchIsDisabled, setFifthBatchIsDisabled] = useState(true);
  const [lastBatchIsDisabled, setLastBatchIsDisabled] = useState(true);
  useState(true);
  const [ipAddress, setIpAdress] = useState("");
  const [refreshing, setRefreshing] = React.useState(false);
  const [coachName, setCoachName] = useState("");
  const [notes, setNotes] = useState("");
  const [timeList, setTimeList] = useState("Select Option");

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
  const userLogReservation = (username) => {
    getIpAddress(function (ipAddress) {
      fetch("https://gymerls-staging-server.vercel.app/api/insert-log", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          event_info: "Create new reservation",
          ip_address: ipAddress,
          platform: Device.osName,
        }),
      })
        .then((response) => response.json())
        .catch((error) => console.log(error));
    });
  };

  useEffect(() => {
    var formattedDate = formatDate(dateValue);
    handleMonths();
    getData(function (callback) {
      fetch(
        "https://gymerls-staging-server.vercel.app/api/get-reservation-by-username-and-date",
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
          if (filterStatus === "All") {
            setNewReservationData(data);
            reservationData.length !== 0
              ? setShowSchedules(false)
              : setShowSchedules(true);
          }
          setReservationData(data);
        });
    });
  }, [refreshing]);

  const handleOpenModalCreateReservation = () => {
    getReservationByDate(inputDate);
  };

  const createSchedule = () => {
    handleMonths();
    notes.length === 0
      ? alert("Please fill up the following fields")
      : coachName.length === 0
      ? alert("Please fill up the following fields")
      : timeList === "Select Option"
      ? alert("Please Select Option")
      : formatDate(new Date()) <= formatDate(inputDate)
      ? createReservation()
      : alert("Cannot make reservation on " + formatDate(inputDate));
  };

  const createReservation = () => {
    const selectedMonth = selectDateFormat(inputDate);
    const selectedDay = selectDayFormat(inputDate);
    const selectedYear = selectYearFormat(inputDate);

    console.log(selectedTime);
    console.log(timeNow);
    if (selectedYear >= currentYear) {
      if (selectedMonth >= currentMonth) {
        if (selectedDay == currentDay) {
          if (selectedTime >= timeNow) {
            fetch(
              "https://gymerls-staging-server.vercel.app/api/create-reservation",
              {
                method: "POST",
                headers: {
                  "Content-type": "application/json",
                },
                body: JSON.stringify({
                  username: username,
                  notes: notes,
                  reservation_date: formatDate(inputDate),
                  status: "Pending",
                  time_slot: timeList,
                  coach_name: coachName,
                  added_date: formatDate(new Date()),
                }),
              }
            )
              .then((res) => res.json())
              .then((result) => {
                userLogReservation(username);
                cancelFunctionSchedule();
                alert("Create Reservation Complete");
              });
          } else {
            alert("Please select valid time");
          }
        } else if (selectedDay > currentDay) {
          fetch(
            "https://gymerls-staging-server.vercel.app/api/create-reservation",
            {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({
                username: username,
                notes: notes,
                reservation_date: formatDate(inputDate),
                status: "Pending",
                time_slot: timeList,
                coach_name: coachName,
                added_date: formatDate(new Date()),
              }),
            }
          )
            .then((res) => res.json())
            .then((result) => {
              userLogReservation(username);
              cancelFunctionSchedule();
              alert("Create Reservation Complete");
            });
        }
      } else {
        alert("Please select valid date");
      }
    } else {
      alert("Please select valid date");
    }
  };

  const getReservationByDate = () => {
    var formattedDate = formatDate(inputDate);
    fetch(
      "https://gymerls-staging-server.vercel.app/api/get-reservation-by-date-and-status-is-confirmed",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          reservation_date: formattedDate,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        var first_batch = [];
        var second_batch = [];
        var third_batch = [];
        var fourth_batch = [];
        var fifth_batch = [];
        var last_batch = [];

        for (let item of data) {
          if (item.time_slot === "7-9AM") {
            first_batch.push(item);
          } else if (item.time_slot === "9-11AM") {
            second_batch.push(item);
          } else if (item.time_slot === "1-3PM") {
            third_batch.push(item);
          } else if (item.time_slot === "3-5PM") {
            fourth_batch.push(item);
          } else if (item.time_slot === "5-7PM") {
            fifth_batch.push(item);
          } else {
            last_batch.push(item);
          }
        }

        first_batch.length === 3
          ? setFirstBatchIsDisabled(true)
          : setFirstBatchIsDisabled(false);

        second_batch.length === 3
          ? setSecondBatchIsDisabled(true)
          : setSecondBatchIsDisabled(false);

        third_batch.length === 3
          ? setThirdBatchIsDisabled(true)
          : setThirdBatchIsDisabled(false);

        fourth_batch.length === 3
          ? setFourthBatchIsDisabled(true)
          : setFourthBatchIsDisabled(false);

        fifth_batch.length === 3
          ? setFifthBatchIsDisabled(true)
          : setFifthBatchIsDisabled(false);

        last_batch.length === 3
          ? setLastBatchIsDisabled(true)
          : setLastBatchIsDisabled(false);
      });
  };

  const handleMonths = () => {
    const currentMonth = currentMonthFormat(new Date());
    const currentDay = currentDayFormat(new Date());
    const currentYear = currentYearFormat(new Date());

    setCurrentYear(currentYear);
    setCurrentMonth(currentMonth);
    setCurrentDay(currentDay);

    var currentDate = new Date();
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();
    const timeNows = hours + (minutes < 10 ? "0" : "") + minutes;

    // console.log(timeNows);
    console.log(new Date());
    console.log(currentDate.getMinutes());
    let validTime = 0;
    if (timeNows >= 700 && timeNows < 900) {
      validTime = 1;
    } else if (timeNows >= 901 && timeNows < 1100) {
      validTime = 2;
    } else if (timeNows >= 1101 && timeNows < 1300) {
      validTime = 3;
    } else if (timeNows >= 1301 && timeNows < 1500) {
      validTime = 3;
    } else if (timeNows >= 1501 && timeNows < 1700) {
      validTime = 4;
    } else if (timeNows >= 1701 && timeNows < 1900) {
      validTime = 5;
    } else if (timeNows >= 1901 && timeNows < 2359) {
      validTime = 6;
    }
    console.log(validTime);
    setTimeNow(validTime);
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

  const currentYearFormat = (date) => {
    var dateToFormat = new Date(date);
    var year = dateToFormat.toLocaleString("default", { year: "numeric" });
    var month = dateToFormat.toLocaleString("default", { month: "numeric" });
    var day = dateToFormat.toLocaleString("default", { day: "numeric" });

    var formattedDate = year;
    return formattedDate;
  };

  const currentMonthFormat = (date) => {
    var dateToFormat = new Date(date);
    var year = dateToFormat.toLocaleString("default", { year: "numeric" });
    var month = dateToFormat.toLocaleString("default", { month: "numeric" });
    var day = dateToFormat.toLocaleString("default", { day: "2-digit" });

    var formattedDate = month;
    return formattedDate;
  };

  const currentDayFormat = (date) => {
    var dateToFormat = new Date(date);
    var year = dateToFormat.toLocaleString("default", { year: "numeric" });
    var month = dateToFormat.toLocaleString("default", { month: "numeric" });
    var day = dateToFormat.toLocaleString("default", { day: "numeric" });

    var formattedDate = day;
    return formattedDate;
  };

  const selectDayFormat = (date) => {
    var dateToFormat = new Date(date);
    var year = dateToFormat.toLocaleString("default", { year: "numeric" });
    var month = dateToFormat.toLocaleString("default", { month: "numeric" });
    var day = dateToFormat.toLocaleString("default", { day: "numeric" });

    var formattedDate = day;
    return formattedDate;
  };

  const selectDateFormat = (date) => {
    var dateToFormat = new Date(date);
    var year = dateToFormat.toLocaleString("default", { year: "numeric" });
    var month = dateToFormat.toLocaleString("default", { month: "numeric" });
    var day = dateToFormat.toLocaleString("default", { day: "2-digit" });

    var formattedDate = month;
    return formattedDate;
  };

  const selectYearFormat = (date) => {
    var dateToFormat = new Date(date);
    var year = dateToFormat.toLocaleString("default", { year: "numeric" });
    var month = dateToFormat.toLocaleString("default", { month: "numeric" });
    var day = dateToFormat.toLocaleString("default", { day: "2-digit" });

    var formattedDate = year;
    return formattedDate;
  };

  const cancelFunctionSchedule = () => {
    router.back();
    setTimeList("Select Option");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <KeyboardAvoidingView style={styles.form}>
        <View>
          <View>
            <View style={{ marginHorizontal: "3%" }}>
              <Text style={{ fontSize: 18 }}>CREATE NEW RESERVATION</Text>
            </View>
            <View style={{ marginHorizontal: "3%" }}>
              <Text style={{ color: "grey" }}>Fill up all fields</Text>
            </View>

            <DatePickerInput
              locale="en"
              style={{
                marginHorizontal: "2%",
                marginVertical: "1%",
                backgroundColor: "white",
              }}
              value={inputDate}
              onConfirm={handleOpenModalCreateReservation()}
              onChange={(d) => {
                handleMonths();
                setTimeList("Select Option");
                setInputDate(d);
              }}
              inputMode="start"
              mode="outlined"
            />

            <TextInput
              onChangeText={(t) => {
                handleMonths();
                setNotes(t);
              }}
              setValue={setNotes}
              style={{
                marginHorizontal: "2%",
                marginVertical: "1%",
                backgroundColor: "white",
              }}
              label="Note*"
              mode="outlined"
              theme={{ colors: { text: "white", primary: "black" } }}
            />
            <View>
              <Text
                style={{
                  marginHorizontal: "2%",
                  fontSize: 12,
                  color: "grey",
                  width: "100%",
                }}
              >
                Please select time slot
              </Text>
              <List.Accordion
                onChange={() => {
                  handleMonths();
                }}
                titleStyle={{ fontWeight: "600" }}
                title={timeList}
                expanded={expanded}
                onPress={() => {
                  expanded === true ? setExpanded(false) : setExpanded(true);
                  if (expanded === true) {
                    setExpanded(false);
                    handleMonths();
                  } else {
                    setExpanded(true);
                    handleMonths();
                  }
                }}
                theme={{ colors: { text: "white", primary: "black" } }}
                style={{
                  marginVertical: "1%",
                  borderRadius: 5,
                  borderWidth: 0.5,
                  width: "95%",
                  alignSelf: "center",
                  backgroundColor: "#fff",
                  zIndex: 10,
                }}
              >
                <View
                  style={{
                    borderWidth: 0.5,
                    borderRadius: 5,
                    width: "95%",
                    alignSelf: "center",
                    backgroundColor: "white",
                    zIndex: 10,
                  }}
                >
                  <List.Item
                    titleStyle={[
                      styles.listItem,
                      firstBatchIsDisabled === true
                        ? styles.listItemDisabled
                        : styles.listItem,
                    ]}
                    disabled={firstBatchIsDisabled}
                    style={{ height: 45, zIndex: 200 }}
                    title="7-9AM"
                    onPress={() => {
                      setTimeList("7-9AM");
                      setSelectedTime(1);
                      handleMonths();
                      setExpanded(false);
                    }}
                  />

                  <List.Item
                    titleStyle={[
                      styles.listItem,
                      secondBatchIsDisabled === true
                        ? styles.listItemDisabled
                        : styles.listItem,
                    ]}
                    disabled={secondBatchIsDisabled}
                    style={{ height: 45 }}
                    title="9-11AM"
                    onPress={() => {
                      setTimeList("9-11AM");
                      setSelectedTime(2);
                      setExpanded(false);
                      handleMonths();
                    }}
                  />
                  <List.Item
                    titleStyle={[
                      styles.listItem,
                      thirdBatchIsDisabled === true
                        ? styles.listItemDisabled
                        : styles.listItem,
                    ]}
                    disabled={thirdBatchIsDisabled}
                    style={{ height: 45 }}
                    title="1-3PM"
                    onPress={() => {
                      setTimeList("1-3PM");
                      setSelectedTime(3);
                      handleMonths();
                      setExpanded(false);
                    }}
                  />
                  <List.Item
                    titleStyle={[
                      styles.listItem,
                      fourthBatchIsDisabled === true
                        ? styles.listItemDisabled
                        : styles.listItem,
                    ]}
                    disabled={fourthBatchIsDisabled}
                    style={{ height: 45 }}
                    title="3-5PM"
                    onPress={() => {
                      setTimeList("3-5PM");
                      setSelectedTime(4);
                      handleMonths();
                      setExpanded(false);
                    }}
                  />
                  <List.Item
                    titleStyle={[
                      styles.listItem,
                      fifthBatchIsDisabled === true
                        ? styles.listItemDisabled
                        : styles.listItem,
                    ]}
                    disabled={fifthBatchIsDisabled}
                    style={{ height: 45 }}
                    title="5-7PM"
                    onPress={() => {
                      setTimeList("5-7PM");
                      setSelectedTime(5);
                      handleMonths();
                      setExpanded(false);
                    }}
                  />
                  <List.Item
                    titleStyle={[
                      styles.listItem,
                      lastBatchIsDisabled === true
                        ? styles.listItemDisabled
                        : styles.listItem,
                    ]}
                    disabled={lastBatchIsDisabled}
                    style={{ height: 45 }}
                    title="7-9PM"
                    onPress={() => {
                      setTimeList("7-9PM");
                      setSelectedTime(6);
                      handleMonths();
                      setExpanded(false);
                    }}
                  />
                </View>
              </List.Accordion>
            </View>

            <TextInput
              label="Coach*"
              mode="outlined"
              onChangeText={(text) => {
                handleMonths();
                setCoachName(text);
              }}
              setValue={setCoachName}
              style={{
                width: "95%",
                alignSelf: "center",
                backgroundColor: "white",
                zIndex: -2,
              }}
              theme={{ colors: { text: "white", primary: "black" } }}
            />
            <View
              style={{
                flexDirection: "row",
                zIndex: -10,
                marginVertical: "2%",
              }}
            >
              <View
                style={{
                  flex: 1,
                  marginVertical: "2%",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    cancelFunctionSchedule();
                  }}
                >
                  <Text style={{ fontWeight: "600", color: "#444" }}>
                    CANCEL
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 1,
                  marginVertical: "2%",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity onPress={createSchedule}>
                  <Text style={{ fontWeight: "600", color: "#444" }}>
                    CREATE
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};
const styles = StyleSheet.create({
  root: {},
  form: {
    alignSelf: "center",
    zIndex: 2,
    backgroundColor: "white",
    width: "95%",
    padding: "2%",
    borderRadius: 10,
    elevation: 600,
  },
  listItem: { fontSize: 12, fontWeight: "800", zIndex: 10 },
  listItemDisabled: {
    fontSize: 12,
    fontWeight: "800",
    color: "grey",
    zIndex: 10,
  },
});
export default Scheduleindex;
