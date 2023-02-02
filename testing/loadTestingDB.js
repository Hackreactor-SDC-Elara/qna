import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 10000,
  duration: '30s',
}
export default function () {
  http.get('http://localhost:3001/qa/questions?product_id=999888');
  sleep(1);
}