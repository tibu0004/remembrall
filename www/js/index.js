// Local Notifications:
// https://www.npmjs.com/package/de.appplant.cordova.plugin.local-notification/v/0.8.5
// https://github.com/katzer/cordova-plugin-local-notifications/wiki - reference
// https://github.com/katzer/cordova-plugin-local-notifications - beware the ReadMe file. This is v0.9.0-beta

// Installation
// cordova plugin add de.appplant.cordova.plugin.local-notification

//Build (XCode 10 causes build issues for iOS so it needs the --buildFlag)
// cordova emulate ios --target="iPhone-8, 12.2" --buildFlag="-UseModernBuildSystem=0"

// Dialogs:
// https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-dialogs/index.html

//saved =[];
let app = {
  pages: null,

  init: function () {
    let isReady = (window.hasOwnProperty("cordova"))?'deviceready':'DOMContentLoaded';
    document.addEventListener(isReady, ()=> {
      
      //pages navigation
      app.pages = document.querySelectorAll('.page');
            app.pages[0].classList.add('active');

            //after save , same button navigate to 1 page
            let item = document.querySelectorAll(".btn");
            item.forEach( i => {
                i.addEventListener('click', app.navigate);
            });
       
      app.addListeners();
      
    });
  },
  addListeners: function () {
    //click and call addNote
    document.querySelector("#add-btn").addEventListener("click", app.addNote);
     
    cordova.plugins.notification.local.on("click", function (notification) {
      navigator.notification.alert("clicked: " + notification.id);
      //user has clicked on the popped up notification
      
    });
    cordova.plugins.notification.local.on("trigger", function (notification) {
      //added to the notification center on the date to trigger it.
      navigator.notification.alert( notification.title + "\n" + notification.text);
      let tri = notification.id;
      app.trigger(tri);
    });
    
  },

//navigate through pages
navigate: function(ev){
  ev.preventDefault();
  document.querySelector('.active').classList.remove('active');
  let target = ev.currentTarget.getAttribute('data-target');
  document.getElementById(target).classList.add('active');  
},

addNote: function (ev) {
  //let props = cordova.plugins.notification.local.getDefaults();
  /**
  * Notification Object Properties - use it as a reference later on
  * id * text * title * every * at * data * sound * badge
  */

  //creates the date 1 minute after
  let inOneMin = new Date();
  inOneMin.setMinutes(inOneMin.getMinutes() + 1);
  
 

  // let id = 0;
  // let Title = 0;
  // let At = 0;
  // let Text = 0;
  
  //create the get input data
  //create Id in milliseconds
  let Id = new Date().getMilliseconds();
  //get html element value
  let Title = document.getElementById('txt').value;
  
  //get html date/hour value
  let At = document.getElementById('time').value;
  console.log(At);

  let novo = new Date(At);
  console.log(novo);
  let hour = novo.getHours();
  console.log(hour);
  let nHour = (hour + 4);
  console.log(nHour);
  novo.setHours(nHour);
  console.log(novo);
  //let dataH = luxon.At;
  //console.log(dataH);
  
  //let m = dataH.get('month');
  //console.log(m);

  
 
  //let m = At.get('month');
//At.toLocalString(DateTime.DATETIME_HUGE);

 //console.log(m);
//console.log(today.toISO() );
  
  //create a description
  let Text = document.getElementById('desc').value;
  
  //array notification
  let noteOptions = {
    id: Id,
    title: Title,
    text: Text,
    at: novo,
    data: {
      prop: "prop value",
      num: 42
    }
  };
  cordova.plugins.notification.local.schedule(noteOptions, function(){
    app.buildList();
  });
},

  //cordova.plugins.notification.local.cancel(id, function () {
        // will get rid of notification id 1 if it has NOT been triggered or added to the notification center
        // cancelAll() will get rid of all of them   
  //});
  
  //cordova.plugins.notification.local.clear(id, function () {
        // will dismiss a notification that has been triggered or added to notification center
  //});

  //cordova.plugins.notification.local.getTriggeredIds(noteOptions, function (present) {
   //alert("got");
        // navigator.notification.alert(present ? "present" : "not found");
        // can also call isTriggered() or isScheduled()
        // getAllIds(), getScheduledIds() and getTriggeredIds() will give you an array of ids
        // get(), getAll(), getScheduled() and getTriggered() will get the notification based on an id
 // });
//}, 

buildList: function(){
  while(document.querySelector(".note-list").firstChild){
    document.querySelector(".note-list").removeChild(document.querySelector(".note-list").firstChild);
    }
  cordova.plugins.notification.local.getAll(function(noteOptions){
      noteOptions.forEach(note => {
        let li = document.createElement("li");
        let h2 = document.createElement("h2");
        let h3 = document.createElement("h3");
        let button = document.createElement("button"); 
      
        li.classList.add("note-item");
        li.setAttribute("id", note.id);
      
        h2.textContent = note.title;
        li.appendChild(h2);
      
        h3.textContent = note.text;
        li.appendChild(h3);
  
        button.textContent = "delete";
        button.classList.add("del-btn");
        button.addEventListener("click", function(){
          app.delete(li);
        });
        li.appendChild(button);
      
        document.querySelector(".note-list").appendChild(li);
        })
        
        //navigator.notification.alert("Added notification id " + id);
      });    
},


trigger: function(tri){
  console.log(tri);
  cordova.plugins.notification.local.cancel(tri, function() {
    app.buildList(); 
  });
  
},

delete: function(ev){
let del = cordova.plugins.notification.local.cancel(ev.id, function() {
  console.log(ev.id);
       alert("this item was deleted");
       app.buildList(); 
     });
       
}
};
app.init();