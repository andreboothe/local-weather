import React, { Component } from 'react';
import './App.css';
import Temperature from '../components/Temperature';
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

  getBgUrl = (condition) => {
    condition = condition.toLowerCase();
    let result = '';
    switch(condition){
      case "clouds":
        result += 'bg-clouds';
        break;
      case "sun":
        result += 'bg-sun';
        break;
      case "snow":
        result += 'bg-winter';
        break;
      case "rain":
        result += 'bg-rain';
        break;
      default:
      console.log('default');
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
          
          let bg = this.getBgUrl(weather.weather[0].main);
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
    
    const {temp, unit, isLoadingCoords, isLoadingWeather, 
          bgClass, country, name, description, windDeg, windSpeed} = this.state;

    return (isLoadingCoords)?
      <h1 className="loading-title">Loading Coords</h1>:
      (isLoadingWeather)?
        <h1 className="loading-title">Loading Weather</h1>:
      (
        // (document.body.style.background = `url('${bgUrl}')`)
        <div className={`App  center ${bgClass}`} >

          <h1 className="title">Local Weather App</h1>
          <div className="temp-section">
            <Temperature 
              unit={unit}
              temp={temp}  
              tempChange={this.onClickConvert}
            />
          </div>
          
          <div className="info-section">
            <InfoBlock data ={country +'\n' +name}/>
            <InfoBlock data ={description}/>
            <InfoBlock data ={degToCard(windDeg) +' ' +windSpeed +' knots'}/>
          </div>
          
        </div>
    );
  }
}

export default App;
