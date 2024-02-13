import Feather from "@expo/vector-icons/Feather";
import Settings from "../screens/Settings";
import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import {NavigationContainer} from "@react-navigation/native";
import * as events from "events";

const Tab = createBottomTabNavigator();

const Tabs = () => {
    return(
            <Tab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: '#c4c4ff',
                    tabBarInactiveTintColor: '#8484ff',
                    tabBarStyle: {
                        backgroundColor: "#252573"
                    }
                }}
            >
                <Tab.Screen name='Home' component={Home}
                            options={{
                                headerShown: false,
                                tabBarLabel: 'Home',
                                tabBarIcon: ({focused}) => (
                                    <Feather name="home" size={24} color={focused ? "#c4c4ff" : "#8484ff"} />
                                )
                            }}
                />
                <Tab.Screen name='Settings' component={Settings}
                            options={{
                                tabBarLabel: 'Settings',
                                headerShown: false,
                                tabBarIcon: ({focused}) => (
                                    <Feather name="settings" size={24} color={focused ? "#c4c4ff" : "#8484ff"} />
                                )
                            }}
                />
            </Tab.Navigator>
    )
}

export default Tabs

