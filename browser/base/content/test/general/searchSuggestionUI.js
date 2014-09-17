/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

(function () {

const TEST_MSG = "SearchSuggestionUIControllerTest";
const ENGINE_NAME = "browser_searchSuggestionEngine searchSuggestionEngine.xml";

let input = content.document.querySelector("input");
let gController =
  new content.SearchSuggestionUIController(input, input.parentNode);
gController.engineName = ENGINE_NAME;
gController.remoteTimeout = 5000;

addMessageListener(TEST_MSG, msg => {
  messageHandlers[msg.data.type](msg.data.data);
});

let messageHandlers = {

  key: function (arg) {
    let keyName = typeof(arg) == "string" ? arg : arg.key;
    content.synthesizeKey(keyName, {});
    let wait = arg.waitForSuggestions ? waitForSuggestions : cb => cb();
    wait(ack);
  },

  focus: function () {
    gController.input.focus();
    ack();
  },

  blur: function () {
    gController.input.blur();
    ack();
  },

  mousedown: function (suggestionIdx) {
    gController.onClick = () => {
      gController.onClick = null;
      ack();
    };
    let row = gController._table.children[suggestionIdx];
    content.sendMouseEvent({ type: "mousedown" }, row);
  },

  addInputValueToFormHistory: function () {
    gController.addInputValueToFormHistory();
    ack();
  },

  reset: function () {
    // Reset both the input and suggestions by select all + delete.
    gController.input.focus();
    content.synthesizeKey("a", { accelKey: true });
    content.synthesizeKey("VK_DELETE", {});
    ack();
  },
};

function ack() {
  sendAsyncMessage(TEST_MSG, currentState());
}

function waitForSuggestions(cb) {
  let observer = new content.MutationObserver(() => {
    if (gController.input.getAttribute("aria-expanded") == "true") {
      observer.disconnect();
      cb();
    }
  });
  observer.observe(gController.input, {
    attributes: true,
    attributeFilter: ["aria-expanded"],
  });
}

function currentState() {
  let state = {
    selectedIndex: gController.selectedIndex,
    numSuggestions: gController.numSuggestions,
    suggestionAtIndex: [],
    isFormHistorySuggestionAtIndex: [],

    tableHidden: gController._table.hidden,
    tableChildrenLength: gController._table.children.length,
    tableChildren: [],

    inputValue: gController.input.value,
    ariaExpanded: gController.input.getAttribute("aria-expanded"),
  };

  for (let i = 0; i < gController.numSuggestions; i++) {
    state.suggestionAtIndex.push(gController.suggestionAtIndex(i));
    state.isFormHistorySuggestionAtIndex.push(
      gController.isFormHistorySuggestionAtIndex(i));
  }

  for (let child of gController._table.children) {
    state.tableChildren.push({
      textContent: child.textContent,
      classes: new Set(child.className.split(/\s+/)),
    });
  }

  return state;
}

})();
