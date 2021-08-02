import React from 'react'
import ReactWeather, { useOpenWeather } from 'react-open-weather';
import Geocode from './Geocode'


function MyComponent(props) {
    const [lon, setlon] = React.useState({
    })

    async function getLatLng() {
        var address = await Geocode.getGeoCode(props.address)
        setlon(address)
    }
    React.useEffect(() => {
        getLatLng()
    }, [])

    const { data, isLoading, errorMessage } = useOpenWeather({
        key: process.env.REACT_APP_WEATHER_API_KEY,
        lat: lon.lat,
        lon: lon.lng,
        lang: 'en',
        unit: 'imperial', // values are (metric, standard, imperial)
    });
    // const containerStyle = {
    //     width: '400px',
    //     height: '400px'
    // };
    return (
        <div
        // style = {
        //     {width : "100px"}
        // }
        >
            <ReactWeather
                isLoading={isLoading}
                errorMessage={errorMessage}
                data={data}
                lang="en"
                locationLabel={props.address}
                unitsLabels={{ temperature: 'F', windSpeed: 'M/h' }}
                showForecast
            //style = {
            //{width : "50%"}
            //}
            />
        </div>

    );
};

export default React.memo(MyComponent)


export async function weatherAPI(address) {

    const { lat, lng } = await Geocode.getGeoCode(address)

    console.log(lat, lng)

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=minutely,hourly&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=imperial`, requestOptions)
        const result = await response.json();
        console.log(result);
        return result;
    } catch (error) {
        return error;
    }
}