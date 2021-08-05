import Geocode from "react-geocode";


var lib = {}
lib.getGeoCode = async function (address) {
    Geocode.setApiKey("AIzaSyDkuBax-kaENrHZ4UMglkXD1C7xgwxogO8");
    let result;
    try {
        result = await Geocode.fromAddress(address)
    } catch(err) {
        console.log(err)
    }
    
    const { lat, lng } = result.results[0].geometry.location;
    return {
        lat: lat,
        lng: lng
    }
}
export default lib