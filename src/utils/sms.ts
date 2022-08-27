import axios from 'axios';

var callapiToken: string | null = null;

export default {
    login: async () : Promise<void> =>  {
        await axios.post("https://api.vpbx.pl/api/v1/login", {
            username: process.env.CALLAPI_USER,
            password: process.env.CALLAPI_PASS
        }).then(val => {
            callapiToken = val.data.token;
        })
    },
    sendSms: async (numer: string, tresc: string) => {
        const smsRegex = new RegExp('^\\+?[1-9]\\d{1,14}$')
        let config = {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${callapiToken}`
            }
          }
        let data = {
            from: "XChallenge",
            to: numer,
            text: tresc,
            webhook_method: "POST",
            webhook: "https://jbzd.pl"
        }
        if (smsRegex.test(numer) && callapiToken != null) {
            await axios.post("https://api.vpbx.pl/api/v1/sms",data,config).catch(err => console.log(err))
        }
    }

}