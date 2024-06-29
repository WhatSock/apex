/*@license
Beep Module 1.2 for Apex 4X
It goes beep, just because. (BEEP BEEP BEEP)
Author: Bryan Garaventa (https://www.linkedin.com/in/bgaraventa)
Home: WhatSock.com  :  Download: https://github.com/whatsock/apex
License: MIT (https://opensource.org/licenses/MIT)
*/

(function () {
  if (!("beep" in $A))
    $A.extend({
      beep: function (duration) {
        // Create an instance of the AudioContext
        var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        // Create an oscillator node
        var oscillator = audioCtx.createOscillator();

        // Set the oscillator frequency to 1000 Hz (1 kHz)
        oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime);

        // Set the oscillator type to sine wave
        oscillator.type = "sine";

        // Create a gain node
        var gainNode = audioCtx.createGain();

        // Set the gain (volume) to 0.5
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);

        // Connect the oscillator to the gain node
        oscillator.connect(gainNode);

        // Connect the gain node to the audio context's destination (the speakers)
        gainNode.connect(audioCtx.destination);

        // Start the oscillator
        oscillator.start();

        // Stop the oscillator after 0.1 seconds (100 ms)
        oscillator.stop(audioCtx.currentTime + (duration || 0.1));
      },
    });
})();
