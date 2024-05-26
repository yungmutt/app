import {NavigationContainer} from "@react-navigation/native";
import {firebase} from "./firebase"
import LoginSc from "./screens/LoginSc";
import RegistrationSc from "./screens/RegistrationSc";
import React, {useEffect, useState} from "react";
import {createStackNavigator} from "@react-navigation/stack";
import Tabs from "./components/Tabs";
import EventSc from "./screens/EventSc";
import ChangeUserInfo from "./screens/ChangeUserInfo";
import CreatePost from "./screens/CreatePost";
import PostSc from "./screens/PostSc";

const Stack = createStackNavigator();
const App = () => {
    function useAuthentication() {
        const [initializing, setInitializing] = useState(true);
        const [user, setUser] = useState<firebase.User | null>(null);

        function onAuthStateChanged(user: firebase.User | null) {
            setUser(user);
            if (initializing) setInitializing(false);
        }

        useEffect(() => {
            return firebase.auth().onAuthStateChanged(onAuthStateChanged);
        }, []);

        return {user: initializing ? user : null};
    }
    const {user} = useAuthentication();

    return user ? (
            <NavigationContainer>
                <Tabs/>
            </NavigationContainer>
    ):(
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="Login"
                        component={LoginSc}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="Registration"
                        component={RegistrationSc}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="Home"
                        component={Tabs}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="EventSc"
                        component={EventSc}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="CreatePost"
                        component={CreatePost}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="PostSc"
                        component={PostSc}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen name="ChangeUserInfo"
                                  component={ChangeUserInfo}
                                  options={{headerShown: false}}/>
                </Stack.Navigator>
            </NavigationContainer>
    );
}

export default App;
