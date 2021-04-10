const { getLocalRefreshToken } = require('../index')

test('getLocalRefreshToken should return a JSON parsed local access token', () => {
    expect(getLocalRefreshToken()).toBeTruthy()
})