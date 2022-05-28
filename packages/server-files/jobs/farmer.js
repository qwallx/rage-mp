//Variables 
var struct = require('../struct.js');

require('../mysql.js');
require('../index.js');
 
const plantPosition = [ 
    [2268.388, 5140.472, 54.372],
    [2271.396, 5137.424, 53.558],
    [2275.687, 5133.091, 52.402],
    [2279.020, 5129.751, 51.789],
    [2282.524, 5126.672, 51.227],
    [2286.748, 5122.324, 50.530],
    [2289.800, 5119.447, 50.096],
    [2293.259, 5115.934, 49.579],
    [2296.637, 5112.691, 49.111],
    [2300.948, 5108.498, 48.544],
    [2276.028, 5147.697, 55.084],
    [2278.327, 5145.768, 54.519],
    [2282.646, 5141.313, 53.309],
    [2285.792, 5138.199, 52.618],
    [2289.427, 5134.840, 51.943],
    [2293.500, 5130.693, 51.147],
    [2296.247, 5128.009, 50.685],
    [2299.370, 5124.870, 50.154],
    [2303.119, 5121.286, 49.558],
    [2307.178, 5117.363, 48.925] 
];
 
//Event plant
mp.events.add("startPlayerPlant", (player) => {  
 
	if(player.IsInRange(struct.jobs[2].jobWorkPosX, struct.jobs[2].jobWorkPosY, struct.jobs[2].jobWorkPosZ, 5))                      
	{ 
        const money = player.data.plantCollected * 2000;

        player.setVariable('moneyToCollect', money);
 
        player.call("showJobWorksInfo", [player, 'This job consists of planting 20 plants and harvesting them. After harvesting the plants, you can get the money by accessing this menu.', 'Farmer', struct.jobs[2].jobWorkers, player.formatMoney(money, 0), player.data.plantCollected]);  
    }
    
    if(player.data.working == true)
    {
        for(let x = 0; x < plantPosition.length; x ++)
        { 
            if(player.IsInRange(plantPosition[x][0], plantPosition[x][1], plantPosition[x][2], 1.5))
            {     
                //Plant seeds
                if(player.getVariable(`plantPlanted${x}`) == false) return finishFarmerJob(player, 1, x);   
     
                //Collect plants
                if(player.getVariable(`plantPlanted${x}`) == true && player.getVariable(`plantLabelTime${x}`) == 0) return finishFarmerJob(player, 0, x);    
                break;
            }
        }
    }  
});


mp.events.add("startFarmerWork", (player) => {  
 
    const money = player.getVariable('moneyToCollect');

    //Collect money
    if(money > 0)
    { 
        //Send notiffication
        player.call("showNotification", [`You collected <a style="color:#8080ff">${player.formatMoney(money, 0)}</a>$ for <a style="color:#8080ff">${player.data.plantCollected}<a> planted.`]); 

        //Reset variable
        player.data.plantCollected = 0;
        player.setVariable('moneyToCollect', 0)
        
        //Send money 
        player.giveMoney(0, money);

        //Update cef 
        player.call("showJobWorksInfo", [player, 'This job consists of planting 20 plants and harvesting them. After harvesting the plants, you can get the money by accessing this menu.', 'Farmer', struct.jobs[2].jobWorkers, player.formatMoney(player.getVariable('moneyToCollect'), 0), player.data.plantCollected]);  
        
        //Reset labels and objects
        for(let x = 0; x < plantPosition.length; x ++)
        {   
            player.call('destroy_object', [x]); 
            player.call('destroyLabel', [x]); 

            player.setVariable(`plantPlanted${x}`, false);
            player.setVariable(`plantLabelTime${x}`, -1);
        } 
        return;
    }
 
    //Start work
    for(let x = 0; x < plantPosition.length; x ++)
    {    
        player.setVariable(`plantPlanted${x}`, false);
        player.setVariable(`plantLabelTime${x}`, -1);
        createFarmerLabels(player, x, 0)
    } 

    //Working acces
    player.data.working = true;

    //Send notiffication
    player.call("showNotification", [`You started work at <a style="color:#8080ff">Farmer</a> job.`]); 
});

