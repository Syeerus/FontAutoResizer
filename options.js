/**
 * Font Auto-resizer Extension
 * @file options.js
 * @author Syeerus
 * @license MIT
 */

 (function() {
     "use strict";

     const DEFAULT_SMALLEST_SIZE = 10.0;
     const DEFAULT_LARGEST_SIZE  = null;

     let txtSmallest = null;
     let txtLargest = null;

     function onNumberFieldBlur(e) {
         let value = e.target.value === "" ? "" : Number.parseFloat(e.target.value);
         if (value === "" || (value !== Number.NaN && value > 0.0)) {
             let save_obj = {};
             save_obj[e.target.dataset.setting] = value;
             chrome.storage.sync.set(save_obj, function() {
                 if (chrome.runtime.lastError) {
                     console.log("An error occured: ", chrome.runtime.lastError.message);
                 }
                 else {
                    e.target.className = "field-success";
                 }
             })
         }
         else {
             e.target.className = "field-error";
         }
     }

     function clearSettings() {
         chrome.storage.sync.clear(function() {
             if (chrome.runtime.lastError) {
                 console.log("An error occured while clearing settings: ", chrome.runtime.lastError.message);
             }
             else {
                 let success_msg = document.getElementById("clearSuccessMsg");
                 if (success_msg) {
                     success_msg.classList.remove("hidden");
                 }
             }
         });
     }

     function updateFields() {
         chrome.storage.sync.get(["smallest", "largest"], function(result) {
             txtSmallest.value = result.smallest;
             txtLargest.value = result.largest;
         });
     }

    document.addEventListener("DOMContentLoaded", function() {
        txtSmallest = document.getElementById("txtSmallest");
        txtLargest = document.getElementById("txtLargest");

        if (txtSmallest === null || txtLargest === null) {
            console.error("Not all option fields are present.");
        }
        else {
            chrome.storage.sync.get(["hasBeenSetup"], function(result) {
                if (typeof result.hasBeenSetup !== "boolean" || result.hasBeenSetup === false) {
                    // Set defaults
                    chrome.storage.sync.set({
                        hasBeenSetup: true,
                        smallest: DEFAULT_SMALLEST_SIZE,
                        largest: DEFAULT_LARGEST_SIZE
                    }, function() {
                        if (chrome.runtime.lastError) {
                            console.log("An error occured setting defaults: ", chrome.runtime.lastError.message);
                        }
                        else {
                            updateFields();
                        }
                    });
                }
                else {
                    updateFields();
                }
            });

            txtSmallest.addEventListener("blur", onNumberFieldBlur);
            txtLargest.addEventListener("blur", onNumberFieldBlur);

            let btn_clear_settings = document.getElementById("btnClearSettings");
            if (btn_clear_settings) {
                btn_clear_settings.addEventListener("click", clearSettings);
            }
        }
    });
 })();
