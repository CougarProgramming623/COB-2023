const { NetworkTables, NetworkTablesTypeInfos } = require('ntcore-ts-client');

console.log("Started renderer.js")

ipc.send('connect', "10.6.23.2"); // connect to wBot: 10.6.23.2 || FRC623(server): 192.168.254.227 || connect to saber: 10.6.24.2

// const COB = {
//     /*set: function(cobKey, value) {
//         NetworkTables.putValue(cobKey, value);
//     },
//     get: function(cobKey, def) {
//         return NetworkTables.getValue(cobKey, def);
//     },
//     // key: the key to use
//     // f: (newValue, isNew) => ...
//     setListener: function(key, f) {
//         NetworkTables.addKeyListener(key, (newKey, newValue, isNew) => f(newValue, isNew), true);
//     }*/
// }

const ntcore = NetworkTables.getInstanceByTeam(623);

function createTopic(string, NetworkTablesTypeInfo, string) {
  return new NetworkTablesTopic<T>(this._client, typeInfo, defaultValue);
};

// //const autoModeTopic = ntcore.createTopic<string>('/COB/autoMode', NetworkTablesTypeInfos.kString, 'No Auto');
// const autoModeTopic = ntcore.createTopic('/COB/autoMode', NetworkTablesTypeInfos.kString, "no auto");

// // Make us the publisher
// autoModeTopic.publish();

// // Set a new value, this will error if we aren't the publisher!
// autoModeTopic.setValue('PUSHINGGGGGGG');


ntcore.addRobotConnectionListener((con) => { console.log("connected", con) }, false);

const COB_KEY = {
    navXReset: "/COB/navXReset",
    robotAngle: "/COB/robotAngle",
    // flywheelRPM: "/COB/flywheelRPM",
    driveMode: "/COB/driveMode",
    matchTime: "/COB/matchTime",
    matchColor: "/FMSInfo/IsRedAlliance",
    ticks: "/COB/ticks",
    balanced: "/COB/balanced",
    pitchAngle: "/COB/pitchAngle",
    auto: "/COB/auto",
    armValue: "/COB/armValue",
    armAngle: "/COB/armAngle"
} // put all the keys here, and match the schema with the COB.h file in the codebase


const timerTopic = ntcore.createTopic('/COB/matchTime', NetworkTablesTypeInfos.kDouble, 0);
timerTopic.subscribe((value) => {
    let format = ":";
    if (Math.trunc(value - (Math.trunc(value / 60) * 60)) < 10) format = ":0";

    document.getElementById("timer").innerText = (Math.trunc(value / 60)).toString() + format + Math.trunc(value - (Math.trunc(value / 60) * 60)).toString(); //displays time in Min:Sec format

    let phase;
    if (value > 135) { 
        document.getElementById("timer").innerText = "0:" + (value - 135).toString();
        if ((value - 135) < 10) {
            document.getElementById("timer").innerText = "0:0" + (value - 135).toString();
        }
        phase = "Autonomous";
    } else if (value > 30) {
        phase = "Tele-Op";
    } else if (value <= 30) {
        phase = "Endgame";
    }

    document.getElementById("matchPhase").innerText = phase;
})

const ticksTopic = ntcore.createTopic('/COB/ticks', NetworkTablesTypeInfos.kDouble, 0);
ticksTopic.subscribe((value) => {
    document.getElementById("ticks").innerText = value;
})

const driveModeTopic = ntcore.createTopic('/COB/driveMode', NetworkTablesTypeInfos.kString, "Field Oriented");
driveModeTopic.subscribe((value) => {
    document.getElementById("driveMode").innerText = value; 
})

const robotAngleTopic = ntcore.createTopic('/COB/robotAngle', NetworkTablesTypeInfos.kDouble, 0);
robotAngleTopic.subscribe((value) => {
    document.getElementById("robotAngle").innerText = Math.trunc(value).toString() + "°" ; 
    document.getElementById("arrow").style.transform = 'rotate(' + value + 'deg)'; 
})

const armValueTopic = ntcore.createTopic('/COB/armValue', NetworkTablesTypeInfos.kDouble, 0);
armValueTopic.subscribe((value) => {
    document.getElementById("armvalue").innerText = Math.trunc(value).toString() + " CM";
})

const armAngleTopic = ntcore.createTopic('/COB/armAngle', NetworkTablesTypeInfos.kDouble, 0);
armAngleTopic.subscribe((value) => {
    document.getElementById("speedvalue").innerText = Math.trunc(value).toString() + "°";
})

let color = 0;
const balancedTopic = ntcore.createTopic('/COB/balanced', NetworkTablesTypeInfos.kBoolean, false);
balancedTopic.subscribe((value) => {
    if (value) {color = "invert(75%) sepia(30%) saturate(753%) hue-rotate(115deg) brightness(85%) contrast(89%)" }
    else {color = "invert(91%) sepia(5%) saturate(2394%) hue-rotate(184deg) brightness(101%) contrast(105%)"}
    document.getElementById("seesaw").style.filter = color;
})

const pitchAngleTopic = ntcore.createTopic('/COB/pitchAngle', NetworkTablesTypeInfos.kDouble, 0);
pitchAngleTopic.subscribe((value) => {
    document.getElementById("seesaw").style.transform = 'rotate(' + (value % 360) + 'deg)';
})

// const matchColorTopic = ntcore.createTopic('/COB/matchColor', NetworkTablesTypeInfos.kDouble, 0);
// matchColorTopic.subscribe((value) => {
//     if(value) {
//         document.getElementById("arrow").src = "./images/RedArrow.png"
//     } else {
//         document.getElementById("arrow").src = "./images/BlueArrow.png"
//     }
// })

// function initAll(){
//     COB.set(COB_KEY.navXReset, false);
//     COB.set(COB_KEY.robotAngle, 0);
//     COB.set(COB_KEY.flywheelRPM, 0);
//     COB.set(COB_KEY.driveMode, 'Robot Oriented');
//     COB.set(COB_KEY.matchTime, 150);
//     COB.set(COB_KEY.matchPhase, "Phase: Match Not Started");
//     COB.set(COB_KEY.ticks, 0);
//     COB.set(COB_KEY.balanced, false);
//     COB.set(COB_KEY.pitchAngle, 0);
//     COB.set(COB_KEY.auto, "NO AUTO SELECTED");
//     COB.set(COB_KEY.armValue, 0);
//     COB.set(COB_KEY.armAngle, 0);
// }

window.onload = () => { // this runs after the DOM has loaded
    /*document.getElementById("incr-foo").onclick = function() {
        COB.set(COB_KEY.foo, COB.get(COB_KEY.foo, 0) + 1);
    }*/

    //initAll();

    // NavX reset
    // document.getElementById("arrow").onclick = function() {
    //     COB.set(COB_KEY.robotAngle, 0.00);
    //     COB.set(COB_KEY.navXReset, true);
    // }

    const autoSelectorTopic = ntcore.createTopic('/COB/autos', NetworkTablesTypeInfos.kString, "NO AUTO");
    autoSelectorTopic.publish();
    document.getElementById("autos").onchange = function() {
        autoSelectorTopic.setValue(document.getElementById("autos").options[autos.selectedIndex].text);
    }
}