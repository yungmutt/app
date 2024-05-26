 import {SafeAreaView, Text, TextInput, TouchableOpacity, StyleSheet} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import SizedBox from "../components/SizedBox";
import {firebase} from "../firebase";
import {useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "react-native-screens/native-stack";

const ChangeUserInfo = () => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const db = firebase.firestore();

    const changeInfo = async (email?: string, password?: string, name?: string, surname?: string) => {
        if (!name && !surname && !email && !password) {
            alert("No submitted data!");
            return;
        }
        const userRef = db.collection('users').doc(firebase.auth().currentUser?.uid);
        const updates: {name?: string, surname?: string, email?: string} = {};
        if (name) {
            updates.name = name;
            alert("Data successfully updated!");
        }
        if (surname) {
            updates.surname = surname
            alert("Data successfully updated!");
        }
        if (email) {
            updates.email = email
            alert("Data successfully updated!");
        }
        await userRef.update(updates);

        if (password) {
            const user = firebase.auth().currentUser;
            if (user){
                user.updatePassword(password).catch((error) => {
                    console.error(error);
                })
            }
        }
        navigation.navigate('Settings');
    }

    return(
        <SafeAreaView style={styles.container}>
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps="always"
            >
                <SizedBox height={200}/>
                <TextInput
                    style={styles.input}
                    placeholder='Name'
                    onChangeText={(name) => setName(name)}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Surname'
                    onChangeText={(surname) => setSurname(surname)}
                />
                <TextInput
                    style={styles.input}
                    placeholder='E-mail address'
                    onChangeText={(email) => setEmail(email)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder='Password'
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => changeInfo(email, password, name, surname)}
                >
                    <Text style={styles.buttonTitle}>Set changes</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
        backgroundColor: '#42403a'
    },
    input:{
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16
    },
    button: {
        backgroundColor: '#788eec',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        height: 48,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: "bold"
    },
})

export default ChangeUserInfo;