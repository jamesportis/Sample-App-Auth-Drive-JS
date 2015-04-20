
/**
 * Run when DOM is ready.
 * The spark object already exists in this point
 */
jQuery(function ($) {


	//First let's see if we have a valid access token
	if (spark.auth.isAccessTokenValid()) {
		$('#auth-iframe-wrapper').hide();
		$('.logged-out-container').hide();
		$('.logged-in-container').show();

	} else {
		// Set up the iframe for the login screen
		//and it's appropriate source
		$('.logged-out-container').show();
		$('.logged-in-container').hide();

		var div = $('<div id="auth-iframe-wrapper"><iframe style="width: 100%;border: 0;height: 500px;"></iframe></div>');
		$("body").append(div);
		$('#auth-iframe-wrapper iframe').attr('src', spark.auth.getAuthLoginUrl());
		$('.logged-in-container').hide();
	}
});
