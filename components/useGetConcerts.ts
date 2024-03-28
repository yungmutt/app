// import {useState} from "react";
// import {useNavigation} from "@react-navigation/native";
// import {NativeStackNavigationProp} from "react-native-screens/native-stack";
//
// type EventItem = {
//     id: string;
//     name: string;
//     dates: {
//         start: {
//             localDate: string;
//             localTime: string;
//         }
//     }
// }
//
// const [events, setEvents] = useState<EventItem[]>([]);
// const [isLoading, setLoading] = useState(true);
//
// export const getConcerts = async () => {
//     try {
//         const response = await fetch("https://app.ticketmaster.com/discovery/v2/events?apikey=pFb1A6GsboA31ednH81Y985KXdmkzCHi&locale=*&size=5&classificationName=music&geoPoint=51.2589173,22.5516489");
//         const json = await response.json();
//         const events = json._embedded.events;
//         setEvents(events);
//         console.log(events);
//     } catch (error) {
//         console.error(error);
//     } finally {
//         setLoading(false)
//     }
// };