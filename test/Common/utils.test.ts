import { assert } from 'chai'

import Utils from '../../src/Common/utils'
import 'mocha'

// Analagous values represented in different formats.
const TestData = {
  buffer: Buffer.from('01020304', 'hex'),
  bytes: new Uint8Array([1, 2, 3, 4]),
  hex: '01020304',
  sha512half: Utils.toBytes(
    'A7C976DB1723ADB41274178DC82E9B777941AB201C69DE61D0F2BC6D27A3598F',
  ),
}

describe('utils', function (): void {
  it('toHex', function (): void {
    // GIVEN some bytes WHEN they are converted to hex.
    const hex = Utils.toHex(TestData.bytes)

    // THEN the hex is the analogous value.
    assert.equal(hex, TestData.hex)
  })

  it('toBytes', function (): void {
    // GIVEN some valid hex WHEN it is converted to bytes.
    const bytes = Utils.toBytes(TestData.hex)

    // THEN the bytes are the analogous value.
    assert.deepEqual(bytes, TestData.bytes)
  })

  it('isHexValidHex', function (): void {
    // GIVEN some valid hex WHEN it is validated THEN it is deemed valid.
    assert.isTrue(Utils.isHex(TestData.hex))
  })

  it('isHexInvalidHex', function (): void {
    // GIVEN some valid hex WHEN it is validated THEN it is deemed valid.
    const hex = 'xrp'
    assert.isFalse(Utils.isHex(hex))
  })

  it('hexFromBuffer', function (): void {
    // GIVEN a buffer WHEN it is converted to hex.
    const hex = Utils.hexFromBuffer(TestData.buffer)

    // THEN the hex returned is the analagous value.
    assert.equal(hex, TestData.hex)
  })

  it('sha512Half', function (): void {
    // GIVEN some bytes WHEN the sha512half hash is calculated.
    const bytes = Utils.sha512Half(TestData.bytes)

    console.log(Utils.toHex(bytes))

    // THEN the bytes returned are the analagous value.
    assert.deepEqual(bytes, TestData.sha512half)
  })
})
