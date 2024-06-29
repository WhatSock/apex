/*@license
Beep Module 1.1 for Apex 4X
It goes beep, just because. (BEEP BEEP BEEP)
Author: Bryan Garaventa (https://www.linkedin.com/in/bgaraventa)
Home: WhatSock.com  :  Download: https://github.com/whatsock/apex
License: MIT (https://opensource.org/licenses/MIT)
*/
"beep"in $A||$A.extend({beep:function(){var e=new(window.AudioContext||window.webkitAudioContext),t=e.createOscillator(),n=(t.frequency.setValueAtTime(1e3,e.currentTime),t.type="sine",e.createGain());n.gain.setValueAtTime(.5,e.currentTime),t.connect(n),n.connect(e.destination),t.start(),t.stop(e.currentTime+.1)}});