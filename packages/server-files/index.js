var randomColor = require('randomcolor'); 

//Global server variable
global.gm = {}; 
gm.mysql = require('./mysql.js');
gm.auth = require('./auth.js'); 
gm.mysql.connect(function() { });

global.loaded_business_count = 0;
global.loaded_house_count = 0;
global.loaded_groups_count = 0; 
global.loaded_rent_count = 0;  
global.loaded_dealer_vehicles = 0;

global.truckerCity = [
	["Los santos"],
	["Los santos"],
	["San fierro"] 
];

global.COLOR_GLOBAL      = "ff4d4d"; 
global.COLOR_ADMIN       = "ff9900";
global.COLOR_GREEN       = "00cc66";
global.COLOR_ERROR       = "669999";  
global.COLOR_RADIO       = "0066cc";
global.COLOR_DEPARTMENT  = "ff3535";  
global.COLOR_GROUPS      = "6699ff";
global.COLOR_JOBS        = "9900cc";
global.COLOR_RED         = "ff3333";
  
//Server Jobs
require('./jobs/trucker.js');
require('./jobs/pizza.js'); 
require('./jobs/fisherman.js');
require('./jobs/farmer.js');
require('./jobs/drugsDealer.js');
 
//Houses / Business 
require('./houses/house.js')   
require('./business/bizz.js')  

require('./group/factionsGeneral.js')  //General factions
require('./group/LSPD.js')  //Faction lspd

//Player folders
require('./player/commands.js')
require('./player/playerFunctions.js') 
                                     
//Admin folders
require('./admin/adminCommands.js')  
require('./admin/adminFunctions.js') 

//DMV server
require('./dmv/index.js')   

//Voice chat
require('./voice/index.js');

//Player inventory
require("./inventory/inventory.js");
 
//Bank
require('./others/bank.js');

//Easy White-list
require('./easy-whitelist/index.js');

//Trade
require('./trade/index.js');
 
//Others sistems
require('./others/rentCar.js');
require('./others/personalVehicles.js'); 
  
//Real wather
require('./realWather.js'); 
 
//Character creator
require('./charcreator/index.js'); 
  
mp.events.add("playerChat", (player, text) =>
{   
	if(player.data.mute > 0) 
	    return sendMessage(player, 'ffffff', `You are muted, you canno't speak.`);
     
	sendLocal(player,  `669999`, 20, `${player.name} [${player.id}]:!{ffffff} ${text}`);
});
 
mp.events.add("playerEnterVehicle", playerEnterVehicleHandler); 
function playerEnterVehicleHandler(player, vehicle, seat)
{  
	vehicle.haveDriver = true; 

	player.setVariable('seatBelt', 0);
	  
    if((player.data.drivingLicense == 0 && seat == -1) && player.data.InDMV == 0) 
    {
		player.removeFromVehicle();
		player.stopAnimation();
        sendMessage(player, 'ff4d4d', `(License):!{ffffff} You don't have driving license.`);
        return;
	}
 
	mp.events.call("callVehicleInformations", player, vehicle, seat); 
}
 
mp.events.add("playerStartEnterVehicle", playerStartEnterVehicleHandler); 
function playerStartEnterVehicleHandler(player, vehicle, seat) 
{ 
	vehicle.haveDriver = true; 

	player.setVariable('seatBelt', 0); 

    player.call("update_speedometer", []); 

    if((player.data.drivingLicense == 0 && seat == 0) && player.data.InDMV == 0) 
    {
		player.removeFromVehicle();
		player.stopAnimation();
        sendMessage(player, 'ff4d4d', `(License):!{ffffff} You don't have driving license.`);
        return;
    }
}
  
//SET SERVER TIME
const date = new Date(); 
mp.world.time.set(date.getHours(), date.getMinutes(), date.getSeconds());

setInterval(() => {

	//THIRST AND HUNGER SISTEM
	mp.players.forEach(player => { 
        if(player.loggedInAs == true) { 
    
            //Thirst & Hunger
            if(player.data.hunger > 0)
            {
                player.data.hunger -= 5; 

                if(player.data.hunger == 15)
                {
                    sendMessage(player, 'ff6600', `( Hunger :hunger: ):!{ffffff} Hunger is now !{ff6600}15!{ffffff}% go to store and eat something.`);   
                }
            }
  
            if(player.data.thirst > 0)
            {
                player.data.thirst -= 5; 

                if(player.data.thirst == 20)
                {
                    sendMessage(player, '33bbff', `( Thirst :thirst: ):!{ffffff} Thirst is now !{33bbff}20!{ffffff}% go to store and drink something.`);   
                }
            }
 
            //Update HUD
            player.call('openPlayerHud', [player.formatMoney(player.data.money, 0), player.formatMoney(player.data.moneyBank, 0), player.health, player.armour, player.data.hunger, player.data.thirst, player.data.hudStatus]); 

            //Update MYSQL
            mysql_action('UPDATE `accounts` SET food = ?, water = ? WHERE username = ? LIMIT 1', [player.data.hunger, player.data.thirst, player.name]);  
        } 
    }); 

    //SET SERVER TIME
	const date = new Date();  
    mp.world.time.set(date.getHours(), date.getMinutes(), date.getSeconds()); 

}, 60000);

 
mp.events.add("playerExitVehicle", playerExitVehicleHandler); 
function playerExitVehicleHandler(player, vehicle) 
{  
	vehicle.haveDriver = false; 

	if(player.data.InDMV == 1 && player.data.schoolVehicle) 
	{ 
		player.data.schoolVehicle.destroy();
		player.call('destroyDMVCheckpoint');  
		player.call("closeDrivingCEF", [player]); 
	
		player.data.InDMV = 0; 
		player.data.dmvStage = 0;  

		sendMessage(player, 'ff4d4d', 'Instructor:!{ffffff} Examen failed because you left vehicle.');
	}
	return;
}    
  
global.generateRGB = function() {
	let color = randomColor({ luminosity: 'bright', format: 'rgb' });
	color = color.replace("rgb(", "");
	color = color.replace(")", "");
	color = color.replace(" ", "");
	color = color.split(",");
	return color;
	console.log('heard');
}

////////////////////////////////////////////////////////////////////////////  MYSQL  ////////////////////////////////////////////////////////////////////////////
global.mysql_action = function(actionOne, actionTwo)
{ 
    gm.mysql.handle.query(actionOne, actionTwo, function(err, res) { 
        if(err)  
            return console.log(err); 
    });  
} 