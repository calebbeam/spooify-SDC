import http from "k6/http";
import { check, sleep } from "k6";


export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '20s', target: 750 },
        { duration: '20s', target: 1000 },
        { duration: '20s', target: 2000 },
        { duration: '20s', target: 750 },
      ],
      gracefulRampDown: '0s',
      // executor: 'per-vu-iterations',
      // vus: 1000,
      // iterations: 8,
      // maxDuration: '1m'
    },
  },
   ext: {
       influxDB: {
         pushInterval: '2s', // Adjust this value as needed
       },
     },

};

export default function () {
  const res = http.get("http://192.81.218.224:4000/api/artists/1/");
  check(res, { "is status 200": (r) => r.status == 200
});
  sleep(.5);
}

//

//docker-compose run -v $PWD/scripts:/scripts k6 run /scripts/script.js