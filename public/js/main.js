$(document).ready(function(){
  
  
  //------------------------------------//
  //Navbar//
  //------------------------------------//
    	var menu = $('.navbar');
    	$(window).bind('scroll', function(e){
    		if($(window).scrollTop() > 140){
    			if(!menu.hasClass('open')){
    				menu.addClass('open');
    			}
    		}else{
    			if(menu.hasClass('open')){
    				menu.removeClass('open');
    			}
    		}
    	});
  
  
 
  
  //------------------------------------//
  //Wow Animation//
  //------------------------------------// 
  wow = new WOW(
        {
          boxClass:     'wow',      // animated element css class (default is wow)
          animateClass: 'animated', // animation css class (default is animated)
          offset:       0,          // distance to the element when triggering the animation (default is 0)
          mobile:       false        // trigger animations on mobile devices (true is default)
        }
      );
      wow.init();

  updateStatusCallback = function(response) {
    console.log(response);
    $.ajax({
      url: '/facebookAuth?access_token='+ response.authResponse.accessToken,
      data: response.authResponse,
      type: 'POST',
      dataType: 'json',
      success: function(res) {
        console.log(res)
        $('#loginWrp span.name').html('<strong>' + res.name + '</strong>');
        $('.not-login').addClass('hidden');
        $('.logined').removeClass('hidden');
      }
    })
  }
  var loginStatus;

  login = function() {
      if (loginStatus != null && loginStatus.status === "connected" && !loginStatus.isExpired()) {
          updateStatusCallback(loginStatus);
          return;
      }

      FB.login(updateStatusCallback);
  }

  $.getScript('//connect.facebook.net/en_US/sdk.js', function() {
    FB.init({
      appId      : '104482710085297',
      cookie     : true,
      xfbml      : true,
      version    : 'v2.8'
    });
    FB.AppEvents.logPageView();  
    FB.getLoginStatus(function(data) {
      var startTime = new Date().getTime();
      loginStatus = data;
      loginStatus.isExpired = function() {
          var crrTime = new Date().getTime();
          if (crrTime - startTime < loginStatus.authResponse.expiresIn * 1000) {
              return false;
          }
          return true;
      }

      if (loginStatus != null && loginStatus.status === "connected" && !loginStatus.isExpired()) {
          updateStatusCallback(loginStatus);
          $('.not-login').addClass('hidden');
          $('.logined').removeClass('hidden');
          return;
      } else {
        $('.logined').addClass('hidden');
        $('.not-login').removeClass('hidden');
      }

    });
  });


  $('.facebookLogin').click(function(){
    login();
  });

  $('.signout').click(function(){
    $('.logined').addClass('hidden');
    $('.not-login').removeClass('hidden');
    FB.logout(function(){
      
    });
    
  });

});
