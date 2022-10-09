
import axios from 'axios'

const BASE_API_URL = 'https://api.flutterwave.com/v3'

const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

const bankUrl = `${BASE_API_URL}/banks/NG`;
const options = {
    'method': 'GET',
    'url': '{{BASE_API_URL}}/banks/NG',
    'headers': {
      'Authorization': 'Bearer FLWSECK_TEST-SANDBOXDEMOKEY-X'
    }
  };

export const getAllBanksNG = async () => {
  try {
    const response = await axios.get(bankUrl, options);
  
  return response.data;
  } catch (error) {
return(error)
  }
};


export const initTrans = async (details:any) => {

    try {

        const response = await flw.Transfer.initiate(details)
        return(response);
    } catch (error) {
        console.log(error)
    }

}
