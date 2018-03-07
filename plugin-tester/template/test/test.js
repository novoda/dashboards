const expect = require('chai').expect;
const ds = require('../lib/data-source')

describe('generateViewState', function () {
    const configuration = {
        foo: {
            value: "foo value"
        },
        bar: {
            value: 1
        }
    }

    it('viewstate foo string value is read from configuration', function () {
        return ds(configuration).then(result => {
            expect(result.foo).to.be.equal("foo value");
        }) 
    })

    it('viewstate bar int value is read from configuration', function () {
        return ds(configuration).then(result => {
            expect(result.bar).to.be.equal(1);
        }) 
    })
})