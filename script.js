// $.tippedOff();
// In its current for, this is just a very raw method of displaying a tooltip like message.
// Other than that I have nothing else to say about it currently.
//
// Copyright (c) 2013 Christopher Hacia git@chrishacia.com
// Website: http://www.chrishacia.com/scripts/tippedOff
// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
// Author: Christopher Hacia
// Version: 0.92
//
//
// Useage:
// $('.selector').tippedOff();
//
// What this does is takes a JSON formated object and iterates over it placing "help_text" in the elements that have the matching ID references
// When a tooltip is fired off it will show that tooltip with the corresponding message
// By default this will trigger by either hovering over the trigger for 1.3 seconds or by clicking on the trigger
// the reason for the display is a lot of people like to read with there mouse as a guide, and you do not want to bother
// your user with a little pop up everytime they mouse over it. Rather if they stay on it for a second it will then assume
// your user wants to know more, and show, alternatively the user can click on it and have it instantly pop open.
// the tooltip currently will close after a second when you mouse off of it or the trigger element.
//
//I have a very specific method of delivering JSON in my projects to keep things orderly. Below is an example of that in particular.
//If you do not like this format, you can always change it and the section of code below that coresponds to mapping the data to the right thing.
//which is currently line 63: var help_obj = tippedOff_obj.data.help_text;
var tippedOff_obj = {"status": "SUCCESS","code": null,"message": null,"data": {"help_text": {"help_ref_id_1": "some general help text","help_ref_id_2": "some more general help text"}},"actions": null};
var tippedOff_timer = null;//global var for the functions to see if the timer is running or not, to try and prevent overlap and other nasty UI side effects
var currentMousePos = { x: -1, y: -1 };
(function($)
{
	$.fn.tippedOff = function(obj, settings)
	{
		var config = $.extend({
			'top':0,
			'left':0,
			'width':'400px',
			'height':'100px',
			'styleClass':'round_edges green_border',
			'wait':1300,
			'closeWait':1000,
			'showFixed':false
		}, settings);

		if($('.tippedOff_msg_fixed').length > 0)
		{
			$('.tippedOff_msg_fixed').remove();
		}
		$('body').append('<div class="tippedOff_msg_fixed '+config.styleClass+'" style="height:'+config.height+';width:'+config.width+';"></div>');

		return this.each(function()
		{
			if(obj == null || obj == undefined || obj == '')
			{
				alert('Missing Help Text Object.');
				return false;
			}
			$this = $(this);
			$this.addClass('tippedOff_hover');
			$this.attr('data-wait', config.wait);
			$this.attr('data-cwait', config.closeWait);
			$this.attr('data-offsetLeft', config.left);
			$this.attr('data-offsetTop', config.top);
			$this.attr('data-showFixed', config.showFixed);
			var tippedHTML = '';
				tippedHTML += '<div class="tippedOff_msg '+config.styleClass+'" style="height:'+config.height+';width:'+config.width+';">';
			if($this.data('ref') == null || $this.data('ref') == undefined || $this.data('ref') == '')
			{
				tippedHTML += 'Message Reference ID Missing or not Found.';
			}
			else
			{
				if(obj.status == "SUCCESS")
				{
					var help_obj = obj.data.help_text;
					if(help_obj.hasOwnProperty($this.data('ref')))
					{
						tippedHTML += help_obj[$this.data('ref')];
					}
					else
					{
						tippedHTML += 'Invalid help text reference found, or no reference given.';
					}
				}
				else
				{
					tippedHTML += 'Tipped Off help text object missing or invalid.';
				}
			}
			tippedHTML += '</div>';
			$this.after(tippedHTML);
		});
	};
})(jQuery);



