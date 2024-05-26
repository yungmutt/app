import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import React, {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {firebase} from "../firebase";
import Feather from "@expo/vector-icons/Feather";
import SizedBox from "../components/SizedBox";

type Post = {
  title: string;
  body: string;
  media: Image[];
  id: string;
  author: {
    name: string;
    surname: string;
  };
}

const PostSc = ({route}: {route: any}) => {
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(true);
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const [post, setPost] = useState<Post | null>(null);
  const [loadingDeletePost, setLoadingDeletePost] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [media, setMedia] = useState<{url: string}[] | null>(null);

  const getPostDetails = async (id: string) => {
    setLoading(true);
    setIsMediaLoading(true);
    try {
      const snapshot = await firebase.firestore().collection('posts')
          .doc(id).get();
      if (snapshot.exists){
        const data = snapshot.data() as Post;
        //including the id of the post in the Post object
        const post = { ...data, id: snapshot.id };
        setPost(post);
        setMedia(post.media);
        setIsMediaLoading(false);
      } else {
        console.log('Could not find post');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const deletePost = async (id: string, title: string) => {
    Alert.alert('Delete post', `Delete "${title}"?`, [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel'
      },
      {
        text: 'Delete', onPress: async () => {
          setLoadingDeletePost(true);
          try {
            const db = firebase.firestore();
            await db.collection('posts').doc(id).delete();
            navigation.navigate('Home');
          } catch (e) {
            console.log('Error deleting your post: ',e);
          }
          setLoadingDeletePost(false);
        }
      }
    ]);
  }

  useEffect(() => {
    getPostDetails(route.params.id);
  }, [refresh]);

  return(
      <SafeAreaView style={styles.container}>
        <View style={styles.menu}>
          <TouchableOpacity onPress={() => deletePost(post?.id, post?.title)}>
            <Feather name='trash-2'
                     size={25}
                     color='white'/>
          </TouchableOpacity>
        </View>
          <View style={styles.postContainer}>
            <Text style={styles.entityTitle}>{post?.title}</Text>
            <Text style={styles.entityAuthor}>{post?.author?.name}, {post?.author?.surname}</Text>
            <Text style={styles.entityText}>{post?.body}</Text>
            <SizedBox height={20}/>
            {isMediaLoading ? (
                <ActivityIndicator size="large" color="white"/>
            ) : (
                   <Image
                       source={{uri: media?.url}}
                       style={styles.image}
                       resizeMode='cover'
                   />
            )}
          </View>
      </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8484ff',
  },
  postContainer: {
    marginHorizontal: 10,
  },
  entityTitle:{
    fontSize: 25,
    fontWeight: "bold",
    color: "#252573",
  },
  entityText: {
    fontSize: 20,
    color: '#333333',
  },
  entityAuthor: {
    fontSize: 17,
    color: '#a9a9af',
    alignSelf: "flex-end",
    marginHorizontal: 10,
  },
  menu: {
    marginTop: 20,
    marginHorizontal: 10,
    flexDirection: "row",
    alignSelf: "flex-end",
    gap: 5
  },
  image: {
    aspectRatio: 1,
  }
})

export default PostSc;