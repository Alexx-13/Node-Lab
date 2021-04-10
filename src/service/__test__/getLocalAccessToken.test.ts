const { getLocalAccessToken } = require('../index')

test('getLocalAccessToken should return a JSON parsed local access token', () => {
    expect(getLocalAccessToken()).toBeTruthy()
})