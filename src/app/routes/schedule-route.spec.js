const request = require('supertest')

function daysFromNow (day) {
  return new Date(Date.now() + 86400000 * day).toISOString()
}

describe('Schedule App', () => {
  let app
  beforeAll(()=>{
    app = require('../index').listen()
  })

  afterAll(()=>{
    //Cleanup server resources
    app.close()
  })

  it('should send and receive simple schedule', async () => {
    await request(app)
      .post('/schedule')
      .send([
        {
          startingDay: daysFromNow(1),
          duration: 5
        },
        {
          startingDay: daysFromNow(6),
          duration: 7
        }
      ])
      .expect(200, {
        productionCycle: 2
      })
  })

  it('should send and receive weighted schedule', async () => {
    await request(app)
      .post('/schedule/weighted')
      .send([
        {
          startingDay: daysFromNow(1),
          duration: 5
        },
        {
          startingDay: daysFromNow(6),
          duration: 7
        }
      ])
      .expect(200, {
        productionCycle: 2
      })
  })

  it('should return 400 on bad data', async () => {
    await request(app)
      .post('/schedule')
      .send({})
      .expect(400)
    await request(app)
      .post('/schedule')
      .send([])
      .expect(400)
    await request(app)
      .post('/schedule')
      .send([{blabla: 1, duration: 7}])
      .expect(400)
    await request(app)
      .post('/schedule')
      .send([{startingDay: 1, duration: 7}])
      .expect(400)
    await request(app)
      .post('/schedule')
      .send([{startingDay: daysFromNow(6), duration: -7}])
      .expect(400)
    await request(app)
      .post('/schedule')
      .send([{startingDay: daysFromNow(-1), duration: 1}])
      .expect(400)
  })
})
