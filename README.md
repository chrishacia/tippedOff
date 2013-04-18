tippedOff
=========
Currently supports jQuery versions 1.4.2 up to 1.7.2 (makes use of the .live() functionality which is depreciated in later versions)
I will be modifying it in the near future to support 1.8.x+<br><br><br>


// $.tippedOff();<br>
// In its current for, this is just a very raw method of displaying a tooltip like message.<br>
// Other than that I have nothing else to say about it currently.<br>
//<br>
// Copyright (c) 2013 Christopher Hacia git@chrishacia.com<br>
// Website: http://www.chrishacia.com/scripts/tippedOff<br>
// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php<br>
// Author: Christopher Hacia<br>
// Version: 0.9<br>
//<br>
//<br>
// Useage:<br>
// $('.selector').tippedOff();<br>
// <br>
// What this does is takes a JSON formated object and iterates over it placing "help_text" in the elements that have the matching ID references<br>
// When a tooltip is fired off it will show that tooltip with the corresponding message<br>
// By default this will trigger by either hovering over the trigger for 1.3 seconds or by clicking on the trigger<br>
// the reason for the display is a lot of people like to read with there mouse as a guide, and you do not want to bother<br>
// your user with a little pop up everytime they mouse over it. Rather if they stay on it for a second it will then assume <br>
// your user wants to know more, and show, alternatively the user can click on it and have it instantly pop open.<br>
// the tooltip currently will close after a second when you mouse off of it or the trigger element.<br>