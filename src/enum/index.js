/**
 * Created by zuozhuo on 2016/12/8.
 */
'use strict'

import _ from 'lodash'

class XEnumItem {
  constructor (value, text, meta = {}) {
    this.value = value
    this.text = text
    this.meta = meta
  }

  getValue () {
    return this.value
  }

  getText () {
    return this.text
  }

  equals (value) {
    if (value instanceof XEnumItem) {
      value = value.getValue()
    }
    return this.value === value
  }
}
class XEnum {
  constructor (enumDict) {
    this.enumItems = Object.values(enumDict)
    Object.keys(enumDict).forEach(key => {
      this[key] = enumDict[key]
    })
  }

  findItem (itemValue) {
    if (itemValue instanceof XEnumItem) {
      itemValue = itemValue.getValue()
    }
    return this.enumItems.find(e => e.getValue() === itemValue)
  }

  toText (value) {
    let item = _.find(this.enumItems, ['value', value])
    return item === undefined ? null : item.getText()
  }

  parseValueByText (text) {
    let exist = _.find(this.enumItems, ele => {
      return ele.getText() === text
    })
    if (exist === undefined) {
      return null
    } else {
      return exist.getValue()
    }
  }

  getOptions (excludeIndex) {
    if (!this.options) {
      return this.enumItems
        .filter(e => excludeIndex !== e.getValue())
        .map(e => {
          return {
            value: e.getValue(),
            label: e.getText()
          }
        })
    } else {
      return []
    }
  }

  getSpecOptions (specKey = []) {
    if (!this.options) {
      return this.enumItems
        .filter(e => specKey.includes(e.getValue()))
        .map(e => {
          return {
            value: e.getValue(),
            label: e.getText()
          }
        })
    } else {
      return []
    }
  }
}

const ENUM_EXAMPLE = new XEnum({
  PDF: new XEnumItem(0, 'pdf'),
  WORD: new XEnumItem(1, 'docx'),
})

export {
  ENUM_EXAMPLE,
}

