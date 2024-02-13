import {NavigationContainer} from "@react-navigation/native";
import {firebase} from "./firebase"
import Home from "./screens/Home";
import LoginSc from "./screens/LoginSc";
import RegistrationSc from "./screens/RegistrationSc";
import React, {useEffect, useState} from "react";
import {createStackNavigator} from "@react-navigation/stack";
import Tabs from "./components/Tabs";
// import {useGetConcerts} from "./components/useGetConcerts";

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

    // const [loading, error, concerts] = useGetConcerts();

    // if (concerts) {
    //     console.log("concerts", concerts);
    // }

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
                </Stack.Navigator>
            </NavigationContainer>
    );
}

export default App;
