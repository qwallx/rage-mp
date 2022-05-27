//Variables 
require('../mysql.js');
require('../index.js');

let markerID = null;

const fishWorkPosition = [ 
    [-1864.553, -1236.843, 8.616],
    [-1861.638, -1240.406, 8.616],
    [-1854.950, -1245.929, 8.616],
    [-1850.047, -1250.010, 8.616],
    [-1840.158, -1258.512, 8.616]
];

const setCheckpointFish = [  
    [-1872.649, -1230.344, 0.404], 
    [-1872.296, -1253.722, -0.350],   
    [-1863.841, -1258.417, -0.388],   
    [-1858.319, -1262.294, 0.397], 
    [-1851.596, -1276.346, -0.035]               
];

const fishEnum = [
    ["Mediterranean rainbow wrasse", 5000],
    ["Arapaima", 699],
    ["Catfish", 500],
    ["Dartfish", 1499],
    ["Northern clingfish", 6499]
]
 
//Create Position 3dText 
for(let x = 0; x < fishWorkPosition.length; x ++)
{ 
    mp.labels.new(`Fishing position ~o~(${x + 1})~s~\nPress ~o~E~s~ key`, new mp.Vector3(fishWorkPosition[x][0], fishWorkPosition[x][1], fishWorkPosition[x][2]),
    {
        los: false,
        font: 4,
        drawDistance: 20,
        dimension: 0
    }); 
}

//Events
mp.events.add("accesingJobKey", (player) => { 
 
    switch(player.data.job)
    {
        //Fishing key
        case 0:
        { 
            for(let x = 0; x < fishWorkPosition.length; x ++)
            { 
                if(player.IsInRange(fishWorkPosition[x][0], fishWorkPosition[x][1], fishWorkPosition[x][2], 3))
                {      
                    //Create marker
                    createFishMarker(player, x, 0);

                    //Set fishing action
                    player.call("playDrillScenario", ['WORLD_HUMAN_STAND_FISHING']);

                    //Call progressbar
                    player.call("showProgressBar", []);
    
                    setTimeout(() => {

                        //Give player fish
                        givePlayerFish(player);

                        //Destroy progressbar
                        player.call("destroyBrowserProgress", []);
                        
                    }, 11000);  
                    break;
                }
            } 
            break;
        }

        //Trucker
        case 1:  
        {  
            if(player.isAtJob(player.data.job) == false) 
                return true;

            if(player.data.job != 1) 
                return player.call("showNotification", ['You don`t have Trucker job.']);

			if(player.data.drivingLicense == 0) 
                return player.call("showNotification", ['You don`t have a driving license.']);
                
            if(player.data.working == true)
                return player.call("showNotification", [`You already working on this job.`]); 
 
			//SET VARIABLES
			player.data.jobStage = 1; 
			player.data.working = true; 
				
			//CREATE CAMION
            player.jobVehicle = player.createVehicle(player, 'phantom', new mp.Vector3(712.074, -1368.003, 26.148), generateRGB(), generateRGB(), 0.5587, 1);
             
			//SHOW RUTES
			player.call('onJobSelected', player.data.job);

			//SEND MESSAGE
            sendMessage(player, 'ff4d4d', `(Job info):!{ffffff} You started work on Trucker job, please select route.`);   
            break;
        }
         
        //Farmer
        case 2:
        {
            mp.events.call("startPlayerPlant", player); 
            break;
        } 

        //Drugs dealer
        case 3:
        {
            mp.events.call("startPlayerDrugs", player); 
            break;
        }
    
        default: break;
    }
});

function createFishMarker(player, x, type)
{ 
    switch(type)
    {
        case 0:
        { 
            markerID = mp.markers.new(0, new mp.Vector3(setCheckpointFish[x][0], setCheckpointFish[x][1], setCheckpointFish[x][2] + 1.0), 1,
            {
                direction: new mp.Vector3(0, 0, 0),
                rotation: new mp.Vector3(0, 0, 0),
                visible: true,
                color: [50, 168, 82, 255], 
                dimension: 0
            });  
            break;
        } 
    } 
    return;
}

function givePlayerFish(player)
{
    //Resets
    player.data.working = false; 
    player.stopAnimation();
 
    const fishInformations = fishEnum[Math.floor(Math.random() * fishEnum.length)]; 
  
    //Set fish data
    player.data.fishName = fishInformations[0];
    player.data.fishPrice = fishInformations[1];

    player.stopAnimation();
 
    player.call("showNotification", [`You caught <a style="color:#ff9933">${fishInformations[0]}</a> (${fishInformations[1]}$).`]); 
    return;
}
 
//Command
mp.events.addCommand('gotofish', (player, id) => {   

    if(!id) 
        return sendUsage(player, '/gotofish [fishing id]');

    if(player.data.admin < 2) 
        return player.outputChatBox("You don't have admin level 2.");
    
    if(id > fishWorkPosition.length || id < 1) 
        return sendMessage(player, '009933', 'Invalid fishing ID.');
 
    player.position = new mp.Vector3(fishWorkPosition[id][0], fishWorkPosition[id][1], fishWorkPosition[id][2]);
    sendAdmins('ff9900', `(Notice):!{ffffff} ${player.name} teleported to fish position ${id}.`); 
});   