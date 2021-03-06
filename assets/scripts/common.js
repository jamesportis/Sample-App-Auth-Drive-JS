var common = function ($) {
	'use strict';

	var commonObj = {

		/**
		 * Loads ajax loader whenever we want
		 * @param elem - any jquery selector
		 */
		loadAjaxLogger: function (elem) {
			$(elem).load("plugins/ajaxlogger/loggers.html");
		},

		/**
		 * UI stuff
		 */
		setUIFunctionality: function () {

			//set listener to tooltip hover
			$('.with_hover').hover(
				function () {
					$(this).next('.stooltip').find('span').show();
				},
				function () {
					$(this).next('.stooltip').find('span').hide();
				}
			);

			//set listener to input focus to remove errors
			$('#asset-form').on('keyup', '.error', function () {
				if ($(this).val().length > 0) {
					$(this).next('.field_error').addClass('hidden');
				}
			});


			//checkboxes
			//$('.chk')

		},
		/**
		 * Validates input and sets proper errors
		 */
		validateInput: function (elem) {
			if (elem.val().length) {
				$('.error').removeClass('error');
				$('.error').next('.field_error').addClass('hidden');
				return true;
			} else {
				elem.addClass('error');
				elem.next('.field_error').removeClass('hidden');
				return false;
			}

		},

		/**
		 *  Adjsut string length to desired length
		 */
		maxLength: function(input, desiredLength, hidePoints) {
			if (input.length <= desiredLength) {
				return input;
			} else {
				return input.substring(0, desiredLength) + (!hidePoints ? '...' : '');
			}
		}
	}

	return commonObj;

}(jQuery);