## How to start and test

```
npm start
```

to start the server

```bash
curl -X POST \
  http://localhost:3000/schedule \
  -H 'Content-Type: application/json' \
  -d '[
      {
        "startingDay": "2019-03-02T00:00:00.000Z",
        "duration": 5
      },
      {
        "startingDay": "2019-03-09T00:00:00.000Z",
        "duration": 7
      }
]'
```

to get response from simple algorithm

```bash
curl -X POST \
  http://localhost:3000/schedule/weighted \
  -H 'Content-Type: application/json' \
  -d '[
      {
        "startingDay": "2019-03-02T00:00:00.000Z",
        "duration": 5
      },
      {
        "startingDay": "2019-03-09T00:00:00.000Z",
        "duration": 7
      }
]'
```

to get weighted algorithm response (duration used as weight)

