
import {
    ActivityIndicator,
    SafeAreaView,
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ScrollView, RefreshControl
} from "react-native";
import React, {useCallback, useEffect, useState} from "react";
import {firebase} from "../firebase";
import moment from "moment";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "react-native-screens/native-stack";


type EventItem = {
    id: string;
    name: string;
    dates: {
        start: {
            localDate: string;
            localTime: string;
        }
    }
}

const Home = () => {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = React.useState(false);

    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const getConcerts = async () => {
        try {
            const response = await fetch("https://app.ticketmaster.com/discovery/v2/events?apikey=pFb1A6GsboA31ednH81Y985KXdmkzCHi&locale=*&size=5&classificationName=music&geoPoint=51.2589173,22.5516489");
            const json = await response.json();
            const events = json._embedded.events;
            setEvents(events);
            console.log(events);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
        getConcerts();
    }, []);

    useEffect(() => {
        (async () => {
            await getConcerts();
        })();
    }, []);
    
    return(
        <SafeAreaView style={styles.container}>
            {isLoading ? (
                <ActivityIndicator color='black' size='large' style={{alignSelf: "center"}} />
            ) : (
                    <FlatList
                        style={styles.listContainer}
                        data={events}
                        keyExtractor={(item) => item.id.toString()}
                        refreshControl={
                            <RefreshControl refreshing={refreshing}
                                            onRefresh={onRefresh}/>}
                        renderItem={({item}) => (
                            <TouchableOpacity onPress={() => {
                                navigation.navigate("EventSc", {id: item.id})
                            }}>
                                <View style={styles.entityContainer}>
                                    <Text style={styles.entityTitle}>{item.name}</Text>
                                    <Text style={styles.entityText}>
                                        {moment(item.dates.start.localDate).format("DD/MM/YYYY")}
                                    </Text>
                                    <Text style={styles.entityText}>
                                        {item.dates.start.localTime}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                    )}
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: "center",
        backgroundColor: '#8484ff'
    },
    listContainer: {
        marginTop: 20,
        padding: 20,
    },
    entityContainer: {
        marginTop: 15,
        paddingTop: 5,
        paddingBottom: 13,
        paddingRight: 10,
        paddingLeft: 10,
        backgroundColor: '#9c9cff',
        borderRadius: 8
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
    }
})

export default Home;