let limit = 40;
let alertTimer = null;
let timeoutBeforeSwitchOff = 5 * 60 * 1000; //5 Minutes before turn off

let debug = false;


Shelly.addEventHandler(
    function (event, ud) {
        // while we don't have better selectivity for event source
      if(event.info.event === 'power_update'){
          if(debug === true){
            print(event.info.event);
            print(event.info.apower);
          }      
          if(event.info.apower < limit){
            if(debug === true){
              print("Power below limit");
            }
            startTimer();
          }else{
            stopTimer();
          }
          
          //print(JSON.stringify(event, null, 4));
      }
    },
    null
);

function startTimer() {
    if(alertTimer === null){
      print("Start Timer");
      alertTimer = Timer.set(timeoutBeforeSwitchOff,
          false,
          function (ud) {
              print("Will turn off because of too less power consumed");
                      Shelly.call(
                          "switch.set",
                          { id: 0, on: false },
                          function (result, code, msg, ud) {
                          },
                          null
                      );
                      alertTimer = null;
          },
          null
      );
    }
}

function stopTimer() {
  if(alertTimer !== null){
    print("Stop Timer");
    Timer.clear(alertTimer);
    alertTimer = null;
  }
}
