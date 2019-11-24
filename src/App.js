import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import Titles from './components/titles';
//import './PastWeatherform.css';
import Form from './components/form';
import Weather from './components/weather';
import PastWeatherForm from './components/PastWeatherForm';
import Canvas from './components/Canvas.jsx';
import { isMoment } from 'moment';
import Chart from './components/Chart';
import {Bar, Line, Pie} from 'react-chartjs-2';
import windmill from './windmill.svg';

const API_KEY="301d2717ec3a763210336cd7e1db6438";
const PastWeather_API_KEY="0147d864847641e0937222705192311";
class App extends  Component {
  constructor(){
    super();
    this.state={
              temp:undefined,
              tempmin:undefined,
              tempmax:undefined,
              country:undefined,
              city:undefined,
              humidity:undefined,
              desc:undefined,
              wspeed:undefined,
              error:undefined,
              pastcity:undefined,
              paststartdate:undefined,
              pastenddate:undefined,
              location: undefined,
              chartData:[],
              daterange: [],
              windData:[],
              selectedOption:undefined,
              rainData:undefined
            }
this.handleChangeStart = this.handleChangeStart.bind(this);
this.handleChangeEnd = this.handleChangeEnd.bind(this);
this.handleOptionChange = this.handleOptionChange.bind(this);
this.handleOptionChange1 = this.handleOptionChange1.bind(this);
this.handleOptionChange2 = this.handleOptionChange2.bind(this);
          }
  // componentWillMount(){
  //  this.getPastWeather();
  // }
  getWeather= async (e)=>{
    e.preventDefault();
    const city=e.target.elements.pastcity.value;
    const country=e.target.elements.pcountry.value;
    const api_call=await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}`);
    const data= await api_call.json();
    console.log(data);
    if(city && country)
    {
    console.log(data);
    this.setState({temp:(data.main.temp-data.main.temp%1)-273,
                    tempmin:(data.main.temp_min-data.main.temp_min%1)-273,
                    tempmax:(data.main.temp_max-data.main.temp_max%1)-273,
                  country:data.sys.country,
                  city:data.name,
                  humidity:data.main.humidity,
                  desc:data.weather[0].description,
                  wspeed:data.wind.speed,
                error:""});
    }
    else
    {
    alert('Please input city and country');
  }
  }
  getPastWeather= async (e)=>{
    e.preventDefault();
    if(e.target.elements.pastcity.value && this.state.paststartdate)
    {console.log(this.state.paststartdate);
    const pastcity=e.target.elements.pastcity.value;
    const paststartdate=[this.state.paststartdate.getFullYear(),this.state.paststartdate.getMonth()+1,this.state.paststartdate.getDate()].join('-');
    let pastenddate = "";
    let urlstring ="";
    if(typeof this.state.pastenddate!=="undefined" && e.target.elements.pastenddate.value  )
    {
    pastenddate=[this.state.pastenddate.getFullYear(),this.state.pastenddate.getMonth()+1,this.state.pastenddate.getDate()].join('-'); 
     urlstring = "&enddate=";
  }
    // console.log(paststartdate);
    // console.log(pastcity);
    // console.log(pastenddate);
    if (pastcity && paststartdate)
    { 
    const pastweatherapi_call=await fetch(`http://api.worldweatheronline.com/premium/v1/past-weather.ashx?q=${pastcity}&format=JSON&date=${paststartdate}${urlstring}${pastenddate}&key=${PastWeather_API_KEY}`);
    const pastdata= await pastweatherapi_call.json(); 
    console.log(pastdata);
      let templabel=[];
      let tempdatasets={};
      let tempdaterange=[];

