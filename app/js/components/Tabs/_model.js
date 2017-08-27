import EventEmitter from 'events'
import superagent from 'superagent'

const DEFAULT = {
  index: 0,
  tabs: [{ isLoading: true }]
}

export class TabsModel extends EventEmitter {
  constructor(props) {
    super()

    this.endpoint = props.endpoint
    this.detail = props.detail
    this.id = props.id

    this._default = Object.assign({}, DEFAULT, { uuid: props.uuid })
    Object.freeze(this._default)
    this._tabs = this.getDefault().tabs
  }

  getDefault() {
    return Object.assign({}, this._default)
  }

  getTabsData() {
    superagent
      .get(`${this.endpoint}/${this.id}`)
      .then(this._onTabsData)
      .catch(this._onError)
  }

  getTabContent(index) {
    const tab = this._tabs[index]

    tab.isLoading = true

    if (tab.error) {
      tab.error = ''
    }

    this._updateTabs(tab, index)

    const _get = () => {
      superagent
        .get(`${this.endpoint}/${this.detail.replace('{uuid}', tab.id)}`)
        .then(this._onTabContent.bind(this, tab, index))
        .catch(this._onError.bind(this, tab, index))
    }

    setTimeout(_get, 1234) // the timeout handles fake server delay
  }

  _onTabContent(tab, index, response) {
    tab.isLoading = false
    tab.content = response.text

    this._updateTabs(tab, index)
  }

  _onTabsData = (response) => {
    const tabs = JSON.parse(response.text).tabs.map(tab => Object.assign(tab, { isLoading: false }))

    this._tabs = tabs
    this._emit()
    this.getTabContent(0)
  }

  _onError = (...args) => {
    if (args.length > 1) {
      const [ tab, index ] = args

      tab.isLoading = false
      tab.error = 'Connection error! Please, try again later...'

      this._updateTabs(index, tab)
    }
  }

  _emit() {
    this.emit('data', this._tabs)
  }

  _updateTabs(tab, index) {
    this._tabs = this._tabs.map((t, i) => (i === index) ? tab : t)
    this._emit()
  }
}
