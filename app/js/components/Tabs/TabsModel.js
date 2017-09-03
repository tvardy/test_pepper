import EventEmitter from 'events'

const DEFAULT = {
  index: 0,
  tabs: [{ isLoading: false }]
}

export class TabsModel extends EventEmitter {
  constructor (props) {
    super()

    this.endpoint = props.endpoint
    this.detail = props.detail
    this.id = props.id

    this._default = Object.assign({}, DEFAULT, { uuid: props.uuid })
    Object.freeze(this._default)
    this._tabs = this.getDefault().tabs
  }

  getDefault () {
    return Object.assign({}, this._default)
  }

  getTabsData () {
    fetch(`${this.endpoint}/${this.id}`)
      .then((response) => {
        if (response.ok) return response.json()
        throw new Error('Server response error')
      })
      .then(this._onTabsData.bind(this))
      .catch(this._onError.bind(this))
  }

  getTabContent (index) {
    const tab = this._tabs[index]

    tab.isLoading = true

    if (tab.error) {
      tab.error = ''
    }

    this._updateTabs(tab, index)

    const _get = () => {
      fetch(`${this.endpoint}/${this.detail.replace('{id}', tab.id)}`)
        .then((response) => {
          if (response.ok) return response.text()
          throw new Error('Server response error')
        })
        .then(this._onTabContent.bind(this, tab, index))
        .catch(this._onError.bind(this, tab, index))
    }

    setTimeout(_get, 1234) // the timeout handles fake server delay
  }

  _onTabContent (tab, index, text) {
    tab.isLoading = false
    tab.content = text

    this._updateTabs(tab, index)
  }

  _onTabsData (data) {
    this._tabs = data.tabs.map(tab => Object.assign(tab, { isLoading: false }))
    this._emit()
    this.getTabContent(0)
  }

  _onError (...args) {
    if (args.length > 1) {
      const [ tab, index ] = args

      tab.isLoading = false
      tab.error = 'Connection error! Please, try again later...'

      this._updateTabs(index, tab)
    }
  }

  _emit () {
    this.emit('data', this._tabs)
  }

  _updateTabs (tab, index) {
    this._tabs = this._tabs.map((t, i) => (i === index) ? tab : t)
    this._emit()
  }
}
