import { errorMessage, httpMethod, httpResponse } from '../../constants'
import { verify } from '../../helpers'

/*
add note regarding semicolons in the readme
 */

describe('Search endpoint', () => {
  const baseUrl = 'http://api.giphy.com/v1/gifs/search?'
  const apiKeyParam = 'api_key='
  const apiKeyValue = 'dc6zaTOxFJmzC'
  const queryParam = 'q='
  const defaultQueryValue = 'funny cat'
  const limitParam = 'limit='
  const ratingParam = 'rating='

  it('should return an array of results when requesting default settings', () => {
    cy.request({
      method: httpMethod.GET,
      url: `${baseUrl}${apiKeyParam}${apiKeyValue}&${queryParam}${defaultQueryValue}`,
    })
      .then((response) => {
        verify.responseCode(httpResponse.OK, response.status)
        expect(response.body.data.length).to.equal(25)
      })
  })

  it('should return an error when an invalid API key is used', () => {
    const invalidKey = 'invalidKey'

    cy.request({
      method: httpMethod.GET,
      url: `${baseUrl}${apiKeyParam}${invalidKey}&${queryParam}${defaultQueryValue}`,
      failOnStatusCode: false
    })
      .then((response) => {
        verify.responseCode(httpResponse.FORBIDDEN, response.status)
        expect(response.body.message).to.equal(errorMessage.FORBIDDEN)
      })
  })

  it('should return an error when the API key is null', () => {
    cy.request({
      method: httpMethod.GET,
      url: `${baseUrl}${apiKeyParam}null&${queryParam}${defaultQueryValue}`,
      failOnStatusCode: false
    })
      .then((response) => {
        verify.responseCode(httpResponse.FORBIDDEN, response.status)
        expect(response.body.message).to.equal(errorMessage.FORBIDDEN)
      })
  })

  it('should return an error when there is no API key parameter in the request', () => {
    cy.request({
      method: httpMethod.GET,
      url: `${baseUrl}${queryParam}${defaultQueryValue}`,
      failOnStatusCode: false
    })
      .then((response) => {
        verify.responseCode(httpResponse.UNAUTHORIZED, response.status)
        expect(response.body.message).to.equal(errorMessage.UNAUTHORIZED)
      })
  })

  it('should return an error when there is no search query parameter in the request', () => {
    /*
    According to the API documentation, this is a mandatory field, therefore I would expect some kind of 400 (incomplete
    request) code as a response. However, this returns a 200 response and an empty array of results, consequently, this
    test correctly fails. I would report this as a bug or correct the API documentation.
     */
    cy.request({
      method: httpMethod.GET,
      url: `${baseUrl}${apiKeyParam}${apiKeyValue}`,
      failOnStatusCode: false
    })
      .then((response) => {
        verify.responseCode(httpResponse.UNAUTHORIZED, response.status)
        expect(response.body.message).to.equal(errorMessage.UNAUTHORIZED)
      })
  })

  it('should return 24 results', () => {
    const limitValue = 24

    cy.request({
      method: httpMethod.GET,
      url: `${baseUrl}${apiKeyParam}${apiKeyValue}&${queryParam}${defaultQueryValue}&${limitParam}${limitValue}`,
    })
      .then((response) => {
        verify.responseCode(httpResponse.OK, response.status)
        expect(response.body.data.length).to.equal(24)
      })
  })

  it('should return 26 results', () => {
    /*
    According to the documentation, this parameter should accept a int32 value and the default parameter value is 25.
    There is no documentation stating that the maximum value it accepts is 25. The API or documentation should be corrected.
     */
    const limitValue = 26

    cy.request({
      method: httpMethod.GET,
      url: `${baseUrl}${apiKeyParam}${apiKeyValue}&${queryParam}${defaultQueryValue}&${limitParam}${limitValue}`,
    })
      .then((response) => {
        verify.responseCode(httpResponse.OK, response.status)
        expect(response.body.data.length).to.equal(26)
      })
  })

  /*
  The documentation does not describe what should happen when a limit value is invalid. Therefore, the following test
  assert that the application behaves following the current implementation based on the response I received while testing
  the API. As a QA I find the current behavior inconsistent as the response to different invalid values is not always
  the same.
   */
  it('should return the default 25 results when limit is a string value', () => {
    const limitValue = 'invalid value'

    cy.request({
      method: httpMethod.GET,
      url: `${baseUrl}${apiKeyParam}${apiKeyValue}&${queryParam}${defaultQueryValue}&${limitParam}${limitValue}`,
    })
      .then((response) => {
        verify.responseCode(httpResponse.OK, response.status)
        expect(response.body.data.length).to.equal(25)
      })
  })

  it('should return the default 25 results when limit is out of range', () => {
    const limitValue = 2147483648

    cy.request({
      method: httpMethod.GET,
      url: `${baseUrl}${apiKeyParam}${apiKeyValue}&${queryParam}${defaultQueryValue}&${limitParam}${limitValue}`,
    })
      .then((response) => {
        verify.responseCode(httpResponse.OK, response.status)
        expect(response.body.data.length).to.equal(25)
      })
  })

  it('should return 0 results when the limit is a negative value', () => {
    const limitValue = -1

    cy.request({
      method: httpMethod.GET,
      url: `${baseUrl}${apiKeyParam}${apiKeyValue}&${queryParam}${defaultQueryValue}&${limitParam}${limitValue}`,
    })
      .then((response) => {
        verify.responseCode(httpResponse.OK, response.status)
        expect(response.body.data.length).to.equal(0)
      })
  })

  /*
  According to the documentation a request sent to:

  http://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=funny%20cat&rating=r

  should return only 'r' rated results. However, the response returns responses of all ratings, therefore, this test fails.
   */
  it('should only return r rated results', () => {
    const ratingValue = 'r'

    cy.request({
      method: httpMethod.GET,
      url: `${baseUrl}${apiKeyParam}${apiKeyValue}&${queryParam}${defaultQueryValue}&${ratingParam}${ratingValue}`,
    })
      .then((response) => {
        const nonPg13Count = response.body.data.filter(result => result.rating !== 'r').length

        verify.responseCode(httpResponse.OK, response.status)
        expect(nonPg13Count).to.equal(0)

      })
  })
})