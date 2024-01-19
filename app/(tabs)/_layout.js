import { Tabs } from "expo-router";
import { React } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
// 🏠
// ⚙️

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveBackgroundColor: "#EBEBEB",
        tabBarStyle: { borderRadius: 10, height: 55 },
        tabBarActiveTintColor: "#28282B",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: () => <Entypo name="home" size={26} color="grey" />,
        }}
      />

      <Tabs.Screen
        name="meal"
        options={{
          title: "Meal",
          tabBarIcon: () => (
            <MaterialIcons name="set-meal" size={26} color="grey" />
          ),
        }}
      />

      <Tabs.Screen
        name="store"
        options={{
          title: "store",
          tabBarIcon: () => <Entypo name="shop" size={26} color="grey" />,
        }}
      />
      <Tabs.Screen
        name="product"
        options={{
          title: "Cart",
          tabBarIcon: () => (
            <Entypo name="shopping-cart" size={26} color="grey" />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: () => (
            <Entypo name="shopping-bag" size={26} color="grey" />
          ),
        }}
      />
      <Tabs.Screen
        name="Schedule"
        options={{
          title: "Schedule",
          tabBarIcon: () => (
            <FontAwesome name="calendar" size={26} color="grey" />
          ),
        }}
      />
      <Tabs.Screen
        name="Settings"
        options={{
          title: "Settings",
          tabBarIcon: () => <Ionicons name="settings" size={26} color="grey" />,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
