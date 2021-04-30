"use strict";

const ESCAPED_DOT = /\\\./g
const ANY_DOT = /\./g

function hasKeyPath (object, keyPath) {
  for (const key of splitKeyPath(keyPath)) {
    if (object == null || !object.hasOwnProperty(key)) {
      return false
    }
    object = object[key]
  }
  return true
}

function getValueAtKeyPath (object, keyPath) {
  if (!keyPath) return object

  for (const key of splitKeyPath(keyPath)) {
    object = object[key]
    if (object == null) {
      return object
    }
  }
  return object
}

function setValueAtKeyPath (object, keyPath, value) {
  const [...keys, lastKey] = splitKeyPath(keyPath)
  for (const key of keys) {
    if (object[key] == null) {
      object[key] = {}
    }
    object = object[key]
  }
  object[lastKey] = value
}

function deleteValueAtKeyPath (object, keyPath) {
  const [...keys, lastKey] = splitKeyPath(keyPath)
  for (const key of keys) {
    if (object[key] == null) return;
    object = object[key]
  }
  delete object[lastKey];
}

function splitKeyPath (keyPath) {
  if (keyPath == null) return []

  let startIndex = 0, keyPathArray = []
  const len = keyPath.length
  for (let i = 0; i < len; i++) {
    if (keyPath[i] === '.' && (i === 0 || keyPath[i - 1] !== '\\')) {
      keyPathArray.push(keyPath.substring(startIndex, i).replace(ESCAPED_DOT, '.'))
      startIndex = i + 1
    }
  }
  keyPathArray.push(keyPath.substr(startIndex, len).replace(ESCAPED_DOT, '.'))

  return keyPathArray
}

function pushKeyPath (keyPath, key) {
  key = key.replace(ANY_DOT, '\\.');
  if (keyPath && keyPath.length > 0)
    return keyPath + '.' + key;
  else
    return key;
}

module.exports = {
  hasKeyPath: hasKeyPath,
  getValueAtKeyPath: getValueAtKeyPath,
  setValueAtKeyPath: setValueAtKeyPath,
  deleteValueAtKeyPath: deleteValueAtKeyPath,
  splitKeyPath: splitKeyPath,
  pushKeyPath: pushKeyPath
}
