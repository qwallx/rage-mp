
//Los Santos Police Department
require("CEF/factions/lspd/lspd.js");

//Block doors
mp.game.object.doorControl(631614199, 461.8065, -994.4086, 25.06443, true, 0, 0, 0); // Jaill Cell 1
mp.game.object.doorControl(631614199, 461.8065, -997.6583, 25.06443, true, 0, 0, 0); // Jaill Cell 2
mp.game.object.doorControl(631614199, 461.8065, -1001.302, 25.06443, true, 0, 0, 0); // Jaill Cell 3
mp.game.object.doorControl(749848321, 453.0793, -983.1895, 30.83926, false, 0, 0, 0); // Armoury

//Show factions
let factionsBrowser = null;

mp.events.add('showPlayerFactions', (player, text, totalFactions) => {

    if(factionsBrowser == null) factionsBrowser = mp.browsers.new("package://CEF/factions/serverFactions.html");  
    mp.gui.cursor.visible = true; 
 
    factionsBrowser.execute(`document.getElementById('showFHolder-placeholder').innerHTML = '${text}'`);  
    factionsBrowser.execute(`document.getElementById('totalFactionH-placeholder').innerHTML = 'Server factions: ${totalFactions}'`);  
    return;
});

function closePlayerFMenu(state) { mp.trigger("closePlayerFMenu2", state); }  
mp.events.add("closePlayerFMenu2", (state) => { 
 
    mp.events.callRemote("actionClickFaction", state);  
    if(factionsBrowser != null) {
        factionsBrowser.destroy();

        factionsBrowser = null; 
        mp.gui.cursor.visible = false;   
    }
    return true;   
}); 

