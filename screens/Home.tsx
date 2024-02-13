import {ActivityIndicator, SafeAreaView, Text, View, StyleSheet, TouchableOpacity, FlatList} from "react-native";
import React, {useEffect, useState} from "react";
import {firebase} from "../firebase";


type EventItem = {
    id: string;
    name: string;
    localDate: string;
    localTime: string;

}

const Home = () => {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getConcerts = async () => {
        try {
            const response = await fetch("https://app.ticketmaster.com/discovery/v2/events?apikey=pFb1A6GsboA31ednH81Y985KXdmkzCHi&locale=*&size=5&classificationName=music&geoPoint=51.2589173,22.5516489");
            const events = await response.json();
            setEvents(events);
            console.log(events)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        (async () => {
            await getConcerts();
        })();
    }, []);
    
    return(
        <SafeAreaView style={styles.container}>
            {isLoading ? (
                <ActivityIndicator color='black' size='large' />
            ) : (
                <FlatList
                    style={styles.listContainer}
                    data={events}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) => (
                        <View style={styles.entityContainer}>
                            <Text style={styles.entityText}>{item.name}</Text>
                            <Text style={styles.entityText}>
                                {item.localDate}
                            </Text>
                            <Text style={styles.entityText}>
                                {item.localTime}
                            </Text>
                        </View>
                    )}
                />
                    )}
        </SafeAreaView>
    )


    // const renderItem = ({item}: {item: EventItem}) => (
    //     item._embedded.events.map((concert) => (
    //         <ListItem
    //             name={concert.name}
    //             dates={[concert.dates.start.localDate, concert.dates.start.localTime]}
    //         />))
    // )
    // return(
    //         <SafeAreaView style={styles.container}>
    //             <Text>Home</Text>
    //             <FlatList data={eventsData} renderItem={renderItem} keyExtractor={(item, index) => index.toString(0)} />
    //         </SafeAreaView>

    // )
};

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

export default Home;