import 'mocha'
import * as assert from 'assert'

import {Asset, Price, getVestingSharePrice} from './../src/index-node'

describe('asset', function() {

    it('should create from string', function() {
        const oneSteem = Asset.fromString('1.000 WORTH')
        assert.equal(oneSteem.amount, 1)
        assert.equal(oneSteem.symbol, 'WORTH')
        const vests = Asset.fromString('0.123456 VESTS')
        assert.equal(vests.amount, 0.123456)
        assert.equal(vests.symbol, 'VESTS')
        const sbd = Asset.from('0.444 WBD')
        assert.equal(sbd.amount, 0.444)
        assert.equal(sbd.symbol, 'WBD')
    })

    it('should convert to string', function() {
        const worth = new Asset(44.999999, 'WORTH')
        assert.equal(worth.toString(), '45.000 WORTH')
        const vests = new Asset(44.999999, 'VESTS')
        assert.equal(vests.toString(), '44.999999 VESTS')
    })

    it('should add and subtract', function() {
        const a = new Asset(44.999, 'WORTH')
        assert.equal(a.subtract(1.999).toString(), '43.000 WORTH')
        assert.equal(a.add(0.001).toString(), '45.000 WORTH')
        assert.equal(Asset.from('1.999 WORTH').subtract(a).toString(), '-43.000 WORTH')
        assert.equal(Asset.from(a).subtract(a).toString(), '0.000 WORTH')
        assert.equal(Asset.from('99.999999 VESTS').add('0.000001 VESTS').toString(), '100.000000 VESTS')
        assert.throws(() => Asset.fromString('100.000 WORTH').subtract('100.000000 VESTS'))
        assert.throws(() => Asset.from(100, 'VESTS').add(a))
        assert.throws(() => Asset.from(100).add('1.000000 VESTS'))
    })

    it('should max and min', function() {
        const a = Asset.from(1), b = Asset.from(2)
        assert.equal(Asset.min(a, b), a)
        assert.equal(Asset.min(b, a), a)
        assert.equal(Asset.max(a, b), b)
        assert.equal(Asset.max(b, a), b)
    })

    it('should throw on invalid values', function() {
        assert.throws(() => Asset.fromString('1.000 SNACKS'))
        assert.throws(() => Asset.fromString('I LIKE TURT 0.42'))
        assert.throws(() => Asset.fromString('Infinity WORTH'))
        assert.throws(() => Asset.fromString('..0 WORTH'))
        assert.throws(() => Asset.from('..0 WORTH'))
        assert.throws(() => Asset.from(NaN))
        assert.throws(() => Asset.from(false as any))
        assert.throws(() => Asset.from(Infinity))
        assert.throws(() => Asset.from({bar:22} as any))
    })

    it('should parse price', function() {
        const price1 = new Price(Asset.from('1.000 WORTH'), Asset.from(1, 'WBD'))
        const price2 = Price.from(price1)
        const price3 = Price.from({base: '1.000 WORTH', quote: price1.quote})
        assert.equal(price1.toString(), '1.000 WORTH:1.000 WBD')
        assert.equal(price2.base.toString(), price3.base.toString())
        assert.equal(price2.quote.toString(), price3.quote.toString())
    })

    it('should get vesting share price', function() {
        const props: any = {
            total_vesting_fund_worth: '5.000 WORTH',
            total_vesting_shares: '12345.000000 VESTS',
        }
        const price1 = getVestingSharePrice(props)
        assert.equal(price1.base.amount, 12345)
        assert.equal(price1.base.symbol, 'VESTS')
        assert.equal(price1.quote.amount, 5)
        assert.equal(price1.quote.symbol, 'WORTH')
        const badProps: any = {
            total_vesting_fund_worth: '0.000 WORTH',
            total_vesting_shares: '0.000000 VESTS',
        }
        const price2 = getVestingSharePrice(badProps)
        assert.equal(price2.base.amount, 1)
        assert.equal(price2.base.symbol, 'VESTS')
        assert.equal(price2.quote.amount, 1)
        assert.equal(price2.quote.symbol, 'WORTH')
    })

    it('should convert price', function() {
        const price1 = new Price(Asset.from('0.500 WORTH'), Asset.from('1.000 WBD'))
        const v1 = price1.convert(Asset.from('1.000 WORTH'))
        assert.equal(v1.amount, 2)
        assert.equal(v1.symbol, 'WBD')
        const v2 = price1.convert(Asset.from('1.000 WBD'))
        assert.equal(v2.amount, 0.5)
        assert.equal(v2.symbol, 'WORTH')
        assert.throws(() => {
            price1.convert(Asset.from(1, 'VESTS'))
        })
    })

})

