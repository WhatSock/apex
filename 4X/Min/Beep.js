/*@license
Beep Module 1.2 for Apex 4X
It goes beep, just because. (BEEP BEEP BEEP)
Author: Bryan Garaventa (https://www.linkedin.com/in/bgaraventa)
Home: WhatSock.com  :  Download: https://github.com/whatsock/apex
License: MIT (https://opensource.org/licenses/MIT)
*/
"beep"in $A||$A.extend({beep:function(e){var t=new(window.AudioContext||window.webkitAudioContext),n=t.createOscillator(),i=(n.frequency.setValueAtTime(1e3,t.currentTime),n.type="sine",t.createGain());i.gain.setValueAtTime(.5,t.currentTime),n.connect(i),i.connect(t.destination),n.start(),n.stop(t.currentTime+(e||.1))}});