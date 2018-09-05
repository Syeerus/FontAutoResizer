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
                        updateSettings(resizeFonts);
                    }
                });
            }
            else {
                updateSettings(resizeFonts);
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

    function resizeFonts() {
        let resize_smallest = (typeof settings.smallest === "number");
        let resize_largest = (typeof settings.largest === "number");

        document.body.querySelectorAll("*").forEach(function(element) {
            let font_size_str = getComputedStyle(element).fontSize;
            if (font_size_str) {
                let font_size = Number.parseFloat(font_size_str.substring(0, font_size_str.indexOf("px")));
                if (resize_smallest && font_size < settings.smallest) {
                    element.style.fontSize = settings.smallest + "px";
                }
                else if (resize_largest && font_size > settings.largest) {
                    element.style.fontSize = settings.largest + "px";
                }
            }
        });
    }

    init();
})();
