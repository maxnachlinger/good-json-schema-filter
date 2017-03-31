'use strict'

const Transform = require('stream').Transform
const _ = require('lodash')
const createRules = require('./create-rules')

class GoodJsonSchemaFilter extends Transform {
  constructor (params) {
    super(Object.assign({}, params.options, {objectMode: true}))
    this.rules = createRules(params.rules)
  }

  _transform (data, enc, next) {
    const ret = this.rules.reduce((accum, rule) => {
      // if this data has already been omitted or is empty
      if (_.isEmpty(accum)) {
        return accum
      }
      return rule(accum)
    }, data)

    return next(null, ret)
  }
}

module.exports = GoodJsonSchemaFilter
