import * as m from 'Minified';
import Carpet from 'Carpet';

import './modules/tabs';

const debugKey = 'alwaysLookOnTheBrightSideOfLife';
const debugVal = 'whistle';

const $ = m.$;

function init () {
  $('html').set('+js -no-js');

  if (
    $(`meta[name="${debugKey}"]`).get('@content') === debugVal ||
    new RegExp(`${debugKey}=${debugVal}`).test(location.search)
  ) {
    Carpet.loggingEnabled = true;
  }
  Carpet.init();
}

$(init);
