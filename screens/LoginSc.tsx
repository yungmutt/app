import {useState} from "react";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {SafeAreaView, Text, TextInput, TouchableOpacity, StyleSheet, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "react-native-screens/native-stack";
import {firebase} from "../firebase";
import SizedBox from "../components/SizedBox";



const LoginSc = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const loginUser = async (email: string, password: string) => {
        try {
            const userCreds = await firebase.auth().signInWithEmailAndPassword(email, password);
            if (userCreds.user?.emailVerified) {
                navigation.navigate('Home');
            } else {
                alert('Please verify your email!');
            }
        } catch (e) {
            if (e instanceof Error) {
                alert(e.message)
            }
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps="always"
            >
                <SizedBox height={250}/>
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    onChangeText={(email) => setEmail(email)}
                    value={email}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Password'
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                    value={password}
                    autoCapitalize="none"
                />
                <TouchableOpacity style={styles.button}
                                  onPress={()=> loginUser(email, password)}
                >
                    <Text style={styles.buttonTitle}>Log In</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>
                        Don't have an account?
                    </Text>
                    <SizedBox width={5}/>
                    <TouchableOpacity>
                        <Text style={styles.footerLink}
                              onPress={()=> navigation.navigate("Registration")}
                        >
                            Sign up
                        </Text>
                    </TouchableOpacity>

                </View>
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
    footerView:{
        marginTop: 20,
        alignItems: 'center'
    },
    footerText:{
        fontSize: 16,
        color: '#2e2e2d',
    },
    footerLink:{
        color: "#788eec",
        fontWeight: "bold",
        fontSize: 16,
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

export default LoginSc