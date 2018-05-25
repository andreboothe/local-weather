import React, { Component } from 'react';
import './App.css';
import Temperature from '../components/Temperature';
import InfoBlock from '../components/InfoBlock';
import degToCard from '../components/degToCard'

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
      bgUrl: '',
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
      position.coords.latitude.toFixed(2), 
      position.coords.longitude.toFixed(2)
    ];
    this.setState({coords: pos, isLoadingCoords: false});
    
  }

  getBgUrl = (condition) => {
    condition = condition.toLowerCase();
    let result = '';
    switch(condition){
      case "clouds":
        result += '../images/cloud.jpg';
        break;
      case "sun":
        result += '../images/sun.jpg';
        break;
      case "snow":
        result += '../images/winter.jpg';
        break;
      case "rain":
        result += '../images/rain.jpg';
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
            bgUrl: bg,                            
            isLoadingWeather: false 
          }); 
        });
    }
  }

  toFahrenheit = (c) => {
    return c * (9/5) + 32;
  }

  toCelcius = (f) => {
    return (f - 32) * (5/9);
  }

  onClickConvert = () => {
    let tempChange = 0;
    
    if(this.state.unit === 'Celcius'){
      tempChange = this.toFahrenheit(this.state.temp).toFixed();
      this.setState({temp: tempChange, unit: 'Fahrenheit'});
    }
    else{
      tempChange = this.toCelcius(this.state.temp).toFixed();
      this.setState({temp: tempChange, unit: 'Celcius'});
    }
  }
 
  componentDidMount(){
    this.getLocation();
    setTimeout(() => this.setLocalWeather(),1500);  
  }

  render() {
    console.log(this.state.bgUrl);
    return (this.state.isLoadingCoords)?
    <h1>Loading Coords</h1>:
    (this.state.isLoadingWeather)?
      <h1>Loading Weather</h1>:
    (
      <div className="App center" 
        style={{ 
          background: `url('${this.state.bgUrl}')`,
          backgroundSize: 'cover',
        }}>

        <h1>Local Weather App</h1>
        <div className="temp-section">
          <Temperature 
            unit={this.state.unit}
            temp={this.state.temp}  
            tempChange={this.onClickConvert}
          />
        </div>
        
        

        <div className="info-section">
          <InfoBlock data ={this.state.country +'\n' +this.state.name}/>
          <InfoBlock data ={this.state.description}/>
          <InfoBlock data ={degToCard(this.state.windDeg) +' ' +this.state.windSpeed +' knots'}/>
        </div>
        
      </div>
    );
  }
}

export default App;
