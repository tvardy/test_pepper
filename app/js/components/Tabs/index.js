import { linkEvent } from 'inferno'
import Component from 'inferno-component'

import uuid from 'uuid/v1'
import classnames from 'classnames'

import { TabsModel } from './_model'

// public
export class Tabs extends Component {
  constructor(props) {
    super(props);

    this.options = Object.assign({}, props, { uuid: uuid() })

    this.model = new TabsModel(this.options)
    this.model.on('data', this._updateState)

    this.state = this.model.getDefault()
  }

  componentDidMount() {
    this.model.getTabsData()
    this.model.on('data', this._updateState)
  }

  componentWillUnmount() {
    this.model.off('data')
  }

  _updateState = (tabs) => {
    this.setState({ tabs })
  }

  _onChange({ instance, index }, event) {
    const tab = instance.state.tabs[index]

    event.stopPropagation();
    instance.setState({ index });

    if (!tab.content) {
      instance.model.getTabContent(index);
    }
  }

  renderTab = (tab, index) => {
    const id = `${this.state.uuid}_${index}`

    return [
      this.renderInput({ tab, id, index }),
      this.renderLabel({ tab, id }),
      this.renderContent({ tab })
    ]
  }

  renderInput({ tab = {}, id = '', index = null} = {}) {
    if (tab.id) {
      return (
        <input
          className='c-tabs__select'
          type='radio'
          name={this.state.uuid}
          value={tab.id}
          id={id}
          checked={this.state.index === index}
          onClick={linkEvent({ instance: this, index }, this._onChange)}
        />
      )
    }
    return null
  }

  renderLabel({ tab = {}, id = '' } = {}) {
    if (tab.id) {
      return (
        <label className='c-tabs__name' for={id} icon={tab.icon}>{tab.name}</label>
      )
    }
    return null
  }

  renderContent({ tab = {} } = {}) {
    const classes = classnames(
      'c-tabs__content',
      { 'is-loading': tab.isLoading },
      { 'is-error': tab.error }
    )
    const __html = tab.content || tab.error

    return (
      <div className={classes} dangerouslySetInnerHTML={ { __html } } />
    )
  }

  render() {
    return (
      <div className="c-tabs" id={this.state.uuid}>
        {this.state.tabs.map(this.renderTab)}
      </div>
    )
  }
}

