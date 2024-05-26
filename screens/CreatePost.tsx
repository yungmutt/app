import {Keyboard, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {useEffect, useState} from "react";
import {firebase, storage} from '../firebase';
import {TouchableWithoutFeedback} from "react-native-gesture-handler";
import * as ImagePicker from 'expo-image-picker';
import 'firebase/storage';
import Feather from "@expo/vector-icons/Feather";
import {ref, getDownloadURL, uploadBytes} from "firebase/storage";

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
    const [image, setImage] = useState("");
    const [media, setMedia] = useState<{fileType: string, url: string} | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    //launches device's image library and then image gets stored and set
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4,3],
            quality: 0.5
            });

        if (!result.canceled){
            setImage(result.assets[0].uri);
            const media = await uploadImage(result.assets[0].uri, "image");
            setMedia(media);
        }
    };

    const uploadImage = async (uri: string, fileType: string): Promise<{fileType: string, url: string}> => {
        try {
            const res = await fetch(uri);
            const blob = await res.blob();

            const storageRef = ref(storage, "images/" + new Date().getTime());
            await uploadBytes(storageRef, blob);
            const url = await getDownloadURL(storageRef);
            console.log('file info: ', {fileType, url});
            return {fileType, url};
        } catch (e: unknown) {
            if (e instanceof Error){
                console.error(e.message);
            }
            throw e;
        }
    };

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
                  .add({
                      title,
                      body,
                      media,
                      eventId,
                      author:{
                          name: userData?.name,
                          surname: userData?.surname,
                      },
                  });
          }
          setSuccess(true);
          setTitle('');
          setBody('');
          setMedia(null);
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
                               maxLength={1000}
                               value={body}
                               onChangeText={(text) => setBody(text)}
                               multiline={true}
                               numberOfLines={10}
                    />
                </TouchableWithoutFeedback>
            </View>
            <Text style={styles.bottomText}>Upload media:</Text>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={pickImage}>
                    <Feather name='image' size={30} color='white'/>
                </TouchableOpacity>
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
    permissionContainer: {
        flex: 1,
        alignItems: "center",
        marginVertical: 300,
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
    buttonsContainer: {
        flexDirection: "row",
        alignSelf: 'center',
        marginTop: 5,
        gap: 10
    },
    bottomText:{
        color: 'white',
        fontSize: 20,
    }
})
export default CreatePost;
