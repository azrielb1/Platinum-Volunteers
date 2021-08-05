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
   
    return (
        <div>
            <ReactWeather
                isLoading={isLoading}
                errorMessage={errorMessage}
                data={data}
                lang="en"
                locationLabel={props.address}
                unitsLabels={{ temperature: 'F', windSpeed: 'M/h' }}
                showForecast
            />
        </div>

    );
};
export default React.memo(MyComponent)
