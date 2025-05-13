import React, { useEffect, useState } from 'react'
import axios from "axios"
import './App.css'

const App = () => {


const [userEntered,setUserEntered] = useState('')
const [countryFrom,setCountryFrom] = useState('USD')
const [countryTo,setCountryTo] = useState('INR')
const [convertedAmount,setConvertedAmount]=useState('')
const [countryList,setCountryList] = useState(["USD","INR","AUD"])

const currencyApiCall = async () => {

  if(!countryFrom){
    console.log("Select a from country first");
    return;
  }

  let apiUrl = `https://api.exchangerate-api.com/v4/latest/${countryFrom}`

  let apiResponse = await axios.get(apiUrl)
  // console.log("Response:",apiResponse)
  return apiResponse?.data?.rates || null

}

const convertAction = async () =>{
   if (!userEntered || isNaN(userEntered)) {
   alert('Enter a valid amount');
      return;
    }

    const amount = Number(userEntered);
    let rateJson = null
    rateJson = await currencyApiCall();

    if(!rateJson){
      console.log("Something went wrong with api call, try later")
      return;
    }

    console.log("To Country:",countryTo)
    console.log("to Country Value:",rateJson[countryTo])

    const rate = rateJson[countryTo]
    // const rate = conversionRates[countryFrom][countryTo];
    console.log("Rate:",rate)
    const result = amount * rate;
    console.log("Amount:",amount)
    console.log("Result:",result)
    setConvertedAmount(result.toFixed(2)); 
  };

  const renderOptions = async () => {
    // console.log("I am called")

    let listResponse = await currencyApiCall()

    if(listResponse){
      let currencyArr = []
      for(const key in listResponse){
        currencyArr.push(key);
      }
      if(currencyArr.length){
        setCountryList(currencyArr)
      }else{
        console.log("Something went wrong with api call")
      }
    }

  }

  useEffect(()=>{
    renderOptions()
  },[])

  return (
    <div>
      <div className='container'>
      <h1>CURRENCY CONVERTER</h1>
      <label>Amount : </label>
       <input
      type='number'
      placeholder='Enter a amount'
      value={userEntered}
      onChange={(e) => setUserEntered(e.target.value)}/><br></br>
      </div>

      <h4>From : </h4>
      <select value={countryFrom} onChange={(e) => setCountryFrom(e.target.value)}>
        {
          countryList.map((country,index) => (
            <option key={"From_"+index} value={country}>{country}</option>
          ))
        }
      </select>

       <h4>To : </h4>
      <select value={countryTo} onChange={(e) => setCountryTo(e.target.value)}>
        {
          countryList.map((country,index) => (
            <option key={"To_"+index} value={country}>{country}</option>
          ))
        }
      </select><br></br>


      <button onClick={convertAction}>Convert</button>
     
     {convertedAmount && <h3>The amount is :{convertedAmount}</h3>}

   


    </div>
  )
}

export default App
