import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '20s', target: 500 },
        { duration: '20s', target: 750 },
        { duration: '20s', target: 1500 },
        { duration: '20s', target: 750 },
      ],
      gracefulRampDown: '0s',
    },
  },
};

export default function () {
  const res = http.get("http://172.21.14.59:4000/api/artist/0TnOYISbd1XYRBk9myaseg/tracks");
  check(res, { "is status 200": (r) => r.status == 200
});
  sleep(.5);
}

//