import { useRouter } from "expo-router";
import { View, Text, StyleSheet, Image } from "react-native";
import Guyjumpingrope3 from "../../../assets/images/Guyjumpingrope3.png";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Link } from "expo-router";

const Tab1Index = () => {
  const router = useRouter();
  const [mealPlanning, setMealPlanning] = useState([]);
  const [username, setUsername] = useState("");
  const [newReservationData, setNewReservationData] = useState([]);
  const [showSchedToday, setShowSchedToday] = useState(true);
  const [membershipEnd, setMembershipEnd] = useState();
  const [showWarningMemberShipEnd, setShowWarningMemberShipEnd] =
    useState(false);

  const formatDate = (date) => {
    var dateToFormat = new Date(date);
    var year = dateToFormat.toLocaleString("default", { year: "numeric" });
    var month = dateToFormat.toLocaleString("default", { month: "2-digit" });
    var day = dateToFormat.toLocaleString("default", { day: "2-digit" });
    var formattedDate = year + "-" + month + "-" + day;
    return formattedDate;
  };

  const getDaysDifference = (end_date) => {
    var date1 = new Date(formatDate(new Date()));
    var date2 = new Date(formatDate(end_date));

    // To calculate the time difference of two dates
    var Difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    var result = Difference_In_Time / (1000 * 3600 * 24);

    //the final no. of days (result)
    setMembershipEnd(result);
  };

  const membershipEndNotfi = () => {
    if (membershipEnd <= 10) {
      setShowWarningMemberShipEnd(true);
    } else {
      setShowWarningMemberShipEnd(false);
    }
  };

  const welcomeTypes = ["Good morning", "Good afternoon", "Good evening"];
  const [greetings, setGreetings] = useState("");
  const hour = new Date().getHours();

  const greetingsFunction = () => {
    if (hour < 12) setGreetings(welcomeTypes[0]);
    else if (hour < 18) setGreetings(welcomeTypes[1]);
    else setGreetings(welcomeTypes[2]);
  };

  useEffect(() => {
    getData(function (callback) {
      fetch("http://192.168.100.243:3031/api/meal-plan", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: callback,
        }),
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (meals) {
          setMealPlanning(meals);
        });
    });
  }, [newReservationData]);

  useEffect(() => {
    getDataByEnd(function (callback) {
      fetch("http://192.168.100.243:3031/api/get-user-by-username", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: callback,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          greetingsFunction();
          membershipEndNotfi();
          getDaysDifference(result[0].mem_end_date);
        });
    });
  }, [membershipEnd]);

  useEffect(() => {
    getAnnouncement();

    const formattedDate = formatDate(new Date());
    getDataSchedules(function (callback) {
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
        .then((res) => res.json())
        .then((result) => {
          setNewReservationData(result);
          newReservationData.length !== 0
            ? setShowSchedToday(true)
            : setShowSchedToday(false);
        });
    });
  }, [newReservationData]);

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
  const getDataByEnd = async (callback) => {
    try {
      const value = await AsyncStorage.getItem("username");
      if (value !== null) {
        setUsername(value);
        callback(value);
      } else {
      }
    } catch (e) {}
  };
  const getDataSchedules = async (sched) => {
    try {
      const value = await AsyncStorage.getItem("username");
      if (value !== null) {
        setUsername(value);
        sched(value);
      } else {
      }
    } catch (e) {}
  };

  const [showAnnouncement, setShowAnnouncements] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const getAnnouncement = () => {
    fetch("http://192.168.100.243:3031/api/get-all-announcement", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAnnouncements(data);
      });
  };

  return (
    <View>
      <ScrollView style={{ width: "100%" }}>
        <View>
          <View style={styles.container}>
            <View style={styles.textcontainer}>
              <Text style={styles.textuser}>
                {greetings} {username} !
              </Text>
              <View style={styles.container}></View>
            </View>
            <View style={styles.togglebutton}>
              <TouchableOpacity
                onPress={() => {
                  router.push("/(tabs)/home/profile");
                }}
              >
                <View style={styles.icon}>
                  <MaterialCommunityIcons
                    name="account-circle"
                    size={44}
                    color="#444"
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <View style={styles.sectioncontainer}>
              <View style={styles.sectiontextcontainer}>
                <Text style={styles.sectiontext}>
                  Today is Great Day to be fit!
                </Text>
              </View>
              <View style={styles.personcontainer}>
                <Image source={Guyjumpingrope3} style={styles.jumpingrope} />
              </View>
            </View>
          </View>
        </View>
        {showWarningMemberShipEnd ? (
          <>
            <View
              style={{
                borderColor: "red",
                borderWidth: 0.5,
                margin: "1%",
                backgroundColor: "rgba(225, 0, 0, 0.2)",
                padding: "1%",
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: "red" }}>WARNING</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: "flex-end",
                    paddingRight: "1%",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setShowWarningMemberShipEnd(false);
                    }}
                  >
                    <Entypo name="cross" size={18} color="#444" />
                  </TouchableOpacity>
                </View>
              </View>
              <Text>
                Your account is about to expire in {membershipEnd} day(s).
              </Text>
              <Text style={{ fontWeight: "600" }}>
                Please contact the administrator!
              </Text>
            </View>
          </>
        ) : (
          <></>
        )}
        <View
          style={{
            backgroundColor: "#fff",
            marginHorizontal: "3%",
            marginTop: "1%",
            borderRadius: 5,
          }}
        >
          <View
            style={{
              borderRadius: 5,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                showAnnouncement == true
                  ? setShowAnnouncements(false)
                  : setShowAnnouncements(true);
              }}
              style={{
                backgroundColor: "white",
                padding: "3%",
                borderRadius: 5,

                elevation: 5,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: "EncodeSansSemiCondensed_700Bold",
                      color: "#444",
                    }}
                  >
                    <Entypo name="megaphone" size={24} color="#444" />{" "}
                    Announcements!
                  </Text>
                </View>
                <View style={{ justifyContent: "center" }}>
                  <MaterialIcons
                    name={
                      showAnnouncement == false
                        ? "keyboard-arrow-right"
                        : "keyboard-arrow-down"
                    }
                    size={26}
                    color="#444"
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          {showAnnouncement ? (
            <>
              {announcements.map((annouce) => {
                return (
                  <View
                    key={annouce.id}
                    style={{
                      marginVertical: "2%",
                      borderRadius: 5,
                      padding: "2%",
                      marginHorizontal: "2%",
                      borderWidth: 0.5,
                      borderColor: "#444",
                      borderRadius: 5,
                    }}
                  >
                    <View style={{ marginHorizontal: "2%" }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "500",
                          color: "#444",
                        }}
                      >
                        {annouce.title}
                      </Text>
                    </View>
                    <View style={{ padding: "2%" }}>
                      <Text style={{ color: "#444" }}>
                        {" "}
                        {annouce.description}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        borderTopWidth: 0.5,
                        borderColor: "#444",
                        marginTop: "1%",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "1%",
                      }}
                    >
                      <View style={{ flex: 4 }}>
                        <Text style={{ fontWeight: "500", fontSize: 12 }}>
                          {formatDate(annouce.event_date)}
                        </Text>
                      </View>
                      <View style={{ flex: 4 }}>
                        <Text
                          style={{
                            fontWeight: "500",
                            fontSize: 12,
                          }}
                        >
                          {annouce.event_time}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </>
          ) : (
            <></>
          )}
        </View>
        <View>
          <View
            style={{
              marginHorizontal: "3%",
              borderRadius: 5,
              paddingTop: "2%",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontFamily: "EncodeSansSemiCondensed_700Bold",
                backgroundColor: "white",
                padding: "3%",
                borderRadius: 5,
                marginBottom: "2%",
                color: "#444",
                elevation: 5,
                textAlignVertical: "center",
              }}
            >
              <MaterialIcons name="schedule" size={26} color="#444" /> Todays
              Schedules!
            </Text>
          </View>

          <View>
            {showSchedToday ? (
              <>
                <View
                  style={{
                    backgroundColor: "white",
                    width: "95%",
                    borderRadius: 5,
                    alignSelf: "center",
                    elevation: 5,
                    marginBottom: "3%",
                  }}
                >
                  {newReservationData.map((res) => {
                    return (
                      <View key={res.id} style={{ paddingTop: "2%" }}>
                        <View
                          style={{
                            width: "93%",
                            flexDirection: "row",
                            alignSelf: "center",
                            marginBottom: "5%",
                          }}
                        >
                          <View
                            style={{
                              flex: 1,
                              backgroundColor: "#1687A7",
                              padding: "3%",
                              borderBottomLeftRadius: 10,
                              borderTopLeftRadius: 10,
                              elevation: 2,
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
                              elevation: 3,
                              flex: 4,
                              padding: "2%",
                              backgroundColor: "#FFFFFF",
                              flexDirection: "column",
                            }}
                          >
                            <View style={{ flex: 4, justifyContent: "center" }}>
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
            ) : (
              <>
                <View
                  style={{
                    paddingHorizontal: "2%",
                    marginHorizontal: "5%",
                    backgroundColor: "#fff",
                    borderRadius: 5,
                    marginBottom: "5%",
                  }}
                >
                  <Text
                    style={{
                      padding: "3%",
                      alignSelf: "center",
                      fontFamily: "EncodeSansSemiCondensed_600SemiBold",
                      fontSize: 18,
                      color: "grey",
                    }}
                  >
                    No schedules today/.
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  root: {},
  container: {
    flexDirection: "row",
  },
  textcontainer: {
    flex: 6,
    marginTop: "12%",
    marginLeft: "3%",
  },
  textuser: {
    fontSize: 18,
    color: "#444",
    fontFamily: "EncodeSansSemiCondensed_600SemiBold",
    marginTop: "4%",
  },
  togglebutton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    marginTop: "10%",
    marginLeft: "10%",
    padding: "1%",
    borderRadius: 5,
    marginRight: "3%",
  },
  sectioncontainer: {
    flexDirection: "row",
    height: 200,
    width: "95%",
    borderRadius: 10,
    alignSelf: "center",
    backgroundColor: "#023047",
    elevation: 10,
    paddingRight: 5,
  },
  sectiontextcontainer: {
    flex: 3,
    marginLeft: "5%",
    alignSelf: "center",
  },
  sectiontext: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
  },
  jumpingrope: {
    height: 50,
    flex: 3,
    width: 130,
  },
  icon: {
    width: "100%",
    backgroundColor: "transparent",
    borderRadius: 50,
  },
  pending: {
    backgroundColor: "#ed6c02",
    flex: 2,
    justifyContent: "center",
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    elevation: 2,
  },
  confirmed: {
    flex: 2,
    justifyContent: "center",
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "#2e7d32",
    elevation: 2,
  },
  completed: {
    backgroundColor: "#1976d2",
    flex: 2,
    justifyContent: "center",
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    elevation: 2,
  },
  cancelled: {
    flex: 2,
    justifyContent: "center",
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "#d32f2f",
    elevation: 2,
  },
  declined: {
    flex: 2,
    justifyContent: "center",
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "#9c27b0",
    elevation: 2,
  },
});
export default Tab1Index;
