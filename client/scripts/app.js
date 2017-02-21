// YOUR CODE HERE:

// http://parse.hrr.hackreactor.com/chatterbox/classes/messages

//
// $("button").click(function(){
//     $.ajax({url: "demo_test.txt", success: function(result){
//         $("#div1").html(result);
//     }});
// });


// make ajax request to http://parse.hrr.hackreactor.com/chatterbox/classes/messages
// receive JSON obj back
// display messages on our page
  // create some HTML/CSS to display
  // escape them

// var server = 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages/';
// var SERVER = 'http://parse.hrr.hackreactor.com/chatterbox/classes/';

var app = {

  server: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages/',

  init: function() {
    this.fetch('messages/');
  },

  clearMessages: function() {
    $('#chats').empty();
  },

  renderMessage: function(message) {
    $('#chats').append('<div>' + message + '<br></div>');
  },

  renderRoom: function(room) {
    $('#roomSelect').append('<option>' + room + '</option>');
  },

  fetch: function() {

    return $.ajax({
      url: app.server,
      // url: 'http://parse.hrr.hackreactor.com/chatterbox/classes/',
      // to display one message
      // url: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages/sfksVfnHlQ',

      type: 'GET',
      data: { order: '-createdAt' },
      contentType: 'application/json',

      success: function(data) {
        console.log(data);
        $.each(data.results, function(i, message) {
          $('#chats').append('<div>' + message.username + '<br>' + message.text + '</div>');
        });

        var roomNames = [];
        $.each(data.results, function(i, room) {
          roomNames.push(room.roomname);
        });
        var uniqueRooms = _.uniq(roomNames);

        $.each(uniqueRooms, function(i, room) {
          $( '#roomSelect' ).empty();
          $('#roomSelect').append('<option>' + room + '</option>');
        });

      },

      error: function (data) {
        console.error('chatterbox: Failed to retrieve message', data);
      }
    });
  },

  message: {
    username: 'dimitri',
    text: 'test message',
    roomname: 'Dimitris room'
  },
  // message: {
  //   "username": 'dimitri',
  //   "text": "testmessage",
  //   "roomname": "Dimitrisroom"
  // },

  send: function(message) {
    return $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',

      success: function(data) {
        console.log(data);
        console.log('send worked!');
        // $.each(data.results, function(i, message) {
        //   $('#chats').append('<div>' + message.username + '<br>' + message.text + '</div>');
        // });

        // var roomNames = [];
        // $.each(data.results, function(i, room) {
        //   roomNames.push(room.roomname);
        // });
        // var uniqueroomSelect = _.uniq(roomNames);

        // $.each(uniqueroomSelect, function(i, room) {
        //   $('#roomSelect').append('<option>' + room + '</option>');
        // });

      },

      error: function (data) {
        console.error('chatterbox: Failed to retrieve message', data);
      }
    });
  }
};

//console.log('app.message', app.message);

// app.send(app.message);


// var x = app.init();
// console.log(x);

$(document).ready(function() {
  $('#refresh').on('click', function(e) {
    e.preventDefault();
    console.log('Refreshing');
    app.fetch('messages/');
  });

  $('#clearMessages').on('click', function(e) {
    e.preventDefault();
    console.log('Clearing messages');
    app.clearMessages();
  });

  $('#submit').on('click', function(e) {
    e.preventDefault();
    console.log('adding message');
    console.log($('#addMessage'));
    var message = $('#addMessage').val();
    app.renderMessage(message);
  });

  $('#btnAddRoom').on('click', function(e) {
    e.preventDefault();
    var roomName = $('#textAddRoom').val();
    app.renderRoom(roomName);
    $('#textAddRoom').val('');
  });

});



// [{  -> data.results
//   createdAt:"2017-02-08T21:36:01.219Z"
//   objectId:"W80qhTCsOS"
//   roomname:"lobby"
//   text:"first"
//   updatedAt:"2017-02-08T21:36:01.219Z"
//   username:"dan"
// },
//  {
//   createdAt:"2017-02-08T21:36:01.219Z"
//   objectId:"W80qhTCsOS"
//   roomname:"lobby"
//   text:"first"
//   updatedAt:"2017-02-08T21:36:01.219Z"
//   username:"dan"
// }]

  // $.ajax({
  //   type:
  //   url: "http://parse.hrr.hackreactor.com/chatterbox/classes/messages.txt",
  //   success: function(result){
  //     console.log(result);
  //   }
  // });
