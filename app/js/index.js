import Inferno from 'inferno'

import { Tabs } from './components/Tabs'

if (module.hot) {
  require('inferno-devtools')
}

const moduleAttribute = 'data-module'
const propsAttribute = 'data-props'
const DOMModules = document.querySelectorAll(`[${moduleAttribute}]`)
const InfernoComponents = {
  Tabs
}

DOMModules.forEach(module => {
  const name = module.getAttribute(moduleAttribute)
  const Component = InfernoComponents[name]

  if (Component) {
    const props = new Function('return ' + module.getAttribute(propsAttribute))() || {}

    Inferno.render(<Component {...props} />, module)
  }
});

if (module.hot) {
  module.hot.accept()
}
