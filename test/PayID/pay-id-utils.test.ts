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
    const payIDComponents = PayIdUtils.parsePayId(rawPayID)

    // THEN the host and path are set correctly.
    assert.equal(payIDComponents?.host, host)
    assert.equal(payIDComponents?.path, `/${path}`)
  })

  it('parse Pay ID - valid multiple dollar signs', function (): void {
    // GIVEN a Pay ID with more than one '$'.
    const host = 'xpring.money'
    const path = 'george$$$washington$'
    const rawPayID = `${path}$${host}`

    // WHEN it is parsed to components.
    const payIDComponents = PayIdUtils.parsePayId(rawPayID)

    // THEN the host and path are set correctly.
    assert.equal(payIDComponents?.host, host)
    assert.equal(payIDComponents?.path, `/${path}`)
  })

  it('parse Pay ID - invalid multiple dollar signs (ends with $)', function (): void {
    // GIVEN a Pay ID in which the host ends with a $.
    const host = 'xpring.money$'
    const path = 'george$$$washington$'
    const rawPayID = `${path}$${host}`

    // WHEN it is parsed to components.
    const payIDComponents = PayIdUtils.parsePayId(rawPayID)

    // THEN the Pay ID failed to parse.
    assert.isUndefined(payIDComponents)
  })

  it('parse Pay ID - no dollar signs', function (): void {
    // GIVEN a Pay ID that contains no dollar signs
    const rawPayID = `georgewashington@xpring.money`

    // WHEN it is parsed to components.
    const payIDComponents = PayIdUtils.parsePayId(rawPayID)

    // THEN the Pay ID failed to parse.
    assert.isUndefined(payIDComponents)
  })

  it('parse Pay ID - empty host', function (): void {
    // GIVEN a Pay ID with an empty host.
    const host = ''
    const path = 'georgewashington'
    const rawPayID = `${path}$${host}`

    // WHEN it is parsed to components.
    const payIDComponents = PayIdUtils.parsePayId(rawPayID)

    // THEN the Pay ID failed to parse.
    assert.isUndefined(payIDComponents)
  })

  it('parse Pay ID - empty path', function (): void {
    // GIVEN a Pay ID with an empty path.
    const host = 'xpring.money'
    const path = ''
    const rawPayID = `${path}$${host}`

    // WHEN it is parsed to components.
    const payIDComponents = PayIdUtils.parsePayId(rawPayID)

    // THEN the Pay ID failed to parse.
    assert.isUndefined(payIDComponents)
  })
})
