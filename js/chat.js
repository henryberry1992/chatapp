// Initialize global user 
// (a good idea to store the information you need
// when sending messages here)
$(document).ready(function(){
	CURRENT_USER_ID=localStorage.getItem('userID');
	CURRENT_USER=localStorage.getItem('username');
	login();
	getMessages();
	Teemer();

});
var CURRENT_USER = null;
var CURRENT_USER_ID= null;
var userurl="http://chat-app.brainstation.io/users";
var msgurl="http://chat-app.brainstation.io/messages";
var loginurl="http://chat-app.brainstation.io/users/login";
var logouturl="http://chat-app.brainstation.io/users/logout";

// sendMessage() sends a message to the API
function sendMessage() 
{
	$('#typebox').submit(function(event)
	{	
		CURRENT_USER_ID=localStorage.getItem('userID');
		event.preventDefault();	
		var messageVal=$('#inputmsg').val();

		$.ajax({
			url:msgurl,	
			type:'POST',
			xhrFields: {withCredentials:true},
			data:
			{
				userID:CURRENT_USER_ID,
				message:messageVal	
			},
			success:function(data)
			{
				console.log("Message sent");
				getMessages();
				$('#typebox')[0].reset();

			},
			error:function(data)
			{
				error(data, "Failure");
			}
		});
	});
}

// getMessages() gets all messages from the API.
// we can use diff() to get only the new ones.
function getMessages() 
{
	$.ajax({
		url:msgurl,
		type:'GET',
		xhrFields: { withCredentials:true },
		data:
		{
		},
		success: function(data)
		{
			$('#msgscreen').html('');
			for(var i=0; i<data.length; i++)
			{
				var usr=data[i].username;
				var msg=data[i].message;
				$('#msgscreen').append('<li>'+usr+': '+ msg+' <br><hr></li>');
			}
		},
		error:function(data)
		{
			console.log(data);
		}
	});
}

function Teemer()
{
	setInterval(function()
	{
		getMessages()
	},2000);
}

// login() logs in a user by creating a session
function login()
{
	$('#signinform').submit(function(event)
	{
		event.preventDefault();
		var frm=$('#signinform');
		var username=$('#username').val();
		var password=$('#password').val();

		$.ajax
		({
			url:loginurl,
			type:'POST',
			xhrFields: { withCredentials:true },
			data:
			{
				username:username,
				password:password
			},
			success:function(data)
			{
				
				alert("Logged In.");
				CURRENT_USER=username;
				CURRENT_USER_ID=data.uid;
				localStorage.setItem('userID',CURRENT_USER_ID);
				localStorage.setItem('username', CURRENT_USER);
				localStorage.getItem('userID');
				localStorage.getItem('username');
				getMessages();
			},
			error:function(data)
			{
				alert("Either username or password doesn't match. Please try again.");
			}
		});
	});

}
function logOut()
{
	$.ajax({
		url:logouturl,
		type:"POST",
		xhrFields: { withCredentials:true },
		data:
		{

		},
		success:function(data)
		{
			alert("Successfully logged out.");
			CURRENT_USER=null;
			CURRENT_USER_ID=null;
		},
		error:function(data)
		{
			if(CURRENT_USER==null)
			{
				alert("Already logged out");
			}

		}
	});
}

// signup() creates an account that we can sign in with
function signUp() 
{
	$('#signup').submit(function(event)
		{
			event.preventDefault();
			var frm=$('#signupform');
			var username=$('#username').val();
			var password=$('#username').val();

			$.ajax({
				url: userurl,
				type:'POST',
				data:
				{
					username:username,
					password:password
				},
				xhrFields: { withCredentials:true },
				success: function(data)
				{
					alert("Successfully signed up!");
				},
				error: function(data)
				{
					alert("Username already taken. Please try again.");
				}
			});
		});
}


// HELPERS -------
// You can use these and modify them to fit your needs. 
// If you are going to use them, make sure you understand
// how they work!

// Helper - returns all elements in an array A, that are not in B
function diff(a, b) 
{
	var bIds = {}
	b.forEach(function(obj){
	    bIds[obj.id] = obj;
	});
	return a.filter(function(obj){
	    return !(obj.id in bIds);
	});
}

// Helper - scrolls to the bottom of the messages div
function scrollBottom(element, duration) 
{
	element.animate({ scrollTop: element[0].scrollHeight}, duration);
}

// Helper - turns JavaScript timestamp into something useful
function getReadableTime(stamp) 
{
	var time = new Date()
	time.setTime(stamp)
	return time.getMonth()+"/"+time.getDate()+" "+pad(time.getHours(),2)+":"+pad(time.getMinutes(),2);
}

// Helper - pads a number with zeros to a certain size. Useful for time values like 10:30.
function pad(num, size) 
{
    var s = num+"";
    while (s.length < size) s = s + "0";
    return s;
}

// Prints a useful error message to the console. Used when AJAX fails. A message can help us find the problem
function error(data, message) 
{
	console.log('Error '+message+': '+JSON.stringify(JSON.parse(data.responseText)))
}
