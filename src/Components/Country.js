import React, { Component } from 'react';


const API_KEY = "UMXbOUbR7pacMTpAAxelDYVZCN2drgfa"
var moment = require('moment');


class Country extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openInput: false,
            countries: [],
            latitude: "",
            longitude: "",
            timezone: 'Timezone',
            summary: 'Add a new city.',
            city: "",
            daily: []
        }
    }

    addCity = () => {
        this.setState({
            openInput: true
        });
    }
    componentDidMount() {
        setTimeout(() => this.setState({ loading: false }), 1500);
        this.fetchLocation(this.props.match.params.cityName);
    }

    componentWillReceiveProps(newProps) {
        this.fetchLocation(this.props.match.params.cityName);
    }

    fetchLocation = (country) => {

        fetch(`https://www.mapquestapi.com/geocoding/v1/address?key=${API_KEY}&inFormat=kvp&outFormat=json&location=${country}`)
            .then(res => res.json())
            .then(data => {
                var lat = data.results[0].locations[0].latLng.lat
                var lng = data.results[0].locations[0].latLng.lng
                this.setState({
                    latitude: "Latitude: " + data.results[0].locations[0].latLng.lat,
                    longitude: "Longitude: " + data.results[0].locations[0].latLng.lng,
                    city: data.results[0].providedLocation.location
                })
                this.addInformation(lat, lng);
            })
    }

    addInformation = (lat, lng) => {
        fetch(`https://api.darksky.net/forecast/4f250742483450c4a38f5bf0cc93d4ff/${lat},${lng}`)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    timezone: data.timezone,
                    summary: data.hourly.summary,
                    daily: [...data.daily.data]
                })
            })
    }
    renderIcon = iconName => {
        const icons = {
            'clear-day': 'https://www.amcharts.com/wp-content/themes/amcharts2/css/img/icons/weather/animated/day.svg',
            'partly-cloudy-day': 'https://www.amcharts.com/wp-content/themes/amcharts2/css/img/icons/weather/animated/cloudy-day-1.svg',
            'partly-cloudy-night': 'https://www.amcharts.com/wp-content/themes/amcharts2/css/img/icons/weather/animated/cloudy-night-1.svg',
            'rain': 'https://www.amcharts.com/wp-content/themes/amcharts2/css/img/icons/weather/animated/rainy-1.svg',
            'cloudy': 'https://www.amcharts.com/wp-content/themes/amcharts2/css/img/icons/weather/animated/cloudy.svg',
            'fog': 'https://raw.githubusercontent.com/rickellis/SVG-Weather-Icons/7824dc80e8b35f651186a63c98c861e470deeed6/DarkSky/fog.svg',

        };

        return <img src={icons[iconName]} />
    }
    render() {
        return (
            <div>
                <h3>{this.state.timezone}</h3>
                <p>{this.state.summary}</p>
                <h5>Weekly</h5>



                <tbody className='week'>
                    {this.state.daily.map(day => {
                        return (

                            <div className='containerInfo'>
                                <div className='day__icon'>{this.renderIcon(day.icon)}</div>
                                <div className="date">{moment(`${day.time}`, "X").format('dddd')}</div>
                                <div className="date">{moment(`${day.time}`, "X").format("l")}</div>
                                <div className="wind">Temperature</div>
                                <div className="wind">{day.apparentTemperatureHigh}</div>
                                <div className="pressure">Pressure</div>
                                <div className="pressure">{day.pressure}</div>
                                <div className="wind">Wind Speed</div>
                                <div className="wind">{day.windSpeed}</div>
                            </div>

                        );
                    })
                    }
                </tbody>

            </div>
        );
    }
}



export default Country;
