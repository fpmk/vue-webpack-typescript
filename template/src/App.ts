/// <reference path='../typings/tsd.d.ts' />

'use strict'

import VueComponent from 'vue-class-component'

import Hello from './components/Hello'

@VueComponent({
  template: require('./App.html'),
  components: {
    Hello
  }
})
export default class {
}
