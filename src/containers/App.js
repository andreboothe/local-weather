import React, { Component } from 'react';
import './App.css';
import InfoBlock from '../components/InfoBlock';
import degToCard from '../components/degToCard'
import {toCelcius, toFahrenheit} from '../components/tempConverter'

class App extends Component {

  constructor() {
    super();
    this.state = {
      temp: 0,
      unit: '',
      coords: [],
      main: '',
      description: '',
      icon: '',
      windSpeed: '',
      name: '',
      country: '',
      windDeg: 0,
      bgClass: '',
      bgSkyClass: '',
      humidity:0,
      iconUrl:'',
      isLoadingCoords: true,
      isLoadingWeather: true
    }
  }

  getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.setCoords);
    } else {
        prompt( "Geolocation is not supported by this browser.");
    }
    
  }

  setCoords = (position) => {
    const pos = [
      position.coords.latitude, 
      position.coords.longitude
    ];
    this.setState({coords: pos, isLoadingCoords: false});
    
  }

  getBgClass = (conditionCode) => {

    return  (conditionCode >= 200 && conditionCode <= 232)?'bg-thunderstorm':
              (conditionCode >= 500 && conditionCode <= 531)?'bg-rain':
                (conditionCode >= 300 && conditionCode <= 321)?'bg-drizzle':
                  (conditionCode >= 600 && conditionCode <= 622)?'bg-snow':
                    (conditionCode === 800)?'bg-clear-sky':
                      (conditionCode === 741)?'bg-fog':
                        (conditionCode >= 801 && conditionCode <= 802)?'bg-partly-cloudy':
                          (conditionCode >= 803 && conditionCode <= 804)?'bg-overcast': 'bg-nature';
  }

  setBgSky = (bgImage) => {
    let result = ''
    switch(bgImage){
      case 'bg-thunderstorm':
      case 'bg-snow':
        result += 'bg-stormy-sky';
        break;
      case 'bg-rain':
      case 'bg-drizzle':
      case 'bg-fog':
      case 'bg-overcast':
        result += 'bg-overcast-sky';
        break;
      case 'bg-clear-sky':
        result += 'bg-sunny-sky';
        break;
      case 'bg-partly-cloudy':
        result += 'bg-cloud-sky';
        break;
      default:
        result += 'bg-sunny-sky';
        break;
    }
    return result;
  }

  setLocalWeather = () => {
    if(!this.state.isLoadingCoords){
      let lat = this.state.coords[0];
      let lon = this.state.coords[1];
    
      fetch(`https://fcc-weather-api.glitch.me/api/current?lat=${lat}&lon=${lon}`)
        .then(response => response.json())
        .then(weather => {
          
          let bg = this.getBgClass(weather.weather[0].id);
          let sky = this.setBgSky(bg);
          this.setState({
            main: weather.weather[0].main,
            temp: weather.main.temp,
            description: weather.weather[0].description,
            icon: weather.weather[0].icon,
            windSpeed: weather.wind.speed,
            windDeg: weather.wind.deg,
            country: weather.sys.country,
            name: weather.name,
            unit: 'Celcius',  
            bgClass: bg,
            humidity: weather.main.humidity,
            bgSkyClass: sky,
            iconUrl:weather.weather[0].icon,                           
            isLoadingWeather: false 
          }); 
        });
      
    }
    else{
      setTimeout(() => this.setLocalWeather(),100);  
    }
  }

  onClickConvert = () => {
    let tempChange = 0;
    
    if(this.state.unit === 'Celcius'){
      tempChange = toFahrenheit(this.state.temp).toFixed();
      this.setState({temp: tempChange, unit: 'Fahrenheit'});
    }
    else{
      tempChange = toCelcius(this.state.temp).toFixed();
      this.setState({temp: tempChange, unit: 'Celcius'});
    }
  }
 
  componentDidMount(){
    this.getLocation();
    this.setLocalWeather();  
  }

  render() {
    
    const {temp, unit, isLoadingCoords, iconUrl, 
          isLoadingWeather, bgSkyClass ,humidity,
          bgClass, country, name, description, windDeg, windSpeed} = this.state;

    return (isLoadingCoords)?
      <h1 className="loading-title">Loading Coords</h1>:
      (isLoadingWeather)?
        <h1 className="loading-title">Loading Weather</h1>:
      (
       
        <div className="App" >

          <div className="container">
         
            <section className= {`local-weather ${bgSkyClass}`}>
              <h1 className="title">Local Weather App</h1>
              <p className="message">Find out the temperature,<br/> weather conditions and more in your area...</p>
             
              <div className={`image   ${bgClass}`}>
                
              </div>
            </section>

            <section className="bg-dark">
              <div className="info-section">
                <InfoBlock 
                  location = {country +'\n' +name}
                  weatherCondition = {description}
                  windData = {degToCard(windDeg) +' ' +windSpeed +' knots'}
                  unit = {unit}
                  temp = {temp}
                  humidity = {humidity}
                  tempChange = {this.onClickConvert}
                  iconUrl ={iconUrl}
                />
              </div>
            </section>
          </div>
          
          
          
          
        </div>
    );
  }
}

export default App;
