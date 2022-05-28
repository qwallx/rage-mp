//Variables 
var struct = require('../struct.js');

require('../mysql.js');
require('../index.js');
 
var drugsNames = [
    ["Marijuana"],
    ["Cocaine"],
    ["Cannabis"],
    ["Salvia"] 
] 
 
mp.events.addCommand('drugs', (player) => { 
 
    player.call('accesingMenuDrugs', []);
});   
 
mp.events.add("executeDrugsClick", (player, button) => { 

    //Set variable
    player.data.working = true;
    player.data.workingStatus = 0;
 
    //Destroy browser
    player.call('destroyMenuDrugs', []);
 
    //Send message
    sendMessage(player, COLOR_JOBS, `(JOB):!{ffffff} Good, go on plant position and plant your ${drugsNames[button]}..`); 
});


mp.events.add("startPlayerDrugs", (player) => { 

    player.call('accesingMenuDrugs', []);
});