import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '120s',
}
export default function () {
  let ourVal = Math.ceil(Math.random(0, 1) * 999999);
  http.get('http://localhost:3003/qa/questions?product_id=' + ourVal.toString());
  sleep(1);
}