import Inferno, { linkEvent } from 'inferno';
import Component from 'inferno-component';

import uuid from 'uuid/v1';
import superagent from 'superagent';
import classnames from 'classnames';

// public
export class Tabs extends Component {
  constructor(props) {
    super(props);

    this.endpoint = props.endpoint;
    this.detail = props.detail;
    this.id = props.id;

    this.state = {
      uuid: uuid(),
      index: 0,
      tabs: [{ isLoading: true }]
    };
  }

  componentDidMount() {
    this._getTabsData();
  }

  _getTabsData() {
    superagent
      .get(`${this.endpoint}/${this.id}`)
      .then(this._onTabsData.bind(this))
      .catch(this._onError.bind(this));
  }

  _getTabContent(index) {
    const tab = this.state.tabs[index];

    tab.isLoading = true;

    this._updateTabs(tab, index);

    const _get = () => {
      superagent
        .get(`${this.endpoint}/${this.detail.replace('{uuid}', tab.id)}`)
        .then(this._onTabContent.bind(this, tab, index))
        .catch(this._onError.bind(this, tab, index));
    };

    setTimeout(_get, 1234); // the timeout handles fake server delay
  }

  _onChange({ instance, index}, event) {
    const tab = instance.state.tabs[index];

    if (tab.error) {
      tab.error = '';
      instance._updateTabs(tab, index);
    }

    event.stopPropagation();
    instance.setState({ index });

    if (!tab.content) {
      instance._getTabContent(index);
    }
  }

  _onTabContent(tab, index, response) {
    tab.isLoading = false;
    tab.content = response.text;

    this._updateTabs(tab, index);
  }

  _onTabsData(response) {
    const tabs = JSON.parse(response.text).tabs.map(tab => Object.assign(tab, { isLoading: false }));

    this.setState(
      { tabs },
      () => {
        this._getTabContent(0);
      }
    );
  }

  _onError(...args) {
    if (args.length > 1) {
      const [ tab, index ] = args;

      tab.isLoading = false;
      tab.error = 'Connection error! Please, try again later...';

      this._updateTabs(tab, index);
    }
  }

  _updateTabs(tab, index) {
    this.setState({
      tabs: this.state.tabs.map((t, i) => (i === index) ? tab : t)
    });
  }

  _renderTab(tab, index) {
    const id = `${this.state.uuid}_${index}`;

    return [
      this._renderInput({ tab, id, index }),
      this._renderLabel({ tab, id }),
      this._renderContent({ tab })
    ];
  }

  _renderInput({ tab = {}, id = '', index = null} = {}) {
    if (tab.id) {
      return (
        <input
          class="c-tabs__select"
          type="radio"
          name={this.state.uuid}
          value={tab.id}
          id={id}
          checked={this.state.index === index}
          onClick={linkEvent({ instance: this, index }, this._onChange)}
        />
      );
    }
    return null;
  }

  _renderLabel({ tab = {}, id = '' } = {}) {
    if (tab.id) {
      return (
        <label class="c-tabs__name" for={id} icon={tab.icon}>{tab.name}</label>
      );
    }
    return null;
  }

  _renderContent({ tab = {} } = {}) {
    const classes = classnames(
      'c-tabs__content',
      { 'is-loading': tab.isLoading },
      { 'is-error': tab.error }
    );
    const __html = tab.content || tab.error;

    return (
      <div class={classes} dangerouslySetInnerHTML={ { __html } } />
    );
  }

  render() {
    return (
      <div class="c-tabs" id={this.state.uuid}>
        {this.state.tabs.map(this._renderTab.bind(this))}
      </div>
    );
  }
}

