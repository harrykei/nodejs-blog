/**
 * http://usejsdoc.org/
 */
var modalAnimateTime = 300;
var msgAnimateTime = 150;
var msgShowTime = 2000;

var login_btn = $('<a></a>').attr({
	id: 'login_btn',
	href:'#',
	role: 'button',
	style: 'margin: 0 5px;',
	'data-toggle': 'modal',
	'data-target': '#login-modal'
}).addClass('btn btn-success btn-sm').text('Login');
var signup_btn = $('<a></a>').attr({
	id: 'signup_btn',
	href:'#',
	role: 'button',
	style: 'margin: 0 5px;',
	'data-toggle': 'modal',
	'data-target': '#signup-modal'
}).addClass('btn btn-success btn-sm').text('Signup');
var logout_btn = $('<a></a>').attr({
	id: 'logout_btn',
	href:'#',
	role: 'button',
	style: 'margin: 0 5px;',
	'data-toggle': 'modal',
	'data-target': '#logout-modal'
}).addClass('btn btn-danger btn-sm').text('Logout');

$("form").submit(function () {
    switch(this.id) {
        case "login-form":
            var lg_username=$('#login_username').val();
            var lg_password=$('#login_password').val();
            if (lg_username && lg_password) {
            	$.ajax({
            		url: '/users/login',
            		type: 'POST',
            		data: $(this).serialize(),
            		success: function(result) {
            			if (result.success) {                				
            				$('#login-modal').modal('hide');
            				window.location = '/b';
            			} else {
            				toastr.error(result.msg, 'Error!');
            			}
            		}
            	});
            } else {
            	msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), "error", "glyphicon-remove", "Login error");
            }
            return false;
        case "signup-form":
            $.ajax({
            	url: '/users',
            	type: 'POST',
            	data: $(this).serialize(),
            	success: function(result) {
            		if (result.success) {
            			$('#signup-modal').modal('hide');
            			window.location = '/b';
            		}
            		else {
            			toastr.error(result.msg, 'Error!');
            		}
            	}
            });
            return false;
        case "logout-form":
        	$.ajax({
        		url: '/users/login',
        		type: 'DELETE',
        		success: function(result) {
        			if (result.success) {
        				$('#logout-modal').modal('hide');
        				window.location = '/b';
        			} else
        				toastr.error(result.msg, 'Error!');
        		}
        	});
        	return false;
        default:
            return false;
    }
    return false;
});

function checkUserSession() {
	$.ajax({
		url: '/users/login',
		type: 'POST',
		success: function(data) {
			if (data.success)
				loggedInBtn();
			else
				loggedOutBtn();
		}
	});
}

$('#login_btn').click(function () {
	var username = $.cookie('username');
	if (username) {
		$('#login_username').val(username);
		$('#remember_chk').prop('checked', true);
	}
	else {
		$('#login_username').val('');
		$('#remember_chk').prop('checked', false);
	}
});

$('#remember_chk').click(function () {
	if ($('#remember_chk').is(':checked')) {
		console.log('remember checked');
		$.cookie('username',$('#login_username').val());
	}
	else {
		console.log('remember unchecked');
		$.removeCookie('username');
	}
});

function initAuthBtn() {
	$('#login_btn').remove();
	$('#signup_btn').remove();
	$('#logout_btn').remove();
}

function loggedInBtn() {
	initAuthBtn();
	$('#user_auth').append(logout_btn);
}

function loggedOutBtn() {
	initAuthBtn();
	$('#user_auth').append(login_btn);
	$('#user_auth').append(signup_btn);
}

function showErrorMsg(msg) {
	toastr.error(msg, {timeOut: 5000})
}