function updateObjectFarmer(player, x)
{  
    player.call('update_object', [x, plantPosition[x][0], plantPosition[x][1], plantPosition[x][2]]); 
}

function finishFarmerJob(player, option, x) 
{  
    //Set variable
    if(option == 1) player.setVariable(`plantPlanted${x}`, true);

    //Create animtion
    player.call("playDrillScenario", ['WORLD_HUMAN_GARDENER_PLANT']);

    //Stop animation and update label
    player.call("showProgressBar", [option == 0 ? ('fas fa-leaf') : ('fas fa-seedling')]);
  
    setTimeout(() => {

        switch(option)
        {
            case 0:
            {
                //Object destroy
                player.call('destroy_object', [x]); 

                //Destroy label
                player.call('destroyLabel', [x]); 
 
                player.data.plantCollected ++;
 
                //Send notiffications
                player.call("showNotification", [`Plant collected <i class="fas fa-leaf"></i>`]); 

                //Block next plant
                player.setVariable(`plantLabelTime${x}`, -2);
                break;
            }
            case 1:
            { 
                if(player.getVariable(`plantLabelTime${x}`) != -1)
                    return;

                //Update label
                player.setVariable(`plantLabelTime${x}`, 10);
                createFarmerLabels(player, x, 1); 

                //Send notiffications
                player.call("showNotification", [`Seeds planted <i class="fas fa-seedling"></i>`]); 
 
                player.call('create_object', [x, 3529729772, plantPosition[x][0], plantPosition[x][1], plantPosition[x][2] - 3]);  
                break;
            }
        } 

        //Stop animation
        player.stopAnimation();
 
        //Destroy progressbar
        player.call("destroyBrowserProgress", []); 

    }, 11000);  
}
 
function createFarmerLabels(player, x, option)
{  
    //option 0 - create
    //option 1 - update
 
    //Create label text
    if(option == 0)
    {  
        player.call('createLabel', [x, `${player.getVariable(`plantLabelTime${x}`) == -1 ? `Plant point ~o~(${x + 1})~s~\nPress ~o~E~s~ to plant` : `Plant point ~o~(${x + 1})~s~\nHarvest in ~b~${player.getVariable(`plantLabelTime${x}`)}~s~ minutes`}`, plantPosition[x][0], plantPosition[x][1], plantPosition[x][2]]); 
        return; 
    } 

    player.call('updateLabel', [x, `${player.getVariable(`plantLabelTime${x}`) == 0 ? `Plant point ~o~(${x + 1})~s~\nPress ~b~E~s~ to collect` : `Plant point ~o~(${x + 1})~s~\nHarvest in ~b~${player.getVariable(`plantLabelTime${x}`)}~s~ minutes`}`]); 
}
  
setInterval(() => {
 
    for(let x = 0; x < plantPosition.length; x ++)
    {
        mp.players.forEach(player => {

            if(player.loggedInAs == true && player.data.job == 2 && player.getVariable(`plantLabelTime${x}`) > 0)
            {  
                const count = player.getVariable(`plantLabelTime${x}`);
                player.setVariable(`plantLabelTime${x}`, count - 1); 

                //Update label
                createFarmerLabels(player, x, 1);  

                //Update object
                updateObjectFarmer(player, x);
            } 
        });
    }  
}, 5000); 
 
mp.events.addCommand('farm', (player) => { 
 
    player.call('createLabel', [player, `asdasdasd`, player.position.x, player.position.y, player.position.z]);  
});  

mp.events.addCommand('scenario', (player, scenario) => { 
 
    player.call("playDrillScenario", [scenario]);
});    