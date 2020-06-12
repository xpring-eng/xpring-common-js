import { assert } from 'chai'

import PayIdUtils from '../../src/PayID/pay-id-utils'
import 'mocha'

describe('PayIDUtils', function (): void {
  it('parse Pay ID - valid', function (): void {
    // GIVEN a Pay ID with a host and a path.
    const host = 'xpring.money'
    const path = 'georgewashington'
    const rawPayID = `${path}$${host}`

    // WHEN it is parsed to components.
    const payIDComponents = PayIdUtils.parsePayID(rawPayID)

    // THEN the host and path are set correctly.
    assert.equal(payIDComponents?.host, host)
    assert.equal(payIDComponents?.path, `/${path}`)
  })

  it('parse Pay ID - multiple dollar signs', function (): void {
    // GIVEN a Pay ID with more than one '$'.
    const host = 'xpring.money'
    const path = 'george$$$washington$'
    const rawPayID = `${host}$${path}`

    // WHEN it is parsed to components.
    const payIDComponents = PayIdUtils.parsePayID(rawPayID)

    // THEN the host and path are set correctly.
    assert.equal(payIDComponents?.host, host)
    assert.equal(payIDComponents?.path, `/${path}`)  
  })

  it('parse Pay ID - empty host', function (): void {
    // GIVEN a Pay ID with an empty host.
    const host = ''
    const path = 'georgewashington'
    const rawPayID = `${host}$${path}`

    // WHEN it is parsed to components.
    const payIDComponents = PayIdUtils.parsePayID(rawPayID)

    // THEN the Pay ID failed to parse.
    assert.isUndefined(payIDComponents)
  })

  it('parse Pay ID - empty path', function (): void {
    // GIVEN a Pay ID with an empty host.
    const host = 'xpring.money'
    const path = ''
    const rawPayID = `${host}$${path}`

    // WHEN it is parsed to components.
    const payIDComponents = PayIdUtils.parsePayID(rawPayID)

    // THEN the Pay ID failed to parse.
    assert.isUndefined(payIDComponents)
  })

  it('parse Pay ID - non-ascii characters', function (): void {
    // GIVEN a Pay ID with non-ascii characters.
    const rawPayID = 'ZA̡͊͠͝LGΌIS̯͈͕̹̘̱ͮ$TO͇̹̺ͅƝ̴ȳ̳TH̘Ë͖́̉ ͠P̯͍̭O̚N̐Y̡'

    // WHEN it is parsed to components THEN the result is undefined
    assert.isUndefined(PayIdUtils.parsePayID(rawPayID))
  })
})
