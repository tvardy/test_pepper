import * as m from 'Minified';
import Carpet from 'Carpet';

/**
 * MinifiedJS definitions
 */
const _ = m._;
const $ = m.$;
const HTML = m.HTML;

const defaults = {
  selectors: {
    input: 'input[type="radio"]',
    siblingContent: 'label + div',
    content: 'input[type="radio"]:checked + label + div'
  },
  classes: {
    loading: 'is-loading',
    error: 'is-error'
  },
  messages: {
    error: 'Connection error! Please, try again later...'
  }
};

function Tabs (exports, settings, context) {
  const options = _.extend({}, defaults, settings);

  const $parent = $(context);
  const $inputs = $parent.select(options.selectors.input);

  function init () {
    $inputs.on('change', onChange);
  }

  function onChange () {
    const $content = getContentElem($(this));

    if (isEmpty($content)) {
      clearErrors($content);
      toggleLoading($content);
      loadContent($content, $(this).get('value'));
    }
  }

  function getContentElem ($elem) {
    return $elem ? $elem.next(options.selectors.siblingContent) : $parent.select(options.selectors.content);
  }

  function isEmpty ($elem) {
    return new RegExp(`^(${options.messages.error})?$`).test($elem.text());
  }

  function clearErrors ($elem) {
    ($elem || getContentElem()).set(`-${options.classes.error}`).fill();
  }

  function toggleLoading ($elem) {
    ($elem || getContentElem()).set(`${options.classes.loading}`);
  }

  function loadContent ($elem, id) {
    const url = _.format(options.url, { id });

    function _get () {
      $.request('get', url)
        .then(onData.bind(null, $elem))
        .error(onError.bind(null, $elem))
        .always(toggleLoading.bind(null, $elem));
    }

    setTimeout(_get, 1234); // the timeout handles fake server delay
  }

  function onData ($elem, payload) {
    clearErrors($elem);
    $elem.fill(HTML(payload));
  }

  function onError ($elem) {
    $elem
      .set(`+${options.classes.error}`)
      .fill(options.messages.error);
  }

  exports.init = init;
}

Carpet.module('tabs', Tabs);
