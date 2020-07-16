/* eslint-disable @typescript-eslint/no-magic-numbers -- Conversion tests use precalculated inputs / outputs. */
/* eslint-disable max-lines -- There are many test cases for the utils class. */
/* eslint-disable max-statements -- There are many test cases for the utils class. */
import { BigNumber } from 'bignumber.js'
import { assert } from 'chai'

import XrpUtils from '../../src/XRP/xrp-utils'
import 'mocha'
import XrplNetwork from '../../src/XRP/xrpl-network'

describe('XrpUtils', function (): void {
  it('isValidAddress() - Valid Classic Address', function (): void {
    // GIVEN a valid classic address.
    const address = 'rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1'

    // WHEN the address is validated.
    const isValidAddress = XrpUtils.isValidAddress(address)

    // THEN the address is deemed valid.
    assert.isTrue(isValidAddress)
  })

  it('isValidAddress() - Valid X-Address', function (): void {
    // GIVEN a valid X-address.
    const address = 'XVLhHMPHU98es4dbozjVtdWzVrDjtV18pX8yuPT7y4xaEHi'

    // WHEN the address is validated.
    const isValidAddress = XrpUtils.isValidAddress(address)

    // THEN the address is deemed valid.
    assert.isTrue(isValidAddress)
  })

  it('isValidAddress() - Wrong Alphabet', function (): void {
    // GIVEN a base58check address encoded in the wrong alphabet.
    const address = '1EAG1MwmzkG6gRZcYqcRMfC17eMt8TDTit'

    // WHEN the address is validated.
    const isValidAddress = XrpUtils.isValidAddress(address)

    // THEN the address is deemed invalid.
    assert.isFalse(isValidAddress)
  })

  it('isValidAddress() - Invalid Classic Address Checksum', function (): void {
    // GIVEN a classic address which fails checksumming in base58 encoding.
    const address = 'rU6K7V3Po4sBBBBBaU29sesqs2qTQJWDw1'

    // WHEN the address is validated.
    const isValidAddress = XrpUtils.isValidAddress(address)

    // THEN the address is deemed invalid.
    assert.isFalse(isValidAddress)
  })

  it('isValidAddress() - Invalid X-Address Checksum', function (): void {
    // GIVEN an X-address which fails checksumming in base58 encoding.
    const address = 'XVLhHMPHU98es4dbozjVtdWzVrDjtV18pX8yuPT7y4xaEHI'

    // WHEN the address is validated.
    const isValidAddress = XrpUtils.isValidAddress(address)

    // THEN the address is deemed invalid.
    assert.isFalse(isValidAddress)
  })

  it('isValidAddress() - Invalid Characters', function (): void {
    // GIVEN a base58check address which has invalid characters.
    const address = 'rU6K7V3Po4sBBBBBaU@#$%qs2qTQJWDw1'

    // WHEN the address is validated.
    const isValidAddress = XrpUtils.isValidAddress(address)

    // THEN the address is deemed invalid.
    assert.isFalse(isValidAddress)
  })

  it('isValidAddress() - Too Long', function (): void {
    // GIVEN a base58check address which has invalid characters.
    const address =
      'rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1'

    // WHEN the address is validated.
    const isValidAddress = XrpUtils.isValidAddress(address)

    // THEN the address is deemed invalid.
    assert.isFalse(isValidAddress)
  })

  it('isValidAddress() - Too Short', function (): void {
    // GIVEN a base58check address which has invalid characters.
    const address = 'rU6K7V3Po4s2qTQJWDw1'

    // WHEN the address is validated.
    const isValidAddress = XrpUtils.isValidAddress(address)

    // THEN the address is deemed invalid.
    assert.isFalse(isValidAddress)
  })

  it('encodeXAddress() - Mainnet Address and Tag', function (): void {
    // GIVEN a valid classic address on MainNet and a tag.
    const address = 'rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1'
    const tag = 12345
    const isTest = false

    // WHEN they are encoded to an x-address.
    const xAddress = XrpUtils.encodeXAddress(address, tag, isTest)

    // THEN the result is as expected.
    assert.strictEqual(
      xAddress,
      'XVfC9CTCJh6GN2x8bnrw3LtdbqiVCUvtU3HnooQDgBnUpQT',
    )
  })

  it('encodeXAddress() - TestNet Address and Tag', function (): void {
    // GIVEN a valid classic address on TestNet and a tag.
    const address = 'rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1'
    const tag = 12345
    const isTest = true

    // WHEN they are encoded to an x-address.
    const xAddress = XrpUtils.encodeXAddress(address, tag, isTest)

    // THEN the result is as expected.
    assert.strictEqual(
      xAddress,
      'TVsBZmcewpEHgajPi1jApLeYnHPJw82v9JNYf7dkGmWphmh',
    )
  })

  it('encodeXAddress() - Address Only', function (): void {
    // GIVEN a valid classic address.
    const address = 'rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1'

    // WHEN it is encoded to an x-address.
    const xAddress = XrpUtils.encodeXAddress(address, undefined)

    // THEN the result is as expected.
    assert.strictEqual(
      xAddress,
      'XVfC9CTCJh6GN2x8bnrw3LtdbqiVCUFyQVMzRrMGUZpokKH',
    )
  })

  it('encodeXAddress() - Invalid Address', function (): void {
    // GIVEN an invalid address.
    const address = 'xrp'

    // WHEN it is encoded to an x-address.
    const xAddress = XrpUtils.encodeXAddress(address, undefined)

    // THEN the result is undefined.
    assert.isUndefined(xAddress)
  })

  it('decodeXAddress() - Valid Mainnet Address with Tag', function (): void {
    // GIVEN an x-address that encodes an address and a tag.
    const address = 'XVfC9CTCJh6GN2x8bnrw3LtdbqiVCUvtU3HnooQDgBnUpQT'
    const tag = 12345

    // WHEN it is decoded to an classic address
    const classicAddress = XrpUtils.decodeXAddress(address)

    // Then the decoded address and tag as are expected.
    assert.strictEqual(
      classicAddress?.address,
      'rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1',
    )
    assert.strictEqual(classicAddress?.tag, tag)
    assert.strictEqual(classicAddress?.test, false)
  })

  it('decodeXAddress() - Valid Testnet Address with Tag', function (): void {
    // GIVEN an x-address that encodes an address and a tag.
    const address = 'TVsBZmcewpEHgajPi1jApLeYnHPJw82v9JNYf7dkGmWphmh'
    const tag = 12345

    // WHEN it is decoded to an classic address
    const classicAddress = XrpUtils.decodeXAddress(address)

    // Then the decoded address and tag as are expected.
    assert.strictEqual(
      classicAddress?.address,
      'rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1',
    )
    assert.strictEqual(classicAddress?.tag, tag)
    assert.strictEqual(classicAddress?.test, true)
  })

  it('decodeXAddress() - Valid Address without Tag', function (): void {
    // GIVEN an x-address that encodes an address and no tag.
    const address = 'XVfC9CTCJh6GN2x8bnrw3LtdbqiVCUFyQVMzRrMGUZpokKH'

    // WHEN it is decoded to an classic address
    const classicAddress = XrpUtils.decodeXAddress(address)

    // Then the decoded address and tag as are expected.
    assert.strictEqual(
      classicAddress?.address,
      'rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1',
    )
    assert.isUndefined(classicAddress?.tag)
  })

  it('decodeXAddress() - Invalid Address', function (): void {
    // GIVEN an invalid address
    const address = 'xrp'

    // WHEN it is decoded to an classic address
    const classicAddress = XrpUtils.decodeXAddress(address)

    // Then the decoded address is undefined.
    assert.isUndefined(classicAddress)
  })

  it('isValidXAddress() - Valid X-Address', function (): void {
    // GIVEN a valid X-Address.
    const address = 'XVfC9CTCJh6GN2x8bnrw3LtdbqiVCUvtU3HnooQDgBnUpQT'

    // WHEN the address is validated for being an X-Address.
    const isValid = XrpUtils.isValidXAddress(address)

    // THEN the address is reported as valid.
    assert.isTrue(isValid)
  })

  it('isValidXAddress() - Classic Address', function (): void {
    // GIVEN a valid classic address.
    const address = 'rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1'

    // WHEN the address is validated for being an X-Address.
    const isValid = XrpUtils.isValidXAddress(address)

    // THEN the address is reported as invalid.
    assert.isFalse(isValid)
  })

  it('isValidXAddress() - Invalid Address', function (): void {
    // GIVEN an invalid address.
    const address = 'xrp'

    // WHEN the address is validated for being an X-Address.
    const isValid = XrpUtils.isValidXAddress(address)

    // THEN the address is reported as invalid.
    assert.isFalse(isValid)
  })

  it('isValidClassicAddress() - Valid X-Address', function (): void {
    // GIVEN a valid X-Address.
    const address = 'XVfC9CTCJh6GN2x8bnrw3LtdbqiVCUvtU3HnooQDgBnUpQT'

    // WHEN the address is validated for being a classic address.
    const isValid = XrpUtils.isValidClassicAddress(address)

    // THEN the address is reported as invalid.
    assert.isFalse(isValid)
  })

  it('isValidClassicAddress() - Classic Address', function (): void {
    // GIVEN a valid classic address.
    const address = 'rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1'

    // WHEN the address is validated for being a classic address.
    const isValid = XrpUtils.isValidClassicAddress(address)

    // THEN the address is reported as valid.
    assert.isTrue(isValid)
  })

  it('isValidClassicAddress() - Invalid Address', function (): void {
    // GIVEN an invalid address.
    const address = 'xrp'

    // WHEN the address is validated for being a classic address.
    const isValid = XrpUtils.isValidClassicAddress(address)

    // THEN the address is reported as invalid.
    assert.isFalse(isValid)
  })

  it('transactionBlobHex() - Valid transaction blob', function (): void {
    // GIVEN a transaction blob.
    const transactionBlobHex =
      '120000240000000561400000000000000168400000000000000C73210261BBB9D242440BA38375DAD79B146E559A9DFB99055F7077DA63AE0D643CA0E174473045022100C8BB1CE19DFB1E57CDD60947C5D7F1ACD10851B0F066C28DBAA3592475BC3808022056EEB85CC8CD41F1F1CF635C244943AD43E3CF0CE1E3B7359354AC8A62CF3F488114F8942487EDB0E4FD86190BF8DCB3AF36F608839D83141D10E382F805CD7033CC4582D2458922F0D0ACA6'

    // WHEN the transaction blob is converted to a hash.
    const transactionHash = XrpUtils.transactionBlobToTransactionHash(
      transactionBlobHex,
    )

    // THEN the transaction blob is as expected.
    assert.strictEqual(
      transactionHash,
      '7B9F6E019C2A79857427B4EF968D77D683AC84F5A880830955D7BDF47F120667',
    )
  })

  it('transactionBlobHex() - Invalid transaction blob', function (): void {
    // GIVEN an invalid transaction blob.
    const transactionBlobHex = 'xrp'

    // WHEN the transaction blob is converted to a hash.
    const transactionHash = XrpUtils.transactionBlobToTransactionHash(
      transactionBlobHex,
    )

    // THEN the hash is undefined.
    assert.isUndefined(transactionHash)
  })

  it('isTestNetwork() - Mainnet', function (): void {
    // GIVEN the Mainnet XrplNetwork
    const network = XrplNetwork.Main

    // WHEN the network is determined to be a test network
    // THEN the network is reported as not being a test network.
    assert.isFalse(XrpUtils.isTestNetwork(network))
  })

  it('isTestNetwork() - TestNet', function (): void {
    // GIVEN the TestNet XrplNetwork
    const network = XrplNetwork.Test

    // WHEN the network is determined to be a test network
    // THEN the network is reported as being a test network.
    assert.isTrue(XrpUtils.isTestNetwork(network))
  })

  it('isTestNetwork() - Devnet', function (): void {
    // GIVEN the Devnet XrplNetwork
    const network = XrplNetwork.Dev

    // WHEN the network is determined to be a test network
    // THEN the network is reported as  being a test network.
    assert.isTrue(XrpUtils.isTestNetwork(network))
  })

  // xrpToDrops and dropsToXrp tests
  it('dropsToXrp() - works with a typical amount', function (): void {
    // GIVEN a typical, valid drops value, WHEN converted to xrp
    const xrp = XrpUtils.dropsToXrp('2000000')

    // THEN the conversion is as expected
    assert.strictEqual(xrp, '2', '2 million drops equals 2 XRP')
  })

  it('dropsToXrp() - works with fractions', function (): void {
    // GIVEN drops amounts that convert to fractional xrp amounts
    // WHEN converted to xrp THEN the conversion is as expected
    let xrp = XrpUtils.dropsToXrp('3456789')
    assert.strictEqual(xrp, '3.456789', '3,456,789 drops equals 3.456789 XRP')

    xrp = XrpUtils.dropsToXrp('3400000')
    assert.strictEqual(xrp, '3.4', '3,400,000 drops equals 3.4 XRP')

    xrp = XrpUtils.dropsToXrp('1')
    assert.strictEqual(xrp, '0.000001', '1 drop equals 0.000001 XRP')

    xrp = XrpUtils.dropsToXrp('1.0')
    assert.strictEqual(xrp, '0.000001', '1.0 drops equals 0.000001 XRP')

    xrp = XrpUtils.dropsToXrp('1.00')
    assert.strictEqual(xrp, '0.000001', '1.00 drops equals 0.000001 XRP')
  })

  it('dropsToXrp() - works with zero', function (): void {
    // GIVEN several equivalent representations of zero
    // WHEN converted to xrp, THEN the result is zero
    let xrp = XrpUtils.dropsToXrp('0')
    assert.strictEqual(xrp, '0', '0 drops equals 0 XRP')

    // negative zero is equivalent to zero
    xrp = XrpUtils.dropsToXrp('-0')
    assert.strictEqual(xrp, '0', '-0 drops equals 0 XRP')

    xrp = XrpUtils.dropsToXrp('0.00')
    assert.strictEqual(xrp, '0', '0.00 drops equals 0 XRP')

    xrp = XrpUtils.dropsToXrp('000000000')
    assert.strictEqual(xrp, '0', '000000000 drops equals 0 XRP')
  })

  it('dropsToXrp() - works with a negative value', function (): void {
    // GIVEN a negative drops amount
    // WHEN converted to xrp
    const xrp = XrpUtils.dropsToXrp('-2000000')

    // THEN the conversion is also negative
    assert.strictEqual(xrp, '-2', '-2 million drops equals -2 XRP')
  })

  it('dropsToXrp() - works with a value ending with a decimal point', function (): void {
    // GIVEN a positive or negative drops amount that ends with a decimal point
    // WHEN converted to xrp THEN the conversion is successful and correct
    let xrp = XrpUtils.dropsToXrp('2000000.')
    assert.strictEqual(xrp, '2', '2000000. drops equals 2 XRP')

    xrp = XrpUtils.dropsToXrp('-2000000.')
    assert.strictEqual(xrp, '-2', '-2000000. drops equals -2 XRP')
  })

  it('dropsToXrp() - works with BigNumber objects', function (): void {
    // GIVEN drops amounts represented as BigNumber objects
    // WHEN converted to xrp THEN the conversions are correct and successful
    let xrp = XrpUtils.dropsToXrp(new BigNumber(2000000))
    assert.strictEqual(xrp, '2', '(BigNumber) 2 million drops equals 2 XRP')

    xrp = XrpUtils.dropsToXrp(new BigNumber(-2000000))
    assert.strictEqual(xrp, '-2', '(BigNumber) -2 million drops equals -2 XRP')

    xrp = XrpUtils.dropsToXrp(new BigNumber(2345678))
    assert.strictEqual(
      xrp,
      '2.345678',
      '(BigNumber) 2,345,678 drops equals 2.345678 XRP',
    )

    xrp = XrpUtils.dropsToXrp(new BigNumber(-2345678))
    assert.strictEqual(
      xrp,
      '-2.345678',
      '(BigNumber) -2,345,678 drops equals -2.345678 XRP',
    )
  })

  it('dropsToXrp() - works with a number', function (): void {
    // This is not recommended. Use strings or BigNumber objects to avoid precision errors.

    // GIVEN a drops amount represented as a positive or negative number
    // WHEN converted to xrp THEN the conversion is correct and successful
    let xrp = XrpUtils.dropsToXrp(2000000)
    assert.strictEqual(xrp, '2', '(number) 2 million drops equals 2 XRP')

    xrp = XrpUtils.dropsToXrp(-2000000)
    assert.strictEqual(xrp, '-2', '(number) -2 million drops equals -2 XRP')
  })

  it('dropsToXrp() - throws with an amount with too many decimal places', function (): void {
    assert.throws(() => {
      XrpUtils.dropsToXrp('1.2')
    }, /has too many decimal places/u)

    assert.throws(() => {
      XrpUtils.dropsToXrp('0.10')
    }, /has too many decimal places/u)
  })

  it('dropsToXrp() - throws with an invalid value', function (): void {
    // GIVEN invalid drops values, WHEN converted to xrp, THEN an error is thrown
    assert.throws(() => {
      XrpUtils.dropsToXrp('FOO')
    }, /invalid value/u)

    assert.throws(() => {
      XrpUtils.dropsToXrp('1e-7')
    }, /invalid value/u)

    assert.throws(() => {
      XrpUtils.dropsToXrp('2,0')
    }, /invalid value/u)

    assert.throws(() => {
      XrpUtils.dropsToXrp('.')
    }, /dropsToXrp: invalid value '\.', should be a BigNumber or string-encoded number\./u)
  })

  it('dropsToXrp() - throws with an amount more than one decimal point', function (): void {
    // GIVEN invalid drops values that contain more than one decimal point
    // WHEN converted to xrp THEN an error is thrown
    assert.throws(() => {
      XrpUtils.dropsToXrp('1.0.0')
    }, /dropsToXrp: invalid value '1\.0\.0'/u)

    assert.throws(() => {
      XrpUtils.dropsToXrp('...')
    }, /dropsToXrp: invalid value '\.\.\.'/u)
  })

  it('xrpToDrops() - works with a typical amount', function (): void {
    // GIVEN an xrp amoun that is typical and valid
    // WHEN converted to drops
    const drops = XrpUtils.xrpToDrops('2')

    // THEN the conversion is successful and correct
    assert.strictEqual(drops, '2000000', '2 XRP equals 2 million drops')
  })

  it('xrpToDrops() - works with fractions', function (): void {
    // GIVEN xrp amounts that are fractional
    // WHEN converted to drops THEN the conversions are successful and correct
    let drops = XrpUtils.xrpToDrops('3.456789')
    assert.strictEqual(drops, '3456789', '3.456789 XRP equals 3,456,789 drops')
    drops = XrpUtils.xrpToDrops('3.400000')
    assert.strictEqual(drops, '3400000', '3.400000 XRP equals 3,400,000 drops')
    drops = XrpUtils.xrpToDrops('0.000001')
    assert.strictEqual(drops, '1', '0.000001 XRP equals 1 drop')
    drops = XrpUtils.xrpToDrops('0.0000010')
    assert.strictEqual(drops, '1', '0.0000010 XRP equals 1 drop')
  })

  it('xrpToDrops() - works with zero', function (): void {
    // GIVEN xrp amounts that are various equivalent representations of zero
    // WHEN converted to drops THEN the conversions are equal to zero
    let drops = XrpUtils.xrpToDrops('0')
    assert.strictEqual(drops, '0', '0 XRP equals 0 drops')
    // Negative zero is equivalent to zero
    drops = XrpUtils.xrpToDrops('-0')
    assert.strictEqual(drops, '0', '-0 XRP equals 0 drops')
    drops = XrpUtils.xrpToDrops('0.000000')
    assert.strictEqual(drops, '0', '0.000000 XRP equals 0 drops')
    drops = XrpUtils.xrpToDrops('0.0000000')
    assert.strictEqual(drops, '0', '0.0000000 XRP equals 0 drops')
  })

  it('xrpToDrops() - works with a negative value', function (): void {
    // GIVEN a negative xrp amount
    // WHEN converted to drops THEN the conversion is also negative
    const drops = XrpUtils.xrpToDrops('-2')
    assert.strictEqual(drops, '-2000000', '-2 XRP equals -2 million drops')
  })

  it('xrpToDrops() - works with a value ending with a decimal point', function (): void {
    // GIVEN an xrp amount that ends with a decimal point
    // WHEN converted to drops THEN the conversion is correct and successful
    let drops = XrpUtils.xrpToDrops('2.')
    assert.strictEqual(drops, '2000000', '2. XRP equals 2000000 drops')
    drops = XrpUtils.xrpToDrops('-2.')
    assert.strictEqual(drops, '-2000000', '-2. XRP equals -2000000 drops')
  })

  it('xrpToDrops() - works with BigNumber objects', function (): void {
    // GIVEN an xrp amount represented as a BigNumber object
    // WHEN converted to drops THEN the conversion is correct and successful
    let drops = XrpUtils.xrpToDrops(new BigNumber(2))
    assert.strictEqual(
      drops,
      '2000000',
      '(BigNumber) 2 XRP equals 2 million drops',
    )
    drops = XrpUtils.xrpToDrops(new BigNumber(-2))
    assert.strictEqual(
      drops,
      '-2000000',
      '(BigNumber) -2 XRP equals -2 million drops',
    )
  })

  it('xrpToDrops() - works with a number', function (): void {
    // This is not recommended. Use strings or BigNumber objects to avoid precision errors.

    // GIVEN an xrp amounts represented as a number (positive and negative)
    // WHEN converted to drops THEN the conversions are successful and correct
    let drops = XrpUtils.xrpToDrops(2)
    assert.strictEqual(
      drops,
      '2000000',
      '(number) 2 XRP equals 2 million drops',
    )
    drops = XrpUtils.xrpToDrops(-2)
    assert.strictEqual(
      drops,
      '-2000000',
      '(number) -2 XRP equals -2 million drops',
    )
  })

  it('xrpToDrops() - throws with an amount with too many decimal places', function (): void {
    // GIVEN an xrp amount with too many decimal places
    // WHEN converted to a drops amount THEN an error is thrown
    assert.throws(() => {
      XrpUtils.xrpToDrops('1.1234567')
    }, /has too many decimal places/u)
    assert.throws(() => {
      XrpUtils.xrpToDrops('0.0000001')
    }, /has too many decimal places/u)
  })

  it('xrpToDrops() - throws with an invalid value', function (): void {
    // GIVEN xrp amounts represented as various invalid values
    // WHEN converted to drops THEN an error is thrown
    assert.throws(() => {
      XrpUtils.xrpToDrops('FOO')
    }, /invalid value/u)
    assert.throws(() => {
      XrpUtils.xrpToDrops('1e-7')
    }, /invalid value/u)
    assert.throws(() => {
      XrpUtils.xrpToDrops('2,0')
    }, /invalid value/u)
    assert.throws(() => {
      XrpUtils.xrpToDrops('.')
    }, /xrpToDrops: invalid value '\.', should be a BigNumber or string-encoded number\./u)
  })

  it('xrpToDrops() - throws with an amount more than one decimal point', function (): void {
    // GIVEN an xrp amount with more than one decimal point, or all decimal points
    // WHEN converted to drops THEN an error is thrown
    assert.throws(() => {
      XrpUtils.xrpToDrops('1.0.0')
    }, /xrpToDrops: invalid value '1\.0\.0'/u)
    assert.throws(() => {
      XrpUtils.xrpToDrops('...')
    }, /xrpToDrops: invalid value '\.\.\.'/u)
  })
})
