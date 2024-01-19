import { Link, Redirect, Stack, useRouter } from "expo-router";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";

import Item from "../../(Component)/Item";
import { useState, useEffect } from "react";
import ItemOdd from "../../(Component)/ItemOdd";
import React from "react";

const Tab5Index = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [refreshing]);
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.mealcontainer}>
        <Text style={styles.headertext}>STORE</Text>
      </View>
      <ScrollView
        style={styles.root}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            borderRadius: 5,
            width: "98%",
            marginTop: "2%",
          }}
        >
          <View style={{ width: "48%" }}>
            <Item />
          </View>
          <View style={{ width: "48%" }}>
            <ItemOdd />
          </View>
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
    padding: 10,
    borderRadius: 10,
    elevation: 10,
  },
  headertext: {
    fontSize: 30,
    color: "#444",
    fontWeight: "700",
  },
  item: {
    width: "100%",
    marginTop: "2%",
    padding: "2%",
  },
});
export default Tab5Index;
