import React from "react";
import { Link, Redirect, Stack, useRouter } from "expo-router";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import { useNavigation } from "expo-router";

export default function profile() {
  const router = useRouter();
  const navigation = useNavigation();
  const [personInfo, setPersonInfo] = useState([]);
  const [mealPlanning, setMealPlanning] = useState([]);
  const [username, setUsername] = useState("");
  const [show, setShow] = useState("");
  const isPresented = navigation.canGoBack();

  useEffect(() => {
    {
      setShow(true);
      setTimeout(() => {
        setShow(false);
        router.push("/(tabs)/home/profile");
      }, 600);
    }
    getData(function (callback) {
      fetch("http://10.0.2.2:3031/api/get-user-by-username", {
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
        .then(function (personinfo) {
          setPersonInfo(personinfo);
        });
    });
  }, []);

  const storeDataMembership_type = async (membership_type) => {
    try {
      await AsyncStorage.setItem("membership_type", membership_type);
    } catch (e) {
      // saving error
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

  return (
    <>
      <ScrollView style={styles.root}>
        <View style={styles.activityindicator}>
          <ActivityIndicator
            style={{ zIndex: 10 }}
            animating={show}
            size={"small"}
            color={MD2Colors.grey900}
          />
        </View>
        <View style={{ width: "20%" }}>
          <TouchableOpacity
            onPress={() => {
              router.push("/(tabs)/home");
            }}
          >
            <Entypo name="chevron-small-left" size={45} />
          </TouchableOpacity>
        </View>

        <View style={{}}>
          {personInfo.map((personinfo) => {
            return (
              <View
                key={personinfo.id}
                style={{
                  flex: 1,
                  alignItems: "flex-end",
                  width: "100%",
                }}
              >
                <View style={styles.headericon}>
                  <Ionicons name="ios-person-outline" size={90} color="#444" />
                </View>

                <View style={styles.titlecontainer}>
                  <Text style={styles.title}>Personal Information</Text>
                  <Text style={styles.label}>Fullname</Text>
                  <Text style={styles.text}>{personinfo.name}</Text>
                  <Text style={styles.label}>Address</Text>
                  <Text style={styles.text}>{personinfo.address}</Text>

                  <View style={styles.datecontainer}>
                    <View style={styles.date}>
                      <Text style={styles.labelbday}>Birthdate</Text>

                      <Text style={styles.text}>
                        {personinfo.birthdate.slice(0, 10)}
                      </Text>
                    </View>
                    <View style={styles.age}>
                      <Text style={styles.labelbday}>Age</Text>
                      <View style={styles.container}>
                        <Text style={styles.text}> {personinfo.age}</Text>
                      </View>
                    </View>
                    <View style={styles.age}>
                      <Text style={styles.labelbday}>Gender</Text>
                      <Text style={styles.text}> {personinfo.gender}</Text>
                    </View>
                  </View>

                  <View style={styles.datecontainer}>
                    <View style={{ flex: 1, paddingLeft: "3.2%" }}>
                      <Text style={styles.labelbday}>Height</Text>
                      <View style={styles.container}>
                        <Text style={styles.text}> {personinfo.height}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 2 }}>
                      <Text
                        style={{
                          marginLeft: "2%",
                          fontSize: 20,
                          marginVertical: 2,
                          color: "#444",
                          fontWeight: "600",
                        }}
                      >
                        Weight
                      </Text>
                      <Text style={styles.text}> {personinfo.weight}</Text>
                    </View>
                  </View>

                  <Text style={styles.label}>Contact</Text>
                  <Text style={styles.text}>{personinfo.contact}</Text>
                </View>
                <View style={styles.titlecontainer}>
                  <Text style={styles.title}>Medical records</Text>
                  <Text style={styles.label}>Condition</Text>
                  <Text style={styles.text}>
                    {personinfo.medical_conditions}
                  </Text>
                  <Text style={styles.label}>Allergies</Text>
                  <Text style={styles.text}>{personinfo.allergies}</Text>
                  <Text style={styles.label}>Medication</Text>
                  <Text style={styles.text}>
                    {personinfo.current_medication}
                  </Text>
                  <Text style={styles.label}>Doctor's name</Text>
                  <Text style={styles.text}>{personinfo.family_doctor}</Text>
                  <Text style={styles.label}>Contact</Text>
                  <Text style={styles.text}>{personinfo.doctor_contact}</Text>
                </View>
                <View style={styles.titlecontainer}>
                  <Text style={styles.title}>In case of emergency</Text>
                  <Text style={styles.label}>Guardian's name</Text>
                  <Text style={styles.text}>{personinfo.parent_name}</Text>
                  <Text style={styles.label}>Address</Text>
                  <Text style={styles.text}>{personinfo.parent_address}</Text>
                  <Text style={styles.label}>Contact no.</Text>
                  <Text style={styles.text}>{personinfo.parent_contact}</Text>
                </View>
                <View style={styles.titlecontainer}>
                  <Text style={styles.title}>Membership</Text>
                  <Text style={styles.label}>Type</Text>
                  <Text style={styles.text}>{personinfo.membership_type}</Text>
                  <Text style={styles.label}>Start date</Text>
                  <Text style={styles.text}>
                    {personinfo.mem_start_date.slice(0, 10)}
                  </Text>
                  <Text style={styles.label}>End date</Text>
                  <Text style={styles.text}>
                    {personinfo.mem_end_date.slice(0, 10)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </>
  );
}
const styles = StyleSheet.create({
  root: {
    backgroundColor: "#F9F9F9",
    marginTop: "10%",
    backgroundColor: "white",
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
    marginBottom: "3%",
    elevation: 600,
  },
  headericon: {
    marginVertical: "5%",
    alignSelf: "center",
  },
  titlecontainer: {
    width: "100%",
    marginTop: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 25,
    backgroundColor: "white",
    padding: "2%",
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    borderColor: "grey",
    paddingLeft: "3%",
    width: "100%",
  },
  label: {
    marginLeft: 20,
    fontSize: 20,
    marginVertical: 5,
    color: "#444",
    fontWeight: "600",
  },
  datecontainer: {
    flexDirection: "row",
  },
  labelbday: {
    marginLeft: "5%",
    fontSize: 20,
    marginVertical: 2,
    color: "#444",
    fontWeight: "600",
  },
  date: {
    flex: 1,
    marginLeft: 10,
  },
  age: {
    flex: 1,
  },
  container: {
    width: "100%",
  },
  activityindicator: {
    position: "absolute",
    alignSelf: "center",
    zIndex: 12,
    top: "20%",
  },
  text: {
    padding: "2%",
    marginHorizontal: "4%",
    borderColor: "#444",
    color: "#444",
  },
});
