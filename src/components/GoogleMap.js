import React from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import Geocode from './Geocode'

function MyComponent(props) {
    //Google maps
    const [lon, setlon] = React.useState({
    })

    async function getLatLng(){
        var address = await Geocode.getGeoCode(props.address)
        setlon(address)
    }

    const containerStyle = {
        width: '400px',
        height: '400px'
    };
    
    const center = {
        lat: lon.lat,
        lng: lon.lng
    };
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyDkuBax-kaENrHZ4UMglkXD1C7xgwxogO8"
    })

    React.useEffect(() => {
        getLatLng()
    }, [])

    const [map, setMap] = React.useState(null)

    const onLoadMap = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds();
        map.fitBounds(bounds);
        setMap(map)
    }, [])

    const onLoadMarker = marker => {
        // console.log('marker: ', marker)
      }

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
            onLoad={onLoadMap}
            onUnmount={onUnmount}
        >
            <Marker
                onLoad={onLoadMarker}
                position={lon}
            />
            { /* Child components, such as markers, info windows, etc. */}
            <></>
        </GoogleMap>
    ) : <></>
}

export default React.memo(MyComponent)