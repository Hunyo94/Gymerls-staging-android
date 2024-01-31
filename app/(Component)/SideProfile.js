import React from "react";
import { Link, Redirect, Stack, useRouter } from "expo-router";
import {
  View,
  Text,
  Pressable,
  Button,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
// import { AuthStore } from "";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import CustomTextInput from "./CustomTextBox";
import { Entypo } from "@expo/vector-icons";
import { ActivityIndicator, MD2Colors } from "react-native-paper";

const SideProfile = () => {
  const [personInfo, setPersonInfo] = useState([]);
  const [mealPlanning, setMealPlanning] = useState([]);
  const [username, setUsername] = useState("");
  const [show, setShow] = useState("");

  useEffect(() => {
    {
      setShow(true);
      setTimeout(() => {
        setShow(false);
        router.push("./SideProfile");
      }, 600);
    }
    getData(function (callback) {
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

  const getData = async (callback) => {
    try {
      const value = await AsyncStorage.getItem("username");
      if (value !== null) {
        // value previously stored
        setUsername(value);
        callback(value);
      } else {
      }
    } catch (e) {
      // error reading value
      // console.log(e);
    }
  };

  const router = useRouter();

  return (
    <>
      <View style={styles.activityindicator}>
        <ActivityIndicator
          style={{ zIndex: 1 }}
          animating={show}
          size={"large"}
          color={MD2Colors.grey900}
        />
      </View>
      <ScrollView style={styles.root}>
        <View style={{ width: "20%", position: "absolute", zIndex: 2 }}>
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <Entypo name="chevron-small-left" size={45} />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flex: 1,
            width: "100%",
          }}
        >
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
                  <Ionicons name="ios-person-outline" size={90} color="black" />
                </View>

                <View style={styles.titlecontainer}>
                  <Text style={styles.title}>Personal Information</Text>
                  <Text style={styles.label}>Fullname</Text>
                  <CustomTextInput
                    editable={false}
                    placeholder="Fullname"
                    value={personinfo.name}
                  />
                  <Text style={styles.label}>Address</Text>
                  <CustomTextInput
                    editable={false}
                    placeholder="Address"
                    value={personinfo.address}
                  />

                  <View style={styles.datecontainer}>
                    <View style={styles.date}>
                      <Text style={styles.labelbday}>Birthdate</Text>
                      <CustomTextInput
                        editable={false}
                        placeholder="0000-00-00"
                        keyboardType="numeric"
                        value={personinfo.birthdate.slice(0, 10)}
                      />
                    </View>
                    <View style={styles.age}>
                      <Text style={styles.labelbday}>Age</Text>
                      <View style={styles.container}>
                        <TextInput editable={false} style={styles.input}>
                          {personinfo.age}
                        </TextInput>
                      </View>
                    </View>
                    <View style={styles.age}>
                      <Text style={styles.labelbday}>Gender</Text>
                      <CustomTextInput
                        editable={false}
                        placeholder="Male"
                        value={personinfo.gender}
                      />
                    </View>
                  </View>
                  <Text style={styles.label}>Contact</Text>
                  <CustomTextInput
                    editable={false}
                    placeholder="09*******"
                    keyboardType="numeric"
                    inputMode={"numeric"}
                    value={personinfo.contact}
                  />
                </View>
                <View style={styles.titlecontainer}>
                  <Text style={styles.title}>Medical records</Text>
                  <Text style={styles.label}>Condition</Text>
                  <CustomTextInput
                    editable={false}
                    placeholder="na"
                    value={personinfo.medical_conditions}
                  />
                  <Text style={styles.label}>Allergies</Text>
                  <CustomTextInput
                    editable={false}
                    placeholder="na"
                    value={personinfo.allergies}
                  />
                  <Text style={styles.label}>Medication</Text>
                  <CustomTextInput
                    editable={false}
                    placeholder="na"
                    value={personinfo.current_medication}
                  />
                  <Text style={styles.label}>Doctor's name</Text>
                  <CustomTextInput
                    editable={false}
                    placeholder="na"
                    value={personinfo.family_doctor}
                  />
                  <Text style={styles.label}>Contact</Text>
                  <CustomTextInput
                    editable={false}
                    placeholder="09*******"
                    keyboardType="numeric"
                    inputMode={"numeric"}
                    value={personinfo.doctor_contact}
                  />
                </View>
                <View style={styles.titlecontainer}>
                  <Text style={styles.title}>In case of emergency</Text>
                  <Text style={styles.label}>Guardian's name</Text>
                  <CustomTextInput
                    editable={false}
                    placeholder="Gerry galino"
                    value={personinfo.parent_name}
                  />
                  <Text style={styles.label}>Address</Text>
                  <CustomTextInput
                    editable={false}
                    placeholder="aguso tc"
                    value={personinfo.parent_address}
                  />
                  <Text style={styles.label}>Contact no.</Text>
                  <CustomTextInput
                    editable={false}
                    placeholder="09*****"
                    keyboardType={"numeric"}
                    inputMode={"numeric"}
                    value={personinfo.parent_contact}
                  />
                </View>
                <View style={styles.titlecontainer}>
                  <Text style={styles.title}>Membership</Text>
                  <Text style={styles.label}>Type</Text>
                  <CustomTextInput
                    editable={false}
                    placeholder="Student"
                    value={personinfo.membership_type}
                  />
                  <Text style={styles.label}>Start date</Text>
                  <CustomTextInput
                    editable={false}
                    placeholder="29004"
                    value={personinfo.mem_start_date.slice(0, 10)}
                  />
                  <Text style={styles.label}>End date</Text>
                  <CustomTextInput
                    editable={false}
                    placeholder="24490"
                    value={personinfo.mem_end_date.slice(0, 10)}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </>
  );
};
const styles = StyleSheet.create({
  root: {
    width: "100%",
    backgroundColor: "#F9F9F9",
    marginTop: "10%",
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
    borderWidth: 0.5,
    borderColor: "grey",
    paddingLeft: "3%",
  },
  label: {
    marginLeft: 20,
    fontSize: 20,
    marginVertical: 5,
  },
  datecontainer: {
    flexDirection: "row",
  },
  labelbday: {
    marginLeft: 10,
    fontSize: 20,
    marginVertical: 2,
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
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#A0A0A0",
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignSelf: "center",
    paddingHorizontal: 12,
    marginVertical: 10,
    color: "black",
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  activityindicator: {
    position: "absolute",
    top: "40%",
    alignSelf: "center",
  },
});
export default SideProfile;
