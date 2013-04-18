// $.tippedOff();
// In its current for, this is just a very raw method of displaying a tooltip like message.
// Other than that I have nothing else to say about it currently.
//
// Copyright (c) 2013 Christopher Hacia git@chrishacia.com
// Website: http://www.chrishacia.com/scripts/tippedOff
// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
// Author: Christopher Hacia
// Version: 0.9
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
var tippedOff_obj = {"status": "SUCCESS","code": null,"message": null,"data": {"help_text": {"deletion_policy": "Allow delete from Zetta when deleted locally:<br><br>This option allows local deletions to be propagated to your ZettaMirror volume; if an item is detected to have been deleted, it will also be deleted from Zetta, and held in snapshots for the duration of your retention policy. While the data is held in snapshots it is still fully recoverable by browsing to the appropriate snapshot date. Once the retention period has elapsed the data will be fully deleted from your ZettaMirror volume.<br><br>Disabling this option puts the system into archive mode where any data deleted locally will live on ZettaMirror in primary storage forever. Your retention policy will function solely as file versioning where changes in data will be the only item captured in snapshots.<br><br>","sql_backup_path": "Using Zetta for backing up SQL Server requires temporarily backing it up to a local destination in your environment. The plugin writes a full backup of the SQL instance to disk so adequate space is needed to prevent backup failure. The plugin will delete the backup after sync completion so there is no need to provision more space than is required for a single full backup.<br><br>Although we generate full backups each time, we only move the incremental changes through the use of our sub-file change detection technology.<br><br>","sql_backup_default": "Check this box if the instance of SQL is the default instance name.<br><br>You can verify the instance name by opening services and checking what appears in brackets after the 'SQL Server' service. If the name in brackets is MSSQLSERVER your instance is the default name, anything else is a named instance and will have to be itemized in the Non-Default Instance configuration of ZettaMirror.<br><br>","sql_backup_local_instance": "If your instance of SQL is a non-default name please list out the names used with semicolon delimitation for multiple names.<br><br>You can verify the instance name by opening services and checking what appears in brackets after the 'SQL Server' service. If the name in brackets is MSSQLSERVER your instance is the default name, if the name is anything else your instance is Non-Default and the names must be listed here.","systemstate_backup_path": "Using Zetta for backing up system state requires temporarily backing it up to a local destination in your environment. Enter a target destination for the system state backup to be written to. A system state backup is generally between 10-20GB so it is important to provision adequate space to avoid backup failure. The plugin will ensure that no more than one system state backup is stored simultaneously on the local machine.<br><br>","invalid_key": null}},"actions": null};
var tippedOff_timer = null;
(function($)
{
	$.fn.tippedOff = function(settings)
	{
		var config = $.extend({
			'top':0,
			'left':0,
			'width':'550px',
			'height':'200px',
			'styleClass':'round_edges blue_border',
			'wait':1300,
			'closeWait':1000
		}, settings);

		//var $elem = $(selector);

		return this.each(function()
		{
			$this = $(this);
			$this.addClass('tippedOff_hover');
			$this.attr('data-wait', config.wait);
			$this.attr('data-cwait', config.closeWait);
			$this.attr('data-offsetLeft', config.left);
			$this.attr('data-offsetTop', config.top);
			var tippedHTML = '';
				tippedHTML += '<div class="tippedOff_msg '+config.styleClass+'" style="height:'+config.height+';width:'+config.width+';">';

			if($this.data('ref') == null || $this.data('ref') == undefined || $this.data('ref') == '')
			{
				tippedHTML += 'Message Reference ID Missing or not Found.';
			}
			else
			{
				if(tippedOff_obj.status == "SUCCESS")
				{
					var help_obj = tippedOff_obj.data.help_text;
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

/*
			$this
				.mouseenter(function(){tippedOffShow($this);})
				.mouseleave(function(){tippedOffHide($this.data('cwait'));})
				.click(function(e)
				{
					e.stopImmediatePropagation();
					tippedOff_timer = setTimeout(function()
					{
						tippedOffShow($this);
					}, $(this).data('wait'));
				});
*/
		});
	};
})(jQuery);



$('.tippedOff_hover').live({
				'mouseenter':function(){tippedOffShow($(this), $(this).data('wait'));},
				'mouseleave':function(){tippedOffHide($(this).data('cwait'));},
				'click':function(e){e.stopImmediatePropagation();tippedOffShow($(this), false);}
});
$('.tippedOff_msg').live({
				'mouseenter':function(){clearTippedOffTimer();},
				'mouseleave':function(){tippedOffHide($(this).prev('span').data('cwait'));}
});
function tippedOffShow(elem, wait)
{
	$elem = elem;
	$msg_elem = $elem.next('.tippedOff_msg');
	var elPos = tippedOffElemPosition($elem);
	var offsetX = $elem.data('offsetLeft');
	var offsetY = $elem.data('offsetTop');

	elPos.setting_left = elPos.setting_left+offsetX;
	elPos.setting_top = elPos.setting_top+offsetY;

	if(tippedOff_timer !== null)
	{
		clearTippedOffTimer();
	}
	if(wait !== false)
	{
		tippedOff_timer = setTimeout(function()
		{
			if($('.tippedOff_msg').is(':visible')){$('.tippedOff_msg').hide();}
			$msg_elem.css({"top":elPos.setting_top, "left":elPos.setting_left}).show();
			tippedOffMsgElemPos($msg_elem, elPos)
		}, wait);
	}
	else
	{
		if($('.tippedOff_msg').is(':visible')){$('.tippedOff_msg').hide();}
		$msg_elem.css({"top":elPos.setting_top, "left":elPos.setting_left}).show();
		tippedOffMsgElemPos($msg_elem, elPos)
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
			$('.tippedOff_msg').hide();
			clearTippedOffTimer();
		}
		, wait);
	}
	else
	{
		$('.tippedOff_msg').hide();
	}
}