      for(var i=0;i <pastdata.data.weather.length;i++)
      {
         templabel[i] = 'Temperature variation on ' + pastdata.data.weather[i].date;
         tempdaterange[i] = pastdata.data.weather[i].date;
          tempdatasets[i] = { label: 'Temperature variation on ' + pastdata.data.weather[i].date,
                                            data: [pastdata.data.weather[i].hourly[0].tempC,pastdata.data.weather[i].hourly[1].tempC,
                                                  pastdata.data.weather[i].hourly[2].tempC,pastdata.data.weather[i].hourly[3].tempC,
                                                  pastdata.data.weather[i].hourly[4].tempC,pastdata.data.weather[i].hourly[5].tempC,
                                                  pastdata.data.weather[i].hourly[6].tempC,pastdata.data.weather[i].hourly[7].tempC],
                                            backgroundColor:[
                                                    'rgba(0, 162, 235, 0.6)',
                                                    'rgba(0, 162, 235, 0.6)',
                                                    'rgba(0, 162, 235, 0.6)',
                                                    'rgba(0, 162, 235, 0.6)',
                                                    'rgba(0, 162, 235, 0.6)',
                                                    'rgba(0, 162, 235, 0.6)',
                                                    'rgba(0, 162, 235, 0.6)',
                                                    'rgba(0, 162, 235, 0.6)']}
          }
          let chartdata1 = [];
          for(var i=0;i <pastdata.data.weather.length;i++)
          { chartdata1[i] = [...chartdata1, { labels :  ['00:00','03:00 am','06:00 am', '09:00 am', '12:00 pm','03:00 pm','06:00 pm','09:00 pm'],
                                              datasets : tempdatasets[i]
                                          }]}
          let templabelWind=[];
          let tempdatasetsWind=[];
          for(var i=0;i <pastdata.data.weather.length;i++)
      {
         templabelWind[i] = 'Wind Speed on ' + pastdata.data.weather[i].date;
          tempdatasetsWind[i] = { label: 'Wind Speed on ' + pastdata.data.weather[i].date,
                                            data: [pastdata.data.weather[i].hourly[0].WindGustKmph,pastdata.data.weather[i].hourly[1].WindGustKmph,
                                                  pastdata.data.weather[i].hourly[2].WindGustKmph,pastdata.data.weather[i].hourly[3].WindGustKmph,
                                                  pastdata.data.weather[i].hourly[4].WindGustKmph,pastdata.data.weather[i].hourly[5].WindGustKmph,
                                                  pastdata.data.weather[i].hourly[6].WindGustKmph,pastdata.data.weather[i].hourly[7].WindGustKmph],
                                            backgroundColor:[
                                                    'rgba(0, 162, 235, 0.6)',
                                                    'rgba(0, 162, 235, 0.6)',
                                                    'rgba(0, 162, 235, 0.6)',
                                                    'rgba(0, 162, 235, 0.6)',
                                                    'rgba(0, 162, 235, 0.6)',
                                                    'rgba(0, 162, 235, 0.6)',
                                                    'rgba(0, 162, 235, 0.6)',
                                                    'rgba(0, 162, 235, 0.6)']}
          }
          let chartdataWind1 = [];
          for(var i=0;i <pastdata.data.weather.length;i++)
          { chartdataWind1[i] = [...chartdataWind1, { labels :  ['00:00','03:00 am','06:00 am', '09:00 am', '12:00 pm','03:00 pm','06:00 pm','09:00 pm'],
                                              datasets : tempdatasetsWind[i]
                                          }]}
                                          let templabelRain=[];
                                          let tempdatasetsRain=[];
                                          for(var i=0;i <pastdata.data.weather.length;i++)
                                      {
                                         templabelRain[i] = 'Rain variation on ' + pastdata.data.weather[i].date;
                                          tempdatasetsRain[i] = { label: 'Rain variation on ' + pastdata.data.weather[i].date,
                                                                            data: [pastdata.data.weather[i].hourly[0].precipMM,pastdata.data.weather[i].hourly[1].precipMM,
                                                                                  pastdata.data.weather[i].hourly[2].precipMM,pastdata.data.weather[i].hourly[3].precipMM,
                                                                                  pastdata.data.weather[i].hourly[4].precipMM,pastdata.data.weather[i].hourly[5].precipMM,
                                                                                  pastdata.data.weather[i].hourly[6].precipMM,pastdata.data.weather[i].hourly[7].precipMM],
                                                                            backgroundColor:[
                                                                                    'rgba(0, 162, 235, 0.6)',
                                                                                    'rgba(0, 162, 235, 0.6)',
                                                                                    'rgba(0, 162, 235, 0.6)',
                                                                                    'rgba(0, 162, 235, 0.6)',
                                                                                    'rgba(0, 162, 235, 0.6)',
                                                                                    'rgba(0, 162, 235, 0.6)',
                                                                                    'rgba(0, 162, 235, 0.6)',
                                                                                    'rgba(0, 162, 235, 0.6)']}
                                          }
                                          let chartdataRain1 = [];
                                          for(var i=0;i <pastdata.data.weather.length;i++)
                                          { chartdataRain1[i] = [...chartdataRain1, { labels :  ['00:00','03:00 am','06:00 am', '09:00 am', '12:00 pm','03:00 pm','06:00 pm','09:00 pm'],
                                                                              datasets : tempdatasetsRain[i]
                                                                          }]}                                  
      this.setState({
        location: pastdata.data.request[0].query,
        daterange : tempdaterange,
        chartData:chartdata1,
        windData:chartdataWind1,
        rainData: chartdataRain1,
        error:""
        });
      
//         console.log(this.state.location);
//         console.log(pastdata);
//                   console.log(this.state.chartData.length);
//                   console.log(pastdata.data.request[0].query);
//                   console.log(pastdata.data.weather[0].date);
//                   console.log(pastdata.data.weather[pastdata.data.weather.length-1].date);
//  //                 console.log(this.state.chartData[0].datasets.data);
//                     console.log(this.state.chartData[0][0].datasets.data);
//                     console.log(this.state.windData[0][0].datasets.data);
//                     // console.log(this.state.chartData);
      
      }
        else
    {
    alert('Please input valid city and dates');}
  }
  else
    {
    alert('Please input valid city and dates');}}

    wrapperFunction = (event) => {
      //do something
      this.getPastWeather(event);
      //do something
      this.getWeather(event);
  }

  handleChangeStart(d){
    
    this.setState({paststartdate: d});
  }

  handleChangeEnd(d){
 
    this.setState({pastenddate: d});
  }

  handleOptionChange()
  {
    this.setState({ selectedOption: '1'
    });
  }

  handleOptionChange1()
  {
    this.setState({ selectedOption: '2'
    });
  }
  handleOptionChange2()
  {
    this.setState({ selectedOption: '3'
  });
}

  render() 
  {  let tempcharts = [];
    let windcharts = [];
    let raincharts = [];
   
    for(var o=0; o < this.state.chartData.length; o++)
    { 
      let databar = {
        labels :  ['00:00','03:00 am','06:00 am', '09:00 am', '12:00 pm','03:00 pm','06:00 pm','09:00 pm'],
        datasets: [
          {
            label: 'Temperature in celsius ',
            backgroundColor:[
                    'rgba(0, 162, 235, 0.6)',
                    'rgba(0, 162, 235, 0.6)',
                    'rgba(0, 162, 235, 0.6)',
                    'rgba(0, 162, 235, 0.6)',
                    'rgba(0, 162, 235, 0.6)',
                    'rgba(0, 162, 235, 0.6)',
                    'rgba(0, 162, 235, 0.6)',
                    'rgba(0, 162, 235, 0.6)'],
              borderColor: 'rgba(255,99,132,1)',
              borderWidth: 1,
              hoverBackgroundColor: 'rgba(255,99,132,0.4)',
              hoverBorderColor: 'rgba(255,99,132,1)',
              data: this.state.chartData[o][o].datasets.data,
              
          }
        ] };

     tempcharts.push(
       <div style={{display: 'inline-block',width: '650px',height: '325px',padding: '5px',margin:'5px',border: '2px solid blue'}}>
     <Bar 
          data ={databar}
          options={{
                      scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: false
                                    }
                               }]
                              },
                    title:{
                        display:true,
                        text:'Temperature variation in '+this.state.location+ ' on '+ this.state.daterange[o],
                        fontSize:25
                          },
                    legend:{
                        display:true,
                        position:'right'
                            },
                    animation: {
                        duration: 3000,
                        easing: 'easeInBounce',
                              // onProgress: function(animation) {
                              //    progress.value = animation.animationObject.currentStep / animation.animationObject.numSteps;
                              // }
                            },
                          }} />
                          </div>);
                        }
       for(var o=0; o < this.state.windData.length; o++)
      { let datawind =
        {
          labels :  ['00:00','03:00 am','06:00 am', '09:00 am', '12:00 pm','03:00 pm','06:00 pm','09:00 pm'],
          datasets: [
                  {
          label: 'Wind speed in Km/hr ',
          backgroundColor:[
                'rgba(0, 0, 0, 0.6)',
                'rgba(0, 62, 235, 0.6)',
                'rgba(0, 62, 235, 0.6)',
                'rgba(0, 62, 235, 0.6)',
                'rgba(0, 62, 235, 0.6)',
                'rgba(0, 62, 235, 0.6)',
                'rgba(0, 62, 235, 0.6)',
                'rgba(0, 62, 235, 0.6)'],
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
          hoverBorderColor: 'rgba(255,99,132,1)',
          data: this.state.windData[o][o].datasets.data,
         
          type: 'line',
          fill: true
        }]};

        windcharts.push(  
          <div style={{display: 'inline-block',width: '650px',height: '325px',padding: '5px',margin:'5px',border: '2px solid blue'}}>
          <Line 
               data ={datawind}
               options={{
                         responsive: true,
                         hoverMode: 'index',
                         title:{
                             display:true,
                             text:'Wind speed in '+this.state.location+ ' on '+ this.state.daterange[o],
                             fontSize:25
                               },
                         legend:{
                             display:true,
                             position:'right'
                                 },
                         animation: {
                             duration: 3000,
                             easing: 'easeInBounce',
                                   // onProgress: function(animation) {
                                   //    progress.value = animation.animationObject.currentStep / animation.animationObject.numSteps;
                                   // }
                                 },
                         scales: {
                             yAxes: [{
                                 type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                                 display: true,
                                 position: 'left',
                                   }]
                               },
                               tooltips: {
                                 mode: "label"
                               }}} />
                               </div>

        );}

        for(var o=0; o < this.state.windData.length; o++)
        { let datarain =
          {
            labels :  ['00:00','03:00 am','06:00 am', '09:00 am', '12:00 pm','03:00 pm','06:00 pm','09:00 pm'],
            datasets: [
                    {
            label: 'Precipitation in MM ',
            backgroundColor:[
                  'rgba(255, 0, 255, 0.6)',
                  'rgba(255, 0, 255, 0.6)',
                  'rgba(255, 0, 255, 0.6)',
                  'rgba(255, 0, 255, 0.6)',
                  'rgba(255, 0, 255, 0.6)',
                  'rgba(255, 0, 255, 0.6)',
                  'rgba(255, 0, 255, 0.6)',
                  'rgba(255, 0, 255, 0.6)'],
            borderColor: 'rgba(255,50,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: this.state.rainData[o][o].datasets.data,
           
            type: 'line',
            fill: true
          }]};
  
          raincharts.push(  
            <div style={{display: 'inline-block',width: '650px',height: '325px',padding: '5px',margin:'5px' ,border: '2px solid blue'}}>
            <Line 
                 data ={datarain}
                 options={{
                           responsive: true,
                           hoverMode: 'index',
                           title:{
                               display:true,
                               text:'Precipitation in '+this.state.location+ ' on '+ this.state.daterange[o],
                               fontSize:25
                                 },
                           legend:{
                               display:true,
                               position:'right'
                                   },
                           animation: {
                               duration: 3000,
                               easing: 'easeInBounce',
                                     // onProgress: function(animation) {
                                     //    progress.value = animation.animationObject.currentStep / animation.animationObject.numSteps;
                                     // }
                                   },
                           scales: {
                               yAxes: [{
                                   type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                                   display: true,
                                   position: 'left',
                                     }]
                                 },
                                 tooltips: {
                                   mode: "label"
                                 }}} />
                                 </div>
          );}

    return (
      <div>
        <Titles/>

        <Weather temp={this.state.temp}
        tempmin={this.state.tempmin}
        tempmax={this.state.tempmax}
        country={this.state.country}
        city={this.state.city}
        humidity={this.state.humidity}
        desc={this.state.desc}
      
        wspeed={this.state.wspeed}
        error={this.state.error}/>
        
        <div>
        <div className="formcontainer">
        <div className="formcss" >
            <form onSubmit={this.wrapperFunction}>
               <input type="text" name="pastcity" placeholder="City..." className="inbox"/>
               <input type="text" name="pcountry" placeholder="Country..." className="inbox"/>
               <DatePicker
                  className="inbox"
                  selected={this.state.paststartdate}
                  selectsStart
                  startDate={this.state.paststartdate}
                  endDate={this.state.pastenddate}
                  onChange={this.handleChangeStart}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Start date..."
               />

              <DatePicker
                  className="inbox"
                  selected={this.state.pastenddate}
                  selectsEnd
                  name="pastenddate"
                  startDate={this.state.paststartdate}
                  endDate={this.state.pastenddate}
                  onChange={this.handleChangeEnd}
                  isClearable={true}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="End date... (optional)"
              />
              <button className="button">Get Weather</button>
              
          </form>
        </div>
           </div>
            </div>
            {/* {this.state.chartData.length} */}
          <div> {tempcharts}</div>
          <div>{windcharts} </div>
          <div>{raincharts} </div>
      </div>
    );
  }
}

export default App;
