import React, {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "react-native-screens/native-stack";
import {firebase} from "../firebase";
import {SafeAreaView, Text, TouchableOpacity, View, StyleSheet} from "react-native";

interface User {
    name: string;
    surname: string;
}

const Settings = () => {
    const [user, setUser] = useState<string>('');
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    useEffect(() => {
        firebase.firestore().collection('users')
            .doc(firebase.auth().currentUser?.uid).get()
            .then((snapshot) => {
                if (snapshot.exists){
                    const data = snapshot.data() as User;
                    setUser(`${data.name} ${data.surname}`);
                }
                else {
                    console.log("User not found")
                }
            })
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text>Welcome {user}</Text>
            </View>
            <TouchableOpacity onPress={() => {
                firebase.auth().signOut()
                navigation.navigate('Login')
            }}>
                <Text style={styles.entityText}>Sign Out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: "center"
    },
    button: {
        height: 47,
        borderRadius: 5,
        backgroundColor: '#788eec',
        width: 80,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 16
    },
    listContainer: {
        marginTop: 20,
        padding: 20,
    },
    entityContainer: {
        marginTop: 16,
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
        paddingBottom: 16
    },
    entityText: {
        fontSize: 20,
        color: '#333333'
    }
})

export default Settings;