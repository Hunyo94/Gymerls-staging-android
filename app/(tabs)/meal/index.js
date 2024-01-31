import { Link, Redirect, Stack, useRouter } from "expo-router";
import { Pressable, ScrollView } from "react-native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { block } from "react-native-reanimated";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, MD2Colors, Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import * as Network from "expo-network";
import * as Device from "expo-device";

const Tab4Index = ({ disabled }) => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [showError, setShowError] = useState(false);
  const [mealPlanning, setMealPlanning] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [mealToday, setMealToday] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [ipAddress, setIpAdress] = useState("");
  const [bmiMessage, setBmiMessage] = useState("");
  const [classsificationColor, setClasssificationColor] = useState("");
  const [bmiValue, setBmiValue] = useState("");

  const onRefresh = React.useCallback(() => {
    getIp();
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  const d = new Date();
  let day = d.getDay();

  const getterMealToday = (meals) => {
    if (meals == 0) {
      setMealToday([
        "Please contact your coach for morning meal",
        "Please contact your coach for lunch meal",
        "Please contact your coach for dinner meal",
      ]);
    } else {
      day === 0
        ? setMealToday([
            meals[0].sun_bf_meal,
            meals[0].sun_lunch_meal,
            meals[0].sun_dinner_meal,
          ])
        : day === 1
        ? setMealToday([
            meals[0].mon_bf_meal,
            meals[0].mon_lunch_meal,
            meals[0].mon_dinner_meal,
          ])
        : day === 2
        ? setMealToday([
            meals[0].tue_bf_meal,
            meals[0].tue_lunch_meal,
            meals[0].tue_dinner_meal,
          ])
        : day === 3
        ? setMealToday([
            meals[0].wed_bf_meal,
            meals[0].wed_lunch_meal,
            meals[0].wed_dinner_meal,
          ])
        : day === 4
        ? setMealToday([
            meals[0].thurs_bf_meal,
            meals[0].thurs_lunch_meal,
            meals[0].thurs_dinner_meal,
          ])
        : day === 5
        ? setMealToday([
            meals[0].fri_bf_meal,
            meals[0].fri_lunch_meal,
            meals[0].fri_dinner_meal,
          ])
        : setMealToday([
            meals[0].sat_bf_meal,
            meals[0].sat_lunch_meal,
            meals[0].sat_dinner_meal,
          ]);
    }
  };

  useEffect(() => {
    getData(function (callback) {
      fetch("https://gymerls-staging-server.vercel.app/api/meal-plan", {
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
          if (meals.length === 0) {
            setShowError(true);
          } else {
            setShowError(false);
          }
          setMealPlanning(meals);
          getterMealToday(meals);
        });

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
        .then((res) => res.json())
        .then((result) => {
          for (let item of result) {
            if (
              (item.height != 0 && item.weight != 0) ||
              (item.height != 0 && item.weight != 0)
            ) {
              calculateBmi(result[0].height, result[0].weight, result[0].age);
            }
          }
        });
    });
  }, [refreshing]);

  const calculateBmi = (height, weight, age) => {
    if (height && weight) {
      const heightInMeters = height / 100;
      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
      setBmiValue(bmi);

      let classColor = "";
      let bmiGet = "";
      let message = "";
      if (bmi < 16) {
        message = "Severe Thinnes";
        bmiGet = "<" + 16;
        classColor = "#bc2020";
      } else if (bmi >= 16 && bmi < 17) {
        message = "Moderate Thinnes";
        bmiGet = 16 + " to " + 17;
        classColor = "#d38888";
      } else if (bmi >= 17 && bmi < 18.5) {
        bmiGet = 17 + " to " + 18.5;
        message = "Mild Thinnes";
        classColor = "#ffe400";
      } else if (bmi >= 18.5 && bmi < 25) {
        bmiGet = 18.5 + " to " + 25;
        message = "Normal";
        classColor = "#008137";
      } else if (bmi >= 25 && bmi < 30) {
        bmiGet = 25 + " to " + 30;
        message = "Overweight";
        classColor = "#ffe400";
      } else if (age >= 21 && bmi >= 30 && bmi < 35) {
        bmiGet = 30 + " to " + 35;
        message = "Obeses Class I";
        classColor = "#d38888";
      } else if (age >= 21 && bmi >= 35 && bmi < 40) {
        bmiGet = 35 + " to " + 40;
        message = "Obeses Class II";
        classColor = "#bc2020";
      } else if (age >= 21 && bmi >= 40) {
        bmiGet = ">" + 40;
        message = "Obeses Class III";
        classColor = "#8a0101";
      } else {
        bmiGet = 0;
        message = "No data";
        classColor = "black";
      }
      setBmiMessage(message);
      setClasssificationColor(classColor);
    } else {
      setBmiValue("");
      setBmiMessage("");
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
    } catch (e) {
      console.log(e);
    }
  };
  const getIp = async () => {
    try {
      const platForm = "Android " + Device.brand;
      const ipAdd = await Network.getIpAddressAsync();
      if (platForm !== null) {
      } else {
      }
      if (ipAdd !== null) {
        setIpAdress(ipAdd);
      } else {
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.mealcontainer}>
        <Text style={styles.headertext}>MEAL PLAN</Text>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{
            backgroundColor: "white",
            marginHorizontal: "2%",
            padding: "2%",
            borderRadius: 5,
            elevation: 10,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontFamily: "EncodeSansSemiCondensed_600SemiBold",
              marginHorizontal: "3%",
              color: "#444",
              marginBottom: "2%",
            }}
          >
            {bmiMessage}
          </Text>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 5,
              elevation: 5,
              padding: "2%",
              marginHorizontal: "1%",
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontFamily: "EncodeSansSemiCondensed_600SemiBold",
                marginHorizontal: "2%",
              }}
            >
              Todays meal!
            </Text>
          </View>
          <View style={{ margin: "2%" }}>
            <View style={{ marginVertical: "2%" }}>
              <View>
                <Text
                  style={{ fontSize: 18, fontWeight: "500", color: "#444" }}
                >
                  <MaterialCommunityIcons
                    name="coffee-outline"
                    size={24}
                    color="#444"
                  />{" "}
                  BREAK FAST
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#ebebeb",
                  borderRadius: 4,
                  padding: "2%",
                  borderBottomWidth: 0.5,
                }}
              >
                <Text
                  style={{
                    fontWeight: "500",
                    color: "#444",
                    marginHorizontal: "2%",
                  }}
                >
                  {mealToday[0]}
                </Text>
              </View>
            </View>
            <View style={{ marginVertical: "2%" }}>
              <View>
                <Text
                  style={{ fontSize: 18, fontWeight: "500", color: "#444" }}
                >
                  <Ionicons
                    name="ios-fast-food-outline"
                    size={24}
                    color="#444"
                  />{" "}
                  LUNCH
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#ebebeb",
                  borderRadius: 4,
                  padding: "2%",
                  borderBottomWidth: 0.5,
                }}
              >
                <Text
                  style={{
                    fontWeight: "500",
                    color: "#444",
                    marginHorizontal: "2%",
                  }}
                >
                  {mealToday[1]}
                </Text>
              </View>
            </View>
            <View style={{ marginVertical: "2%" }}>
              <View>
                <Text
                  style={{ fontSize: 18, fontWeight: "500", color: "#444" }}
                >
                  <MaterialIcons name="dinner-dining" size={24} color="#444" />{" "}
                  DINNER
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#ebebeb",
                  borderRadius: 4,
                  padding: "2%",
                  borderBottomWidth: 0.5,
                }}
              >
                <Text
                  style={{
                    fontWeight: "500",
                    color: "#444",
                    marginHorizontal: "2%",
                  }}
                >
                  {mealToday[2]}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.weekcontainer}>
          {showError ? (
            <>
              <View>
                <Text
                  style={{
                    fontFamily: "EncodeSansSemiCondensed_700Bold",
                    color: "grey",
                  }}
                >
                  It looks like you don't have meal plan yet.
                </Text>
                <Text
                  style={{
                    fontFamily: "EncodeSansSemiCondensed_700Bold",
                    color: "grey",
                  }}
                >
                  Please contact your coach.
                </Text>
              </View>
            </>
          ) : (
            <>
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 5,
                  elevation: 5,
                  padding: "2%",
                  marginHorizontal: "1%",
                  width: "95%",
                  alignItems: "flex-start",
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    fontFamily: "EncodeSansSemiCondensed_600SemiBold",
                    marginHorizontal: "2%",
                  }}
                >
                  Weekly meals!
                </Text>
              </View>

              <TouchableOpacity
                disabled={isDisabled}
                style={styles.linkcontainer}
                onPress={() => {
                  router.push("/(tabs)/meal/sunday");
                }}
              >
                <Text style={styles.text}>Sunday</Text>
                <Text style={styles.icon}>
                  {" "}
                  <AntDesign name="right" size={24} color="black" />{" "}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                leOpacity
                style={styles.linkcontainer}
                onPress={() => {
                  router.push("/(tabs)/meal/monday");
                }}
              >
                <Text style={styles.text}>Monday</Text>
                <Text style={styles.icon}>
                  <AntDesign name="right" size={24} color="#444" />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.linkcontainer}
                onPress={() => {
                  router.push("/(tabs)/meal/tuesday");
                }}
              >
                <Text style={styles.text}>Tuesday</Text>
                <Text style={styles.icon}>
                  <AntDesign name="right" size={24} color="#444" />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.linkcontainer}
                onPress={() => {
                  router.push("/(tabs)/meal/wednesday");
                }}
              >
                <Text style={styles.text}>Wednesday</Text>
                <Text style={styles.icon}>
                  <AntDesign name="right" size={24} color="#444" />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.linkcontainer}
                onPress={() => {
                  router.push("/(tabs)/meal/thursday");
                }}
              >
                <Text style={styles.text}>Thursday</Text>
                <Text style={styles.icon}>
                  <AntDesign name="right" size={24} color="#444" />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.linkcontainer}
                onPress={() => {
                  router.push("/(tabs)/meal/friday");
                }}
              >
                <Text style={styles.text}>Friday</Text>
                <Text style={styles.icon}>
                  <AntDesign name="right" size={24} color="#444" />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.linkcontainer}
                onPress={() => {
                  router.push("/(tabs)/meal/saturday");
                }}
              >
                <Text style={styles.text}>Saturday</Text>
                <Text style={styles.icon}>
                  <AntDesign name="right" size={24} color="#444" />
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
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
  daystext: {
    fontSize: 25,
    marginVertical: 10,
    borderRadius: 10,
    fontWeight: "bold",
    marginLeft: 20,
    backgroundColor: "red",
    width: "70%",
  },
  linkcontainer: {
    width: "95%",
    flexDirection: "row",
    borderColor: "grey",
    borderBottomWidth: 0.5,
  },
  text: {
    fontFamily: "EncodeSansSemiCondensed_700Bold",
    fontSize: 25,
    marginVertical: 10,
    color: "#444",
    marginLeft: 20,
    flex: 4,
  },
  weekcontainer: {
    marginVertical: "3%",
    backgroundColor: "#fff",
    elevation: 10,
    borderRadius: 10,
    width: "95%",
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 15,
  },
  icon: {
    marginVertical: 15,
    textAlign: "right",
    alignSelf: "flex-end",
    flex: 2,
    marginRight: 20,
  },
});

export default Tab4Index;
