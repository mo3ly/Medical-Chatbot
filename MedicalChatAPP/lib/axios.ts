import axios from "axios";

const instance = axios.create({
  baseURL: "http://127.0.0.1:5000",
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer test_token_fsd6f7sd6f7dsf'
  }
});

export default instance;
