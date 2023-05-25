import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'constant-vus',
      vus: 10,
      duration: '30s',
    },
  },
};

export default function () {
  const res = http.get("http://localhost:4000/api/artist/0TnOYISbd1XYRBk9myaseg/tracks");
  check(res, { "is status 200": (r) => r.status == 200
});
  sleep(.5);
}
