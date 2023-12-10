import AxiosClient from "./axiosClient";

export default class PaymentService {
  constructor() {
    this.client = new AxiosClient();
  }
    createPaymentIntent = ({ total, callbackSuccess, callbackError }) => {
      console.log(total)
    const requestInfo = {
      url: `${import.meta.env.VITE_BACKEND_URL}/payments/intents`,
        body: { total },
      callbackSuccess,
      callbackError,
    };
    this.client.makePostRequest(requestInfo);
  };

}
