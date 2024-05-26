import {useState} from "react";
import {SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "react-native-screens/native-stack";
import {firebase} from "../firebase";
import SizedBox from "../components/SizedBox";
import {passValidation} from "../components/passValidation";

const RegistrationSc = () => {
    const [name, setName] = useState<string>('');
    const [surname, setSurname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const registerUser = async (email: string, password: string, name: string, surname: string) => {
        try {
            passValidation(password);
            const {user} = await firebase.auth().createUserWithEmailAndPassword(email, password);
            if (user) {
                await user.sendEmailVerification({
                    handleCodeInApp: true,
                        url:'https://application-83a87.firebaseapp.com',
                });
                alert('Verification email sent!');
                await firebase.firestore().collection('users')
                    .doc(firebase.auth().currentUser?.uid)
                    .set({
                        name: name,
                        surname: surname,
                        email: email,
                    });
                navigation.navigate('Login');
            }
        } catch(e) {
            if (e instanceof Error) {
                alert(e.message);
            }
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps="always"
            >
                <SizedBox height={200}/>
                <TextInput
                    style={styles.input}
                    placeholder='Enter your name'
                    onChangeText={(name) => setName(name)}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Enter your surname'
                    onChangeText={(surname) => setSurname(surname)}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Enter your e-mail address'
                    onChangeText={(email) => setEmail(email)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder='Enter your password'
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => registerUser(email, password, name, surname)}
                >
                    <Text style={styles.buttonTitle}>Create account</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container:{
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

export default RegistrationSc
