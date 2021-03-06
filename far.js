/**
 * Font Auto-resizer Extension
 * @file far.js
 * @author Syeerus
 * @license MIT
 */

(function() {
    "use strict";

    const DEFAULT_SMALLEST_SIZE = 10.0;
    const DEFAULT_LARGEST_SIZE = null;

    let settings = null;
    let mutationObserver = null;

    function init() {
        chrome.storage.sync.get(["hasBeenSetup"], function(result) {
            if (typeof result.hasBeenSetup !== "boolean" || result.hasBeenSetup === false) {
                // Set defaults
                chrome.storage.sync.set({
                    hasBeenSetup: true,
                    smallest: DEFAULT_SMALLEST_SIZE,
                    largest: DEFAULT_LARGEST_SIZE
                }, function() {
                    if (chrome.runtime.lastError) {
                        console.log("An error occured: ", chrome.runtime.lastError.message);
                    }
                    else {
                        updateSettings(onSettingsUpdated);
                    }
                });
            }
            else {
                updateSettings(onSettingsUpdated);
            }
        });
    }

    function updateSettings(callback) {
        chrome.storage.sync.get(["smallest", "largest"], function(result) {
            if (chrome.runtime.lastError) {
                console.log("An error occured: ", chrome.runtime.lastError.message);
            }
            else {
                settings = result;
                callback();
            }
        });
    }

    function onSettingsUpdated() {
        resizeFonts(document.body.querySelectorAll("*"));
        mutationObserver = new MutationObserver(onPageMutation);
        mutationObserver.observe(document.body, {
            attributes: false,
            characterData: false,
            childList: true,
            subtree: true,
            attributeOldValue: false,
            characterDataOldValue: false
        });
    }

    function onPageMutation(mutation_list) {
        let elements = [];
        for (let mutation of mutation_list) {
            for (let node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    elements.push(node);
                    elements.concat(Array.prototype.slice(node.querySelectorAll("*")));
                }
            }
        }

        resizeFonts(elements);
    }

    function resizeFonts(elements) {
        let resize_smallest = (typeof settings.smallest === "number");
        let resize_largest = (typeof settings.largest === "number");

        for(let element of elements) {
            let font_size_str = getComputedStyle(element).fontSize;
            if (font_size_str) {
                let font_size = Number.parseFloat(font_size_str.substring(0, font_size_str.indexOf("px")));
                if (resize_smallest && font_size !== 0 && font_size < settings.smallest) {
                    element.style.setProperty("font-size", settings.smallest + "px", "important");
                }
                else if (resize_largest && font_size > settings.largest) {
                    element.style.setProperty("font-size", settings.largest + "px", "important");
                }
            }
        }
    }

    init();
})();
