/* global module */
import Vue from 'vue'

import components from './components'

const moduleAttribute = 'data-module'
const propsAttribute = 'data-settings'
const DOMModules = document.querySelectorAll(`[${moduleAttribute}]`)

DOMModules.forEach(el => {
  const name = el.getAttribute(moduleAttribute)
  const Component = components[name]

  if (Component) {
    Vue.component(name, Component)
    const data = new Function('return ' + el.getAttribute(propsAttribute))() || {} // eslint-disable-line no-new-func
    new Vue({ // eslint-disable-line no-new
      el,
      data,
      render: (h) => h(name)
    })
  }
})

if (module.hot) {
  module.hot.accept()
}
