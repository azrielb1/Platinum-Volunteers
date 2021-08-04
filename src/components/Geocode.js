import Geocode from "react-geocode";


var lib = {}
lib.getGeoCode = async function (address) {
    Geocode.setApiKey("AIzaSyDkuBax-kaENrHZ4UMglkXD1C7xgwxogO8");
    let result;
    try {
        result = await Geocode.fromAddress(address)
    } catch(err) {
        result = await Geocode.fromAddress("Empire State Building")
       
    }
    
    //.then(
    //(response) => {
    const { lat, lng } = result.results[0].geometry.location;
    return {
        lat: lat,
        lng: lng
    }
    //},
    // (error) => {
    //     console.error(error);
    // }
    //);
}



// function MyComponent() {
//     const [geoState, setGeoState] = React.useState({
//         lat: 0,
//         lng: 0
//     })
//     //Geocoder
//     function getGeoCode(props) {
//         Geocode.setApiKey("AIzaSyDkuBax-kaENrHZ4UMglkXD1C7xgwxogO8");
//         Geocode.fromAddress(props).then(
//             (response) => {
//                 const { lat, lng } = response.results[0].geometry.location;
//                 // console.log(lat, lng);
//                 setGeoState({
//                     lat: lat,
//                     lng: lng
//                 })
//             },
//             (error) => {
//                 console.error(error);
//             }
//         );

//     }
// }
// export default React.memo(MyComponent)
export default lib