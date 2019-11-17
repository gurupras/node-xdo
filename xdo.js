const ref = require('ref')
const Struct = require('ref-struct')
const ffi = require('ffi')

const charcodeMapStruct = Struct({
  key: 'char',
  code: 'char',
  symbol: 'char',
  group: 'int',
  modmask: 'int',
  needs_binding: 'int'
})
const charcodeMapStructType = ref.refType(charcodeMapStruct)

const xdoStruct = Struct({

  xdpy: ref.refType('int'),
  display_name: 'char *',
  charcodes: charcodeMapStructType,
  charcodes_len: 'int',
  keycode_high: 'int',
  keycode_low: 'int',
  keysyms_per_keycode: 'int',
  close_display_when_freed: 'int',
  quiet: 'int',
  debug: 'int',
  features_mask: 'int'
})
const xdoStructType = ref.refType(xdoStruct)

const libxdo = ffi.Library('libxdo', {
  xdo_new: [xdoStructType, [
    'string' // Display. E.g. :1
  ]],
  xdo_move_mouse: ['int', [
    xdoStructType,
    'int', // X
    'int', // Y
    'int' // screen
  ]],

  /* Buttons:
  * 1: left
  * 2: middle
  * 3: right,
  * 4: wheel-up
  * 5: wheel-down
  */
  xdo_mouse_down: ['int', [
    xdoStructType,
    'int', // Window
    'int' // Button
  ]],

  xdo_mouse_up: ['int', [
    xdoStructType,
    'int', // Window
    'int' // Button
  ]],

  xdo_click_window_multiple: ['int', [
    xdoStructType,
    'int', // Window
    'int', // Button
    'int', // Repeat
    'int' // Delay (us)
  ]],

  xdo_send_keysequence_window: ['int', [
    xdoStructType,
    'int', // Window
    'string', // Key sequence
    'int' // delay (us)
  ]],

  xdo_send_keysequence_window_down: ['int', [
    xdoStructType,
    'int', // Window
    'string', // Key sequence
    'int' // delay (us)
  ]],

  xdo_send_keysequence_window_up: ['int', [
    xdoStructType,
    'int', // Window
    'string', // Key sequence
    'int' // delay (us)
  ]],

  xdo_click_window: ['int', [
    xdoStructType,
    'int', // Window
    'int' // Button
  ]]
})

class Xdo {
  constructor (display) {
    this.display = display
    this.xdo = libxdo.xdo_new(display)
  }

  mouseMove (x, y, window = 0) {
    libxdo.xdo_move_mouse(this.xdo, x, y, window)
  }

  mouseDown (button, window = 0) {
    libxdo.xdo_mouse_down(this.xdo, window, button)
  }

  mouseUp (button, window = 0) {
    libxdo.xdo_mouse_up(this.xdo, window, button)
  }

  clickMultiple (button, repeat, delayUs = 10, window = 0) {
    libxdo.xdo_click_window_multiple(this.xdo, window, button, repeat, delayUs)
  }

  keySequence (sequence, delayUs = 1000, window = 0) {
    libxdo.xdo_send_keysequence_window(libxdo, window, sequence, delayUs)
  }

  keyDown (sequence, delayUs = 1000, window = 0) {
    libxdo.xdo_send_keysequence_window_down(this.xdo, window, sequence, delayUs)
  }

  keyUp (sequence, delayUs = 1000, window = 0) {
    libxdo.xdo_send_keysequence_window_up(this.xdo, window, sequence, delayUs)
  }
}

module.exports = Xdo
