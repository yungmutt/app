
import React, {useEffect, useState} from 'react';
import {firebase} from "../firebase";
import {
    SafeAreaView,
    Text,
    StyleSheet,
    ActivityIndicator,
    View,
    ScrollView,
    RefreshControl,
    TouchableOpacity, FlatList
} from "react-native";
import moment from "moment/moment";
import {Image} from "react-native";
import {useNavigation} from "@react-navigation/native";
import SizedBox from "../components/SizedBox";

type EventDetails = {
    id: string;
    name: string;
    dates: {
        start: {
            localDate: string;
            localTime: string;
        }
    };
    images: Image[];
    _embedded: {
        venues: {
            name: string;
            city: {
                name: string;
            };
            country: {
                name: string;
            };
            address: {
                linel: string;
            }
        }
    }
}

type Posts = {
    title: string;
    body: string;
    id: string;
    author: string;
}

const EventSc = ({route}: {route: any}) => {
  const navigation = useNavigation();
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [posts, setPosts] = useState<Posts[]>([]);

  const getEventDetails = async () => {
    try {
        const res = await fetch(`https://app.ticketmaster.com/discovery/v2/events/${route.params.id}?apikey=pFb1A6GsboA31ednH81Y985KXdmkzCHi&locale=*`);
        const json = await res.json();
        setEventDetails(json);
    } catch (err) {
        console.log(err);
    } finally {
        setLoading(false);
    }
  };

  const getPosts = async (eventId: EventDetails) => {
      setLoading(true);
      try {
          const snapshot = await firebase.firestore().collection('posts')
              .where('eventId', '==', eventId).get();

          if (!snapshot.empty){
              const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              setPosts(posts);
          } else {
              console.log('No posts found');
          }
      } catch (err) {
          console.log(err);
      } finally {
          setLoading(false);
      }
  }

  const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      setTimeout(() => {
          setRefreshing(false);
      }, 1500);
      getEventDetails();
      getPosts();
  }, [setRefreshing]);

  useEffect(() =>{
      ( async () => {
          await getEventDetails();
          await getPosts(route.params.id);
      })();
  }, []);

  return(
      <SafeAreaView style={styles.container}>
          {isLoading ? (
              <ActivityIndicator color='black' size='large' style={{alignSelf: "center"}} />
              ) : (
                  <>
                      <View>
                          <Text style={styles.entityTitle}>{eventDetails?.name}</Text>
                          <Text style={styles.entityText}>
                              {moment(eventDetails?.dates?.start?.localDate).format("DD/MM/YYYY")}
                          </Text>
                          <Text style={styles.entityText}>
                              {eventDetails?.dates?.start?.localTime}
                          </Text>
                          <Text style={styles.entityText}>Location: {eventDetails?._embedded.venues[0].city.name}, {eventDetails?._embedded.venues[0].country.name}</Text>
                          <Text>{eventDetails?._embedded.venues[0].address.linel}</Text>
                          {eventDetails?.images?.slice(0,1).map((image: Image, index) => (
                              <Image key={index}
                                     source={{uri: image.url}}
                                     style={{
                                         width: '90%',
                                         aspectRatio: image.width / image.height,
                                    }}
                                     resizeMode='cover'
                              />
                          ))}
                      </View>
                      <View>
                          <TouchableOpacity style={styles.button}
                                            onPress={() => navigation.navigate('CreatePost', { eventId: eventDetails.id})}>
                              <Text style={styles.buttonTitle}>Add Post</Text>
                          </TouchableOpacity>
                      </View>
                      <View>
                          <FlatList data={posts}
                                    style={styles.postListContainer}
                                    renderItem={({item}) => {
                              return <View style={styles.postContainer}>
                                  <Text style={styles.postTitle}>{item.title}</Text>
                                  <Text style={styles.postBody}>{item.body.slice(0, 100)}...</Text>
                                    </View>
                          }}
                                    keyExtractor={(item) => item.id}
                                    ListFooterComponent={() => (posts && posts.length === 0) && <Text>No posts so far...</Text>}
                                    ItemSeparatorComponent={() => <SizedBox height={15}/> }
                                    refreshControl={
                                        <RefreshControl refreshing={refreshing}
                                                        onRefresh={onRefresh}/>
                                    }
                          />
                      </View>
                  </>
          )}
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
        fontSize: 20,
        fontWeight: 'bold'
    },
    entityTitle:{
        fontSize: 25,
        fontWeight: "bold",
        color: "#252573"
    },
    entityText: {
        fontSize: 20,
        color: '#333333',
        alignItems: "center"
    },
    button: {
        backgroundColor: '#6582f3',
        marginLeft: 60,
        marginRight: 60,
        paddingLeft: 5,
        paddingRight: 5,
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
    postListContainer: {
        padding: 5,
    },
    postContainer: {
        marginTop: 15,
        paddingTop: 5,
        paddingBottom: 13,
        paddingRight: 10,
        paddingLeft: 10,
        backgroundColor: '#9c9cff',
        borderRadius: 8
    },
    postTitle:{
        fontSize: 20,
        fontWeight: "bold",
        color: "#252573"
    },
    postBody: {
        fontSize: 15,
        color: '#333333',
        alignItems: "center"
    }
})

export default EventSc;