$('.tippedOff_hover').live({
				'mouseenter':function(){tippedOffShow($(this), $(this).data('wait'));},
				'mouseleave':function(){tippedOffHide($(this).data('cwait'));},
				'click':function(e){e.stopImmediatePropagation();tippedOffShow($(this), false);}
});
$('.tippedOff_msg, .tippedOff_msg_fixed').live({
				'mouseenter':function(){clearTippedOffTimer();},
				'mouseleave':function(){tippedOffHide($(this).prev('span').data('cwait'));},
				'click':function(e){e.stopImmediatePropagation();tippedOffHide(false);}
});
function tippedOffShow(elem, wait, showFixed)
{
	$elem = elem;

	//alert('hello')
	$msg_elem = $elem.next('.tippedOff_msg');
	var elPos = tippedOffElemPosition($elem);
	var offsetX = $elem.data('offsetLeft');
	var offsetY = $elem.data('offsetTop');
	var position = "absolute";

	if( $elem.data('showFixed') == false )
	{
		elPos.setting_left = elPos.setting_left + offsetX;
		elPos.setting_top = elPos.setting_top + offsetY;
		position = "absolute";
	}
	else
	{
/*
		elPos.setting_left = Math.min( window.event.clientX, $elem.offset().left );
		elPos.setting_top = Math.min( window.event.clientY, $elem.offset().top) + $elem.height(); // elPos.setting_top+offsetY;
*/
		elPos.setting_left = Math.min( currentMousePos.x, $elem.offset().left );
		elPos.setting_top = Math.min( currentMousePos.y, $elem.offset().top) + $elem.height(); // elPos.setting_top+offsetY;
		position = "fixed";
	}

	if(tippedOff_timer !== null)
	{
		clearTippedOffTimer();
	}

	if( $msg_elem.is(':visible')  || $('.tippedOff_msg_fixed').is(':visible'))
	{	// already visible; don't show again
		if( wait == false )
			 $('.tippedOff_msg, .tippedOff_msg_fixed').hide();
		return;
	}

	if(wait !== false )
	{
		tippedOff_timer = setTimeout(function()
		{
			if($('.tippedOff_msg').is(':visible')){$('.tippedOff_msg').hide();}
			if($('.tippedOff_msg_fixed').is(':visible')){$('.tippedOff_msg_fixed').hide().empty();}

			if( $elem.data('showFixed') == false )
			{
				$msg_elem.css({"top":elPos.setting_top, "left":elPos.setting_left, "position":position}).show();
				tippedOffMsgElemPos($msg_elem, elPos)
			}
			else
			{
				tippedOffShowFixedEl(wait, elPos)
			}
		}, wait);
	}
	else
	{
		if($('.tippedOff_msg').is(':visible')){$('.tippedOff_msg').hide();}
		if($('.tippedOff_msg_fixed').is(':visible')){$('.tippedOff_msg_fixed').hide().empty();}
		if( $elem.data('showFixed') == false )
		{
			$msg_elem.css({"top":elPos.setting_top, "left":elPos.setting_left, "position":position}).show();
			tippedOffMsgElemPos($msg_elem, elPos)
		}
		else
		{
			tippedOffShowFixedEl(wait, elPos)
		}
	}

}
function tippedOffShowFixedEl(wait, elPos)
{
	$msg_fixed_elem=$('.tippedOff_msg_fixed');
	if(wait !== false)
	{
		tippedOff_timer = setTimeout(function()
		{
			if($('.tippedOff_msg').is(':visible')){$('.tippedOff_msg').hide();}
			if($('.tippedOff_msg_fixed').is(':visible')){$('.tippedOff_msg_fixed').hide().empty();}
			$msg_fixed_elem.css({"top":elPos.setting_top, "left":elPos.setting_left}).html($msg_elem.html()).show();
			tippedOffMsgElemPos($msg_fixed_elem, elPos)
		}, wait);
	}
	else
	{
		if($('.tippedOff_msg').is(':visible')){$('.tippedOff_msg').hide();}
		if($('.tippedOff_msg_fixed').is(':visible')){$('.tippedOff_msg_fixed').hide().empty();}
		$msg_fixed_elem.css({"top":elPos.setting_top, "left":elPos.setting_left}).html($msg_elem.html()).show();
		tippedOffMsgElemPos($msg_fixed_elem, elPos)
	}
}
function clearTippedOffTimer()
{
	clearTimeout(tippedOff_timer);
	tippedOff_timer = null;
}


function tippedOffHide(wait)
{
	if(tippedOff_timer !== null)
	{
		clearTippedOffTimer();
	}

	if(wait !== false)
	{
		tippedOff_timer = setTimeout(function()
		{
			$('.tippedOff_msg, .tippedOff_msg_fixed').hide();
			clearTippedOffTimer();
		}
		, wait);
	}
	else
	{
		$('.tippedOff_msg, .tippedOff_msg_fixed').hide();
	}
}

function tippedOffElemPosition(elem)
{
	var $elem = elem;
	var $msg_elem = $elem.next('.tippedOff_msg');
	var position = $elem.position();
	var offset = $elem.offset()

	var output = {};
	var win_height = $(window).height();
	var win_width = $(window).width();

	output.win_height = win_height;
	output.win_width = win_width;
	//hover trigger
	output.elem_width = $elem.width();
	output.elem_height = $elem.height();
	output.elem_left_top = position.left;//left top
	output.elem_left_bottom = position.top + output.elem_height;//left bottom
	output.elem_right_top = position.left + output.elem_width;//right top
	output.elem_right_bottom = position.top + output.elem_height;//right bottom
	output.elem_offset_left = offset.left;
	output.elem_offset_top = offset.top;
	output.elem_offset_right = offset.left + output.elem_width;
	output.elem_offset_bottom = offset.top + output.elem_height;
	//final position (default)
	if($elem.data('showFixed') == false)
	{
		output.setting_top = output.elem_left_bottom;
		output.setting_left = output.elem_left_top;
	}
	else
	{
		output.setting_top = output.elem_offset_bottom;
		output.setting_left = output.elem_offset_top;
	}
	return output;
}
function tippedOffMsgElemPos(msg_elem, elPos)
{
	$msg_elem = msg_elem;
	var msg_position = $msg_elem.position();
	var msg_offset = $msg_elem.offset();
	var msg_width = $msg_elem.width();
	var msg_height = $msg_elem.height();
	var msg_right_side = msg_offset.left + msg_width;
	var msg_bottom = msg_offset.top + msg_height;
	var final_top = elPos.setting_top;
	var final_left = elPos.setting_left;


/*
	if(msg_right_side > elPos.win_width)
	{
		final_left = elPos.setting_left-(msg_width-elPos.elem_width);
	}
	if(msg_bottom > elPos.win_height)
	{
		final_top = elPos.elem_offset_top-(msg_bottom+elPos.elem_height);
	}
*/
	$msg_elem.css({"top":final_top, "left":final_left}).show();
}

function tippedOffFindRefs(selector)
{
//tippedOffFindRefs('#selector') or tippedOffFindRefs('.selector')
//this will scan the UI for the selectors then store them in a temp Array for reuse
	tippedOff_refArr = new Array();
	$(selector).each(function()
	{
		tippedOff_refArr.push($(this).data('ref'));
	});
}
(function($)
{
    $(document).mousemove(function(event) {
        currentMousePos.x = event.clientX//event.pageX;
        currentMousePos.y = event.clientY//event.pageY;
    });
})(jQuery);
$(document).ready(function()
{
	$('.tipped_off').tippedOff();
});
