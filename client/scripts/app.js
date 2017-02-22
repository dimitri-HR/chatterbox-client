// YOUR CODE HERE:

// http://parse.hrr.hackreactor.com/chatterbox/classes/messages

// $("button").click(function(){
//     $.ajax({url: "demo_test.txt", success: function(result){
//         $("#div1").html(result);
//     }});
// });

var app = {

  server: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages/',
  username: window.location.search.slice(10),
  roomname: 'Dimitri',
  lastMessageId: 0,
  messages: [],
  friends: {},


  init: function() {
    app.$chats = $('#chats');
    app.$roomSelect = $('#roomSelect');
    app.$send = $('#send');

    // Add listeners
    app.$chats.on('click', '.username', app.handleUsernameClick);
    app.$send.on('submit', app.handleSubmit);
    app.$roomSelect.on('change', app.handleRoomChange);

    $('#clearMessages').on('click', app.clearMessages);
    $('#refresh').on('click', app.fetch);



  //   $('#roomList').on('change', function(e) {
  // // console.log($('#roomList').prop('selectedIndex'));
  //     // e.preventDefault();
  //     // console.log($('#addMessage'));
  //     var message = $('#roomList').val();
  //     console.log('message', message);
  //     app.onRoomChange(message);
  //   });

    $('#newMessage').on('click', function(e) {
      e.preventDefault();
      console.log('adding message');
      // console.log($('#addMessage'));
      var message = $('#addMessage').val();
      app.onNewMessage(message);
    });

    app.fetch();


    // setInterval(function() {
    //   app.fetch();
    // }, 5000);
  },

  // $("#roomSelect").on("change", function() {
  //   var selectedVal = $(this).find(':selected').val();
  //   //do something here or call onRoomChange
  // }​​​​);

  // addRoom: function(room) {
  //   $('#roomSelect').append('<option>' + app.escapeHTML(room) + '</option>');
  // },

  renderMessages: function (messages) {
    app.clearMessages();

    var _template = `<div><div class="twt">
    <div class="twt__header">
      <span class="twt__fullname username"><a href=""></a></span>
      <span class="twt__user"></span>
      <span class="twt__timestamp"></span>
    </div>
    <div class="twt__message"></div>
    <div class="twt__footer"></div>
    </div></div>`;

    $.each(messages, function(i, message) {
      // var usernameEsc = app.escapeHTML(message.username);
      // var textEsc = app.escapeHTML(message.text);
      var $newMessage = $(_template);

      // $newMessage.find('.twt__fullname a').text(message.username);
      $newMessage.find('.twt__fullname a').text(message.username).attr('data-roomname', message.roomname).attr('data-username', message.username);
      $newMessage.find('.twt__user').text('@' + message.username);
      $newMessage.find('.twt__timestamp').text(' ' + moment(message.createdAt).fromNow());
      $newMessage.find('.twt__message').text(message.text);
      $newMessage.find('.twt__footer').text('Room: ' + message.roomname);

      // Add the friend class
      if (app.friends[message.username] === true) {
        $('.username').addClass('friend');
      }

      app.$chats.append($newMessage);
    });
  },

  renderRoomList: function (data) {
    app.$roomSelect.html('<option value="new_room">Create New Room</option>');
    console.log(app.$roomSelect);
    var roomNames = [];
    $.each(data, function(i, room) {
      // var roomnameEsc = app.escapeHTML(message.roomname);
      roomNames.push(room.roomname);
    });
    var uniqueRooms = _.uniq(roomNames);

    $.each(uniqueRooms, function(i, room) {
      //$( '#roomSelect' ).empty();
      var $room = $('<option/>');
      $room.text(room).appendTo(app.$roomSelect);
      // $('#roomSelect').append('<option>' + room + '</option>');
    });
  },

  onNewMessage: function(text) {
    var message = {
      username: app.username,
      text: text,
      roomname: app.$roomSelect.val()
    };
    console.log(message);
    app.send(message);
  },

  fetch: function() {
    return $.ajax({
      url: app.server,
      type: 'GET',
      data: { order: '-createdAt' },
      contentType: 'application/json',

      success: function(data) {
        console.log(data);
        // If nothing received from the server
        if (!data.results || !data.results.length) {
          return;
        }
        // store messages
        app.messages = data.results;

        var mostRecentMessage = app.messages[app.messages.length - 1];
        // Update DOM only if we have new messages
        if (mostRecentMessage.objectId !== app.lastMessageId) {
          app.renderMessages(app.messages);
          app.renderRoomList(app.messages);
        }

        app.lastMessageId = mostRecentMessage.objectId;
      },
      error: function (data) {
        console.error('chatterbox: Failed to retrieve message', data);
      }
    });
  },

  send: function(message) {
    return $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',

      success: function(data) {
        console.log('Message posted', data);
        app.fetch();
      },

      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  handleUsernameClick: function(event) {
    // Get username from data attribute
    var username = $(event.target).data('username');



    if (username !== undefined) {
      // Toggle friend
      app.friends[username] = !app.friends[username];

      $('.username').each(function () {
        if (this.innerText === username) {
          $(this).toggleClass('friend');
        }
      });

      // // Escape the username in case it contains a quote
      // var selector = '[data-username="' + username.replace(/"/g, '\\\"') + '"]';
      //
      // // Add 'friend' CSS class to all of that user's messages
      // var $usernames = $(selector).toggleClass('friend');
    }
  },

  handleRoomChange: function(e) {

    // var selectIndex = app.$roomSelect.prop('selectedIndex');
    // // New room is always the first option
    // if (selectIndex === 0) {
    //   var roomname = prompt('Enter room name');
    //   if (roomname) {
    //     // Set as the current room
    //     app.roomname = roomname;
    //
    //     // Add the room to the menu
    //     app.renderRoom(roomname);
    //
    //     // Select the menu option
    //     app.$roomSelect.val(roomname);
    //   }
    // } else {
    //   app.startSpinner();
    //   // Store as undefined for empty names
    //   app.roomname = app.$roomSelect.val();
    // }
    // // Rerender messages
    // app.renderMessages(app.messages);


    var selectedRoom = app.$roomSelect.val();

    var roomMessages = app.messages.filter(function(message) {
      return message.roomname === selectedRoom;
    });
    // change messages to show room selection only
    // app.renderRoomList(roomMessages);
    app.renderMessages(roomMessages);
  },

  clearMessages: function() {
    app.$chats.empty();
  }

  // renderMessage: function(message) {
  //   $('#chats').append('<div>' + app.escapeHTML(message) + '<br></div>');
  // },

  // renderRoom: function(room) {
  //   $('#roomSelect').append('<option>' + app.escapeHTML(room) + '</option>');
  // },



  // jQuery naturally escapes HTML when useing .text()
  // so these functions are not used here
  // escapeHTML: function (str) {
  //   var div = document.createElement('div');
  //   div.appendChild(document.createTextNode(str));
  //   return div.innerHTML;
  // }

  // Escape HTML - not used
  // escapeHTML: function(string) {
  //   if (!string) {return; }
  //   return string.replace(/[&<>"'=\/]/g, '');
  // }

};

//console.log('app.message', app.message);

// app.send(app.message);

app.init();


$(document).ready(function() {



  // $('#btnAddRoom').on('click', function(e) {
  //   e.preventDefault();
  //   var roomName = $('#textAddRoom').val();
  //   app.addRoom(roomName);
  //   $('#textAddRoom').val('');
  // });



// ***************************
  // $('#btn__newtweet').on('click', function(e) {
  //   e.preventDefault();
  //   var username = $('#username').val();
  //   var message = $('#message-text').val();
  //
  //   writeTweet(username, message);
  //   reload();
  // });
  //
  //
  // $('.btn__refresh').on('click', function(e) {
  //   e.preventDefault();
  //   reload();
  // });

  // var _template = `<div><div class="twt">
  // <div class="twt__header">
  //   <span class="twt__fullname"><a href=""></a></span>
  //   <span class="twt__user"></span>
  //   <span class="twt__timestamp"></span>
  // </div>
  // <div class="twt__message"></div>
  // <div class="twt__footer"></div>
  // </div></div>`;
  //
  // var reload = function() {
  //   var result = [];
  //   var index = streams.home.length - 1;
  //
  //   while(index >= streams.home.length - 10){
  //     var tweet = streams.home[index];
  //
  //     var $newTweet = $(_template);
  //
  //     $newTweet.find('.twt__fullname a').text(tweet.user);
  //     $newTweet.find('.twt__user').text('@' + tweet.user);
  //     $newTweet.find('.twt__timestamp').text(' ' + moment(tweet.created_at).fromNow());
  //     $newTweet.find('.twt__message').text(tweet.message);
  //
  //     result.push($newTweet.html().trim())
  //     index -= 1;
  //   }
  //
  //   var $newTweetHtml = $(result.join(''));
  //   $('.alltweets').html('');
  //   $newTweetHtml.appendTo('.alltweets');
  //
  //   $('.twt__timeline').hide();
  //
  //   $('a').on('click', function(event) {
  //     event.preventDefault();
  //     var user = $(this).text();
  //
  //     getUserTimeline(user);
  //   });
  //
  //   var getUserTimeline = function(user) {
  //     var _timeline = `<div><div class="twt">
  //     <div class="twt__header">
  //     <span class="twt__user"></span>
  //     <span class="twt__timestamp"></span>
  //     </div>
  //     <div class="twt__message"></div>
  //     </div></div>`;
  //
  //     var result = [];
  //     var userArr = streams.users[user];
  //
  //     for (var i = userArr.length - 1; i >= 0; i--) {
  //       var timeline = userArr[i];
  //       var $timeline = $(_timeline);
  //
  //       $timeline.find('.twt__user').text('@' + timeline.user);
  //       $timeline.find('.twt__timestamp').text(' ' + moment(timeline.created_at).fromNow());
  //       // $timeline.find('.twt__timestamp').text(' ' + timeline.created_at.toUTCString());
  //       $timeline.find('.twt__message').text(timeline.message);
  //
  //       result.push($timeline.html().trim())
  //       index -= 1;
  //     }
  //     $('.twt__timeline').html('').show();
  //
  //     var $timelineHtml = $(result.join(''));
  //     $timelineHtml.appendTo('.twt__timeline');
  //   }
  // }

});
