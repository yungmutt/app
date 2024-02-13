// import * as Location from 'expo-location';
// import {useEffect, useState} from "react";
//
//
// export const useGetConcerts = () => {
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [concerts, setConcerts] = useState([]);
//     const [lat, setLat] = useState(null);
//     const [lon, setLon] = useState(null);
//
//     const fetchConcerts = async (lat: number, lon: number) => {
//         try {
//             const res = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&getPoint=${lat},${lon}&apikey=pFb1A6GsboA31ednH81Y985KXdmkzCHi`)
//             const data = await res.json();
//             setConcerts(data)
//         } catch (e) {
//             console.log(e.message);
//         } finally {
//             setLoading(false)
//         }
//     }
//
//     useEffect(() => {
//         (async() => {
//             let {status} = await Location.requestBackgroundPermissionsAsync()
//             if (status !== 'granted') {
//                 setError('Permission denied')
//                 return
//             }
//             let location = await Location.getCurrentPositionAsync({})
//             await fetchConcerts(location.coords.latitude, location.coords.longitude)
//         })()
//     }, [])
//     return [loading, error, concerts]
// }