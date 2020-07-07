import { assert } from 'chai'

import Utils from '../../src/Common/utils'
import 'mocha'

describe('utils', function (): void {
  it('toHex', function (): void {
    // GIVEN some bytes.
    const bytes = new Uint8Array([1, 2, 3, 4])

    // WHEN they are converted to hex.
    const hex = Utils.toHex(bytes)

    // THEN the bytes returned are valid.
    assert.equal(hex, '01020304')
  })

  // TODO(keefertaylor): Additional tests here.
})