function tippedOffElemPosition(elem)
{
	var $elem = elem;
	var $msg_elem = $elem.next('.tippedOff_msg');
	var position = $elem.position();
	var offset = $elem.offset();

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
	//final position (default)
	output.setting_top = output.elem_left_bottom;
	output.setting_left = output.elem_left_top;

/*
	debugStr = '';
	debugStr += 'ref = '+$elem.data('ref')+'<br>';
	debugStr += 'win_height = '+win_height+'<br>';
	debugStr += 'win_width = '+win_width+'<br>';
	debugStr += 'output.elem_width = '+output.elem_width+'<br>';
	debugStr += 'output.elem_height = '+output.elem_height+'<br>';
	debugStr += 'output.elem_left_top = '+output.elem_left_top+'<br>';
	debugStr += 'output.elem_left_bottom = '+output.elem_left_bottom+'<br>';
	debugStr += 'output.elem_right_top = '+output.elem_right_top+'<br>';
	debugStr += 'output.elem_right_bottom = '+output.elem_right_bottom+'<br>';
	debugStr += 'output.elem_offset_left = '+output.elem_offset_left+'<br>';
	debugStr += 'output.elem_offset_top = '+output.elem_offset_top+'<br>';
	debugStr += 'output.setting_top = '+output.setting_top+'<br>';
	debugStr += 'output.setting_left = '+output.setting_left+'<br><br>';
	$('#debug').html(debugStr);
*/

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
	//$('#debug').append('<br><br>msg_right_side = '+msg_right_side+'<br>msg_bottom = '+msg_bottom+'<br>elPos.elem_right_top ='+elPos.elem_right_top);

	var final_top = elPos.setting_top;
	var final_left = elPos.setting_left;

	if(msg_right_side > elPos.win_width)
	{
		final_left = elPos.setting_left-(msg_width-elPos.elem_width);
	}
	if(msg_bottom > elPos.win_height)
	{
		final_top = elPos.elem_offset_top-(msg_bottom+elPos.elem_height);
	}
	//$('#debug').append('<br>final_left = '+final_left);
	$msg_elem.css({"top":final_top, "left":final_left}).show();
}
$(document).ready(function()
{

	$('.tipped_off').tippedOff();

});