import { Redirect, Stack, useRouter } from "expo-router";
import {
  Button,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { AuthStore } from "../../../store";
import CustomInput from "../../(Component)/CustomInput";
import CustomButton from "../../(Component)/CustomButton";
import CustomIconButton from "../../(Component)/CustomIconButton";
import { useState, useEffect } from "react";
import { Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native-paper";
import * as Network from "expo-network";
import * as Device from "expo-device";

const Tab2Index = () => {
  const router = useRouter();

  const [showSignout, setShowSignout] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);
  const [currentPassword, setcurrentPassword] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisibleNew, setPasswordVisibleNew] = useState(false);
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [ipAddress, setIpAdress] = useState("");

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

  const userLogOff = (username) => {
    getIpAddress(function (ipAddress) {
      fetch("http://10.0.2.2:3031/api/insert-log", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          event_info: "Logoff - success",
          ip_address: ipAddress,
          platform: Device.osName,
        }),
      })
        .then((response) => response.json())
        .catch((error) => console.log(error));
    });
  };

  const userLoveChangePassSuccess = (username) => {
    getIpAddress(function (ipAddress) {
      fetch("http://10.0.2.2:3031/api/insert-log", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          event_info: "Update - password",
          ip_address: ipAddress,
          platform: Device.osName,
        }),
      })
        .then((response) => response.json())
        .catch((error) => console.log(error));
    });
  };

  const changePassItem = () => {
    setShowChangePass(true);
  };

  const signOut = () => {
    setShowSignout(true);
  };

  const cancel = () => {
    setShowSignout(false);
  };

  const logOut = async (username) => {
    userLogOff(username);
    AuthStore.update((s) => {
      s.isLoggedIn = false;
    });
    router.replace("/login");
    try {
      await AsyncStorage.removeItem("username");
      await AsyncStorage.removeItem("password");
      return true;
    } catch (exception) {
      return false;
    }
  };

  const storeDataPass = async () => {
    AuthStore.update((s) => {
      s.isLoggedIn = false;
    });
    const value = await AsyncStorage.getItem("password");
    const valueUsername = await AsyncStorage.getItem("username");
    try {
      setcurrentPassword(value);
      setUsername(valueUsername);
      return true;
    } catch (exception) {
      return false;
    }
  };

  useEffect(() => {
    storeDataPass();
  }, []);

  const changePass = () => {
    if (oldPass === currentPassword) {
      if (currentPassword === newPassword) {
        alert("New password must not be same as your old password");
      } else if (newPassword.length >= 6) {
        fetch("http://10.0.2.2:3031/api/update-password", {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            password: newPassword,
            username: username,
          }),
        }).then(function (response) {
          return response.json();
        });
        AuthStore.update((s) => {
          s.isLoggedIn = false;
        });
        alert(" Change password complete Please sign in again");
        userLogOff(username);
        router.replace("/login");
        userLoveChangePassSuccess(username);
      } else {
        alert("password must be atleast 6 characters ");
      }
    } else {
      alert("! old password are not match");
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      {showSignout ? (
        <>
          <View
            style={{
              height: "100%",
              width: "100%",
              backgroundColor: "transparent",
              position: "absolute",
              zIndex: 1,
              alignItems: "center",
            }}
          >
            <View style={styles.confirmationcontainer}>
              {/* fontSize: 20 */}
              <Text style={{ marginTop: "6%" }}>Sign out of you account?</Text>
              <View style={styles.buttonconfirmcontainer}>
                <TouchableOpacity
                  onPress={() => {
                    cancel();
                  }}
                >
                  <Text style={styles.textcancel}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    logOut(username);
                  }}
                >
                  <Text style={styles.textout}>SIGNOUT</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </>
      ) : (
        <></>
      )}
      <View style={styles.headercontainer}>
        <Text style={styles.headertext}>SETTINGS</Text>
      </View>
      <View style={styles.changepassitem}>
        <TouchableOpacity
          onPress={() => {
            changePassItem();
          }}
        >
          <Text style={styles.changepasstext}>Change Password</Text>
        </TouchableOpacity>
      </View>
      {showChangePass ? (
        <>
          <View
            style={{
              height: "100%",
              width: "100%",
              backgroundColor: "transparent",
              position: "absolute",
              zIndex: 1,
              alignItems: "center",
            }}
          >
            <View style={styles.elevation}>
              <TouchableOpacity
                style={{
                  alignSelf: "flex-end",
                  marginRight: "4%",
                  marginTop: "2%",
                }}
                onPress={() => {
                  setShowChangePass(false);
                }}
              >
                <Entypo
                  name="cross"
                  size={28}
                  color="black"
                  style={{ marginTop: "2%" }}
                />
              </TouchableOpacity>
              <Text style={styles.sectionheadertext}>Change Password</Text>
              <View style={{ width: "90%", alignSelf: "center" }}>
                <TextInput
                  style={{ backgroundColor: "#fff" }}
                  mode="outlined"
                  setValue={setOldPass}
                  label="Old password"
                  secureTextEntry={!passwordVisible}
                  right={
                    <TextInput.Icon
                      icon={passwordVisible ? "eye" : "eye-off"}
                      onPress={() => setPasswordVisible(!passwordVisible)}
                    />
                  }
                  value={oldPass}
                  onChangeText={(text) => setOldPass(text)}
                  theme={{ colors: { text: "white", primary: "black" } }}
                />
              </View>

              <View
                style={{ width: "90%", alignSelf: "center", marginTop: "3%" }}
              >
                <TextInput
                  style={{ backgroundColor: "#fff" }}
                  mode="outlined"
                  setValue={setNewPassword}
                  label="New password"
                  secureTextEntry={!passwordVisibleNew}
                  right={
                    <TextInput.Icon
                      icon={passwordVisibleNew ? "eye" : "eye-off"}
                      onPress={() => setPasswordVisibleNew(!passwordVisibleNew)}
                    />
                  }
                  value={newPassword}
                  onChangeText={(text) => setNewPassword(text)}
                  theme={{ colors: { text: "white", primary: "black" } }}
                />
              </View>
              <Text style={{ color: "grey", marginHorizontal: 20 }}>
                password should be at least 6 characters
              </Text>
              <CustomButton
                text="Change Password"
                onPress={() => {
                  changePass();
                }}
              />
            </View>
          </View>
        </>
      ) : (
        <></>
      )}
      <View style={styles.singoutcontainer}>
        <TouchableOpacity
          style={styles.textcontainer}
          onPress={() => {
            signOut();
          }}
          title="LOGOUT"
        >
          <Text style={styles.text}>Signout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headercontainer: {
    alignSelf: "center",
    marginVertical: 40,
    backgroundColor: "#fff",
    width: "98%",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 10,
  },
  headertext: {
    fontSize: 30,
    fontWeight: "700",
    color: "#444",
  },
  sectioncontainer: {
    borderRadius: 10,
  },
  elevation: {
    elevation: 500,
    backgroundColor: "white",
    borderRadius: 10,
    width: "90%",
    marginVertical: "15%",
    zIndex: 2,
    position: "absolute",
    top: "20%",
  },
  sectionheadertext: {
    fontSize: 25,
    marginVertical: 10,
    alignSelf: "center",
  },
  oldpasstext: {
    marginHorizontal: 20,
    fontSize: 20,
    marginTop: 40,
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: "3%",
    alignSelf: "center",
  },
  singoutcontainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  textcontainer: {
    width: "90%",
    backgroundColor: "#fff",
    elevation: 10,
    borderRadius: 10,
    marginVertical: "3%",
  },
  confirmationcontainer: {
    flex: 1,
    position: "absolute",
    backgroundColor: "#fff",
    elevation: 20,
    alignItems: "center",
    width: "65%",
    borderRadius: 5,
    top: "40%",
    zIndex: 1,
    borderColor: "grey",
  },
  buttonconfirmcontainer: {
    flexDirection: "row",
    marginVertical: "8%",
    width: "100%",
    justifyContent: "space-evenly",
  },
  textcancel: {
    marginHorizontal: "2%",
    fontSize: 18,
    backgroundColor: "#1976D2",
    borderRadius: 5,
    alignSelf: "center",
    padding: "2%",
    color: "#fff",
    fontWeight: "500",
  },
  textout: {
    marginHorizontal: "2%",
    fontSize: 18,
    alignSelf: "center",
    padding: "2%",
    color: "#fff",
    fontWeight: "500",
    borderRadius: 5,
    backgroundColor: "#1976D2",
  },
  changepassitem: {
    borderColor: "grey",
    borderWidth: 0.5,
    width: "100%",
    backgroundColor: "#fff",
    elevation: 4,
  },
  changepasstext: {
    marginVertical: "4%",
    marginLeft: "4%",
    fontSize: 20,
  },
});

export default Tab2Index;
