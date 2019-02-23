const schedulePlaner = require('./schedule')

describe('Schedule', () => {
  it('should throw on invalid date', () => {
    expect(() =>
      schedulePlaner.prepareSchedule([
        {
          startingDay: '2018-1-2T00:00:00.000Z',
          duration: 5
        }
      ])
    ).toThrow()
    expect(() =>
      schedulePlaner.prepareSchedule([
        {
          duration: 5
        }
      ])
    ).toThrow()
  })
  it('should throw on invalid duration', () => {
    expect(() =>
      schedulePlaner.prepareSchedule([
        {
          startingDay: '2018-01-02T00:00:00.000Z',
          duration: -5
        }
      ])
    ).toThrow()
    expect(() =>
      schedulePlaner.prepareSchedule([
        {
          startingDay: '2018-01-02T00:00:00.000Z',
          duration: 0
        }
      ])
    ).toThrow()
    expect(() =>
      schedulePlaner.prepareSchedule([
        {
          startingDay: '2018-01-02T00:00:00.000Z',
          duration: 'long long time ago in a galaxy far far away'
        }
      ])
    ).toThrow()
  })

  it('should return 0 on empty', () => {
    const schedule = schedulePlaner.prepareSchedule([])
    expect(schedulePlaner.planSimple(schedule)).toBe(0)
    expect(schedulePlaner.planWeighted(schedule)).toBe(0)
  })

  it('should plan with only 1 item', () => {
    const schedule = schedulePlaner.prepareSchedule([
      {
        startingDay: '2018-01-02T00:00:00.000Z',
        duration: 5
      },
    ])
    expect(schedulePlaner.planSimple(schedule)).toBe(1)
    expect(schedulePlaner.planWeighted(schedule)).toBe(1)
  })

  it('should pass test case #1', () => {
    const schedule = schedulePlaner.prepareSchedule([
      {
        startingDay: '2018-01-02T00:00:00.000Z',
        duration: 5
      },
      {
        startingDay: '2018-01-09T00:00:00.000Z',
        duration: 7
      },
      {
        startingDay: '2018-01-15T00:00:00.000Z',
        duration: 6
      },
      {
        startingDay: '2018-01-09T00:00:00.000Z',
        duration: 3
      }
    ])
    expect(schedulePlaner.planSimple(schedule)).toBe(3)
  })

  it('should pass test case #2', () => {
    const schedule = schedulePlaner.prepareSchedule([
      {
        startingDay: '2018-01-03T00:00:00.000Z',
        duration: 5
      },
      {
        startingDay: '2018-01-09T00:00:00.000Z',
        duration: 2
      },
      {
        startingDay: '2018-01-24T00:00:00.000Z',
        duration: 5
      },
      {
        startingDay: '2018-01-16T00:00:00.000Z',
        duration: 9
      },
      {
        startingDay: '2018-01-11T00:00:00.000Z',
        duration: 6
      }
    ])
    expect(schedulePlaner.planSimple(schedule)).toBe(4)
  })

  it('should pass test case with weight', () => {
    const schedule = schedulePlaner.prepareSchedule([
      {
        startingDay: '2018-01-03T00:00:00.000Z',
        duration: 5
      },
      {
        startingDay: '2018-01-09T00:00:00.000Z',
        duration: 2
      },
      {
        startingDay: '2018-01-09T00:00:00.000Z',
        duration: 21
      },
      {
        startingDay: '2018-01-24T00:00:00.000Z',
        duration: 2
      },
      {
        startingDay: '2018-01-16T00:00:00.000Z',
        duration: 1
      },
      {
        startingDay: '2018-01-11T00:00:00.000Z',
        duration: 2
      }
    ])
    expect(schedulePlaner.planWeighted(schedule)).toBe(2)
    expect(schedulePlaner.planSimple(schedule)).toBe(5)
  })

  it('should pass test case with weight #2', () => {
    const schedule = schedulePlaner.prepareSchedule([
      {
        startingDay: '2018-01-01T00:00:00.000Z',
        duration: 5
      },
      {
        startingDay: '2018-01-06T00:00:00.000Z',
        duration: 5
      },
      {
        startingDay: '2018-01-11T00:00:00.000Z',
        duration: 5
      },
      {
        startingDay: '2018-01-02T00:00:00.000Z',
        duration: 15
      }
    ])
    expect(schedulePlaner.planWeighted(schedule)).toBe(3)
    expect(schedulePlaner.planSimple(schedule)).toBe(3)
  })

  it('should pass test case with weight #3', () => {
    const schedule = schedulePlaner.prepareSchedule([
      {
        startingDay: '2018-01-01T00:00:00.000Z',
        duration: 5
      },
      {
        startingDay: '2018-01-06T00:00:00.000Z',
        duration: 5
      },
      {
        startingDay: '2018-01-11T00:00:00.000Z',
        duration: 5
      },
      {
        startingDay: '2018-01-02T00:00:00.000Z',
        duration: 16
      }
    ])
    expect(schedulePlaner.planWeighted(schedule)).toBe(1)
    expect(schedulePlaner.planSimple(schedule)).toBe(3)
  })
})
