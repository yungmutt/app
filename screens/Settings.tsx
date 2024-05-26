import React, {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "react-native-screens/native-stack";
import {firebase} from "../firebase";
import {SafeAreaView, Text, TouchableOpacity, View, StyleSheet, ScrollView, RefreshControl} from "react-native";

interface User {
    name: string;
    surname: string;
}

const Settings = () => {
    const [user, setUser] = useState<string>('');
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [refreshing, setRefreshing] = React.useState(false);

    const fetchUserData = () => {
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
            });
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      setTimeout(() => {
          setRefreshing(false);
      }, 1500);
      fetchUserData();
    }, [setRefreshing]);



    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                refreshControl={
                <RefreshControl refreshing={refreshing}
                                onRefresh={onRefresh}/>
                }
            >
                <View>
                    <Text style={styles.title}>Welcome </Text>
                    <Text style={styles.username}>{user}</Text>
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        navigation.navigate('ChangeUserInfo')
                    }}>
                    <Text style={styles.buttonTitle}>Change account information</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    firebase.auth().signOut()
                    navigation.navigate('Login')
                }}>
                    <Text style={styles.signOut}>Sign Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: '#8484ff'
    },
    title:{
        fontSize: 50,
        alignSelf: "center"
    },
    username: {
        fontSize: 40,
        fontFamily: "AvenirNext-MediumItalic",
        alignSelf: "center"
    },
    signOut: {
        fontSize: 17,
        color: 'red',
        alignSelf: "center"
    },
    button: {
        backgroundColor: '#6582f3',
        marginLeft: 30,
        paddingLeft: 10,
        paddingRight: 10,
        marginRight: 30,
        marginTop: 20,
        marginBottom: 20,
        height: 48,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center',
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: "bold",
    },
})

export default Settings;