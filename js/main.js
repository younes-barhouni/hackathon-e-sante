(function () {

    var jqueryObj;
    $(document).ready(function () {
        // As soon as the DOM is ready, make the example invisible
        jqueryObj = $('p, h1, h2, a');
        jqueryObj.css('visibility', 'hidden');
    });
	$(document).ready(function(e) {
		try {
			Typekit.load({
				active: function () {
					// As soon as the fonts are active, fade in the example
					// Don't fade in browsers that don't do proper opacity, like IE
					if (jQuery.support.opacity) {
						jqueryObj.css('visibility', 'visible').hide().fadeIn();
					} else {
						jqueryObj.css('visibility', 'visible');
					}
				},
				inactive: function () {
					// If the fonts are inactive, just show the example
					// You can apply fallback styles using the wf-inactive class in your CSS
					jqueryObj.css('visibility', 'visible');
				}
			})
		} catch (e) { }
	});
	
	var footerHeight = $(".footer").height();
	
	$(window).scroll(function() {
       if($(window).scrollTop() + $(window).height() > getDocHeight() - footerHeight) {
		   $(window).unbind('scroll');
		   // _kmq.push(['record', 'Reached Bottom']);  
       }
   });
   
   $(".store").click(function()
   {
	   // _kmq.push(['record', 'Clicked Pre-Order: Total']);  
   });
	
})();

function getDocHeight() {
    var D = document;
    return Math.max(
        Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
        Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
        Math.max(D.body.clientHeight, D.documentElement.clientHeight)
    );
}
