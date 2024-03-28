
import {SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Keyboard} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {useEffect, useState} from "react";
import {firebase}  from '../firebase';
import {TouchableWithoutFeedback} from "react-native-gesture-handler";

type RouteProp = {
    params: {
        eventId: string;
    };
};
//CreatePost receives the event id from the route parameters
const CreatePost = ({ route }: { route: RouteProp }) => {
    const navigation = useNavigation();
    //this const is used to extract the eventId from the route params
    const { eventId } = route.params;
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);


    const handleSubmitPost = async () => {
        if (!body || !title){
          return;
      }
      setLoading(true);
      setError('');
      setSuccess(false);
      try {
          //setting the current user's uid
          const uid = firebase.auth().currentUser?.uid;
          //firestore document which corresponds to the current user's uid in which user's data is stored
          const userRef = firebase.firestore().collection('users').doc(uid);
          //getting the data
          const doc = await userRef.get();
          if (!doc.exists){
              console.log("Doc not found");
          } else {
              let userData = doc.data();
              await firebase.firestore().collection('posts')
                  .doc(uid)
                  .set({
                      title,
                      body,
                      eventId,
                      author:{
                          name: userData?.name,
                          surname: userData?.surname,
                      }
                  });
          }
          setSuccess(true);
          setTitle('');
          setBody('');
      } catch (err: any) {
          setSuccess(false);
          setError(err.message || "Something went wrong");
      }
      setLoading(false);
    };

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        if (success){
            timeout = setTimeout(() => {
                setSuccess(false);
                navigation.navigate('EventSc');
            }, 1500);
        }
        return () => clearTimeout(timeout);
    }, [success]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <TextInput placeholder='Title'
                               style={styles.inputTitle}
                               maxLength={30}
                               value={title}
                               onChangeText={(text) => setTitle(text)} />
                    <TextInput placeholder='Post details'
                               style={styles.inputBody}
                               maxLength={400}
                               value={body}
                               onChangeText={(text) => setBody(text)}
                               multiline={true}
                               numberOfLines={10}
                    />
                </TouchableWithoutFeedback>
            </View>
            <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmitPost}>
                    <Text style={styles.buttonTitle}>Submit</Text>
                </TouchableOpacity>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: "center",
        backgroundColor: '#8484ff'
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
    inputContainer:{
        width: '100%',
        marginBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 50
    },
    inputTitle:{
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        fontSize: 18,
        paddingLeft: 5,
        paddingVertical: 5,
        marginTop: 20,
        height: 50
    },
    inputBody:{
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        fontSize: 18,
        paddingLeft: 5,
        paddingVertical: 5,
        marginTop: 20,
        textAlignVertical: "top",
        height: 300
    },
})
export default CreatePost;
