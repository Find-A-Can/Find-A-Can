const sum = require('../src/sum.js')

describe('example test suite', () => {
  it('adds 1 + 2 to equal 3', () => {
    expect.hasAssertions()
    expect(sum(1, 2)).toBe(3)
  })
})
