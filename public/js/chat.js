var host = 'http://localhost:8080/';
var socket = io.connect(host);

$(function () {
    socket.on('client-info', function (data) {
        console.log(data);
        // Update socket to client
        $.ajax( {
            type: "GET",
            url: '/update-socket/' + data.socketId,
            success: function( response ) {
                console.log(response);
            }
        } );
    })

    socket.on('init', function (data) {
       if(data){
           var box = document.getElementById(data.conversationId);
           if (box === null) {
               var chatbox = openChatBox(data, 15);

               $('body').append(chatbox);
           } else {
               addMessage(data);
           }
       }
    });

    socket.on('message', function (data) {
        console.log(data);
        if (data.message) {
            var box = document.getElementById(data.conversation);
            if (box === null) {
                var chatbox = openChatBox(data, 15);

                $('body').append(chatbox);
            } else {
                addMessage(data);
            }
        } else {
            console.log("There is a problem:", data);
        }
    });
    $(".chat").niceScroll();
    $('.chat-users .user').on('click', function () {
        socket.emit('init', {
            userName: $(this).attr('username'),
            recipient: $(this).attr('recipient'),
        });
    });
});
// Functions
function openChatBox(data, distance) {
    console.log(data.message);

    var numBox = document.getElementsByClassName('chatbox-identifier').length;

    var r = (numBox > 0) ? (numBox * 300 + (numBox + 1) * distance) : distance;

    var html = '<div class="popup-box chat-popup popup-box-on chatbox-identifier" ' +
        'id="' + data.conversation + '" style="right: ' + r + 'px">' +
        '<div class="popup-head">' +
        '<div class="popup-head-left pull-left">' +
        '<img src="http://bootsnipp.com/img/avatars/bcf1c0d13e5500875fdd5a7e8ad9752ee16e7462.jpg" alt="iamgurdeeposahan"> ' +
        data.recipient +
        '</div>' +
        '<div class="popup-head-right pull-right">' +
        '<div class="btn-group">' +
        '<button class="chat-header-button" data-toggle="dropdown" type="button" aria-expanded="false">' +
        '<i class="fa fa-cog"></i>' +
        '</button>' +
        '<ul class="dropdown-menu pull-right" role="menu">' +
        '<li><a href="#">Media</a></li>' +
        '<li><a href="#">Block</a></li>' +
        '<li><a href="#">Clear Chat</a></li>' +
        '<li><a href="#">Email Chat</a></li>' +
        '</ul>' +
        '</div>' +
        '<button class="chat-header-button pull-right" id="closeChatBox" box-close="' + data.conversation + '" type="button" onclick="closeChatBox(this)">' +
        '<i class="fa fa-power-off"></i>' +
        '</button>' +
        '</div>' +
        '</div>' +
        '<div class="popup-messages" id="c-content-' + data.conversation + '">' +
        '<div class="direct-chat-messages">' +
        '<div class="chat-box-single-line">' +
        '<abbr class="timestamp">October 8th, 2015</abbr>' +
        '</div>' +
        '<div class="direct-chat-msg doted-border">' +
        '<div class="direct-chat-info clearfix">' +
        '<span class="direct-chat-name pull-left">' + data.userName + '</span>' +
        '</div>' +
        '<img class="direct-chat-img" alt="message user image" src="http://bootsnipp.com/img/avatars/bcf1c0d13e5500875fdd5a7e8ad9752ee16e7462.jpg"><div class="direct-chat-text"> ' +
        data.message +
        '</div>' +
        '<div class="direct-chat-info clearfix">' +
        '<span class="direct-chat-timestamp pull-right">3.36 PM</span>' +
        '</div><div class="direct-chat-info clearfix">' +
        '<span class="direct-chat-img-reply-small pull-left"></span>' +
        '<span class="direct-chat-reply-name">Singh</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="popup-messages-footer">' +
        '<textarea onkeypress="sendMessage(this, event)" class="status_message" placeholder="Type a message..." ' +
        'rows="10" cols="40" name="message" sender="'+data.userName+'" conversation="'+data.conversation+'"></textarea>' +
        '<div class="btn-footer">' +
        '<button class="bg_none">' +
        '<i class="fa fa-video-camera"></i>' +
        '</button>' +
        '<button class="bg_none">' +
        '<i class="fa fa-camera"></i>' +
        '</button>' +
        '<button class="bg_none">' +
        '<i class="fa fa-paperclip"></i>' +
        '</button>' +
        '<button class="bg_none pull-right"><i class="fa fa-thumbs-up"></i></button>' +
        '</div>' +
        '</div>' +
        '</div>';

    return html;
}

function addMessage(data) {
    console.log(data);
    var conversationContent = document.getElementById('c-content-' + data.conversation);
    console.log(conversationContent.getAttribute('class'));
    var htmlMessage = '<div class="direct-chat-messages">' +
        '<div class="chat-box-single-line">' +
        '<abbr class="timestamp">October 8th, 2015</abbr>' +
        '</div>' +
        '<div class="direct-chat-msg doted-border">' +
        '<div class="direct-chat-info clearfix">' +
        '<span class="direct-chat-name pull-left">' + data.sender + '</span>' +
        '</div>' +
        '<img class="direct-chat-img" alt="message user image" src="http://bootsnipp.com/img/avatars/bcf1c0d13e5500875fdd5a7e8ad9752ee16e7462.jpg">' +
        '<div class="direct-chat-text"> ' + data.message + '</div>' +
        '<div class="direct-chat-info clearfix">' +
        '<span class="direct-chat-timestamp pull-right">3.36 PM</span>' +
        '</div>' +
        '<div class="direct-chat-info clearfix">' +
        '<span class="direct-chat-img-reply-small pull-left"></span>' +
        '<span class="direct-chat-reply-name">Singh</span>' +
        '</div>' +
        '</div>' +
        '</div>';
    conversationContent.innerHTML += htmlMessage;
    // Scroll div
    conversationContent.scrollTop = conversationContent.scrollHeight;
}

function sendMessage(element, event) {
    if (event.keyCode == 13) {
        var message = element.value;
        console.log(message);
        socket.emit('send', {
            message: message,
            sender: element.getAttribute('sender'),
            conversation: element.getAttribute('conversation')
        });
        // Reset value textarea
        element.value = '';
    } else {

    }
}

function closeChatBox(element) {
    var boxClose = document.getElementById(element.getAttribute('box-close'));

    boxClose.remove();
}
