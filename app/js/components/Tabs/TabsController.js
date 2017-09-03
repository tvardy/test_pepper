import classnames from 'classnames'
import uuid from 'uuid/v1'

import { TabsModel } from './TabsModel'

// public
export default {
  data () {
    return {
      index: -1,
      tabs: []
    }
  },

  computed: {
    uuid () {
      return this.options.uuid
    }
  },

  methods: {
    contentClass ({ isLoading = false, error = false } = {}) {
      return classnames(
        'c-tabs__content',
        { 'is-loading': isLoading },
        { 'is-error': error }
      )
    },
    currentIndex () {
      return this.index
    },
    onChange (index) {
      const tab = this.tabs[index]

      this.index = index

      if (!tab.content) {
        this.model.getTabContent(index)
      }
    },
    tabId (index) {
      return `${this.uuid}_${index}`
    }
  },

  created () {
    this.options = Object.assign({}, this.$parent.$data, { uuid: uuid() })

    this.model = new TabsModel(this.options)
    this.model.on('data', (tabs) => { this.tabs = tabs })

    const defaultState = this.model.getDefault()

    this.index = defaultState.index
    this.tabs = defaultState.tabs
  },

  mounted () {
    this.model.getTabsData()
  },

  beforeDestroy () {
    this.model.off('data')
  }
}
