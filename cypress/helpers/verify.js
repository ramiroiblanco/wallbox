const Verify = {
  responseCode: (expectedCode, actualCode) => {
    return expect(actualCode).to.equal(expectedCode,
      `The actual response is ${actualCode} and the expected response is ${expectedCode}`)
  }
}

export default Verify