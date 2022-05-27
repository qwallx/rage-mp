require('../mysql.js');
require('../index.js'); 

var struct = require('../struct.js'); 
var loaded_jobs_count = 0;
   
const deliveryDestinations = [
	[403.56, -1917.49, 24.93], //Carson Avenue - los santos
	[133.52, -379.90, 43.25], //Occupation Avenue - los santos
	[-584.33, -1799.02, 22.99] //La Puerta - los santos
]; 
 
const truckerLocation = [
	["Carson Avenue"],
	["Occupation Avenue"],
	["La Puerta"] 
];

//Loaded from database informations  
gm.mysql.handle.query('SELECT * FROM server_jobs', [], function (error, results, fields) {
	for(let i = 0; i < results.length; i++) {
		 
		loaded_jobs_count ++;

		struct.jobs[i].jobName = results[i].jobName;
		struct.jobs[i].jobID = i + 1;

		struct.jobs[i].jobX = results[i].jobPosX;
		struct.jobs[i].jobY = results[i].jobPosY;
		struct.jobs[i].jobZ = results[i].jobPosZ;
 
		struct.jobs[i].jobWorkPosX = results[i].jobWorkX;
		struct.jobs[i].jobWorkPosY = results[i].jobWorkY;
		struct.jobs[i].jobWorkPosZ = results[i].jobWorkZ;

		struct.jobs[i].jobWorkers = 0;
 
		struct.jobs[i].job3DText = mp.labels.new(`~r~ID:~s~ ${i + 1}\n~r~Job Name:~s~ ${results[i].jobName}\nPress ~r~K~s~ to get the job.\nPress ~r~L~s~ to quit the job`, new mp.Vector3(parseFloat(results[i].jobPosX), parseFloat(results[i].jobPosY), parseFloat(results[i].jobPosZ)),
		{
			los: true,
			font: 4,
			drawDistance: 50,
		});   

		struct.jobs[i].jobPickup = mp.markers.new(2, new mp.Vector3(parseFloat(results[i].jobPosX), parseFloat(results[i].jobPosY), parseFloat(results[i].jobPosZ)), 1,
		{
		    direction: new mp.Vector3(0,0,0),
		    rotation: new mp.Vector3(0,0,0),
		    visible: true,
		    dimension: 0
		}); 
		  
		struct.jobs[i].jobWork3DText = mp.labels.new(`Work point\n~r~Job: ~s~${struct.jobs[i].jobName}\nPress ~b~E~s~ to interract`, new mp.Vector3(parseFloat(results[i].jobWorkX), parseFloat(results[i].jobWorkY), parseFloat(results[i].jobWorkZ)),
		{
			los: false,
			font: 4,
			drawDistance: 10,
			dimension: 0
		});
		  
		struct.jobs[i].jobWorkPickup = mp.markers.new(1, new mp.Vector3(parseFloat(results[i].jobWorkX), parseFloat(results[i].jobWorkY), parseFloat(results[i].jobWorkZ - 1.4)), 1,
		{
			color: [246,205,97, 200],
			dimension: 0
		}); 

        struct.jobs[i].jobBlip = mp.blips.new(408, new mp.Vector3(parseFloat(results[i].jobWorkX), parseFloat(results[i].jobWorkY), parseFloat(results[i].jobWorkY - 1.1)), {
            name: `Job ${struct.jobs[i].jobName}`,
            scale: 0.8,
            color: 25,
            drawDistance: 5,
            shortRange: true,
            dimension: 0,
        });

	}
	console.log(`[MYSQL] Loaded jobs: ${loaded_jobs_count.toString()}`);
}); 
 
mp.events.add('auto_attach_trailer', (player) => {

	if(player.data.job == 1 && player.data.working == true)
        player.call('job:attachTrailer', [player.jobVehicle, player.jobTrailer]);    
});

mp.events.add('onJobCheckpointEntered', (player, trailerStatus) => {

	if(player.data.job == 1 && player.vehicle && player.vehicle == player.jobVehicle) 
	{  
		//AICI INTRA CU CAMIONU IN CHECKPOINT SI TRB SA II DEA BANII
		if(player.data.jobStage == 1) 
		{ 
			if(trailerStatus == false)
			    return player.call("showNotification", [`Your trailer is not attached to vehicle.`]); 
 
			//CALL EVENTS 
		    player.call('job_destroyCheckpoint');
			player.call('job_destroyBlip');
			 
			if(player.jobTrailer)
			{
				player.jobTrailer.destroy();
				player.jobTrailer = null;
			}
		 
			//RESET VARIABLES 
			player.data.jobStage = 2;
		 
			//SET CHECKPOINT TO DEPOSIT
			player.call('job_setBlip', ['Job: Load Materials', 747.1783, -1346.5900, 26.3164]);
			player.call('job_setCheckpoint', [747.1783, -1346.5900, 26.3164, 4]); 
 
			//SEND MONEY
			const money = player.getVariable('truckerPlayerMoney'); 
			player.giveMoney(0, money);
		
			//SEND MESSAGES
			sendMessage(player, 'ff4d4d', `(Job info):!{ffffff} You received !{ff4d4d}${player.formatMoney(money, 0)}!{ffffff}$ for this race.`);  
			sendMessage(player, 'ff4d4d', `(Job info):!{ffffff} Go back to the Port of Los Santos for a new transport.`);  
			return;
		}
		
		if(player.data.jobStage == 2) 
		{   
			player.data.jobStage = 1;   

			player.call('job_destroyCheckpoint');
		    player.call('job_destroyBlip'); 
			player.call('onJobSelected', player.data.job);
			return;
		} 
	}
});
  
mp.events.add('playerPressJobButton', (player, type, job) => {

	switch(type)
	{ 
		//Find job on commands [/jobs]
		case 3: 
		{  
			player.call('setPlayerCheckPoint', [player, struct.jobs[job].jobX, struct.jobs[job].jobY, struct.jobs[job].jobZ]); 
			sendMessage(player, 'FFFFFF', `(Job point):!{ffffff} A checkpoint has been placed at job !{ff4d4d}${struct.jobs[job].jobName}!{ffffff}.`);  
			break;
		} 
		
		//Close buttons
		case 4, 6: break;  
	  
		//Teleport job on commands [/jobs]
		case 5:
		{ 
			sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} Admin ${player.name} teleported to job ${struct.jobs[job].jobName} (/gotojob).`);
			player.position = new mp.Vector3(struct.jobs[job].jobX, struct.jobs[job].jobY, struct.jobs[job].jobZ); 
			break;
		}

	    //Button 'GO ON DUTY'
		case 7:  
		{  
			player.setVariable('playerStartedWork', !player.getVariable("playerStartedWork"));
 
			player.model = mp.joaat(`${(player.getVariable("playerStartedWork") == true) ? ("a_m_m_farmer_01") : ("a_m_y_beachvesp_01")}`);   
			player.call("showNotification", [`You are ${(player.getVariable("playerStartedWork") == true) ? ('<a style="color:green">on') : ('<a style="color:red">off')}</a> duty now.`]); 
            break;
		}
 
		//Farmer job
		case 8:
		{  
			if(player.data.work == true && player.getVariable('moneyToCollect')) 
			{
				player.call("showNotification", [`You already work, can collect your money <i class="fa fa-info-circle" aria-hidden="true"></i>`]); 
				break;
			}

			mp.events.call("startFarmerWork", player); 
			break;
		}

		//Trucker routes
		default:  
		{ 
			//VARIABLES
			const routePrice = player.data.level * (500 + Math.random() * 6 + (type) * 52).toFixed(0); 
			const routeTax = (player.data.level * 5) + 100;
			const delivery = deliveryDestinations[type];

			//CALL EVENTS
			player.call('job_setBlip', ['Job: Deliver Materials', delivery[0], delivery[1], delivery[2]]);
			player.call('job_setCheckpoint', [delivery[0], delivery[1], delivery[2], 8]);
 
			//SET VARIABLES
			player.setVariable('routeID', type); 
			player.setVariable('truckerCity', truckerCity[type]);
			player.setVariable('truckerRoutePlayer', truckerLocation[type]);
			player.setVariable('truckerPlayerMoney', routePrice - parseInt(routeTax));
			
			//MODIFFI HUD INFO
			player.call("onJobTimer", [player.getVariable('truckerCity'), player.getVariable('truckerRoutePlayer')]);

			//CREATE TRAILER
			player.jobTrailer = player.createVehicle(player, 'tanker',  new mp.Vector3(712.630, -1380.467, 26.277), generateRGB(), generateRGB(), 358.536, 0);
			player.call("attach_triler", [player.jobVehicle, player.jobTrailer]);

			player.jobTrailer.engine = true;
			player.call('setEngineState', [player.jobTrailer.engine, player]);

			//MESSAGES
			sendMessage(player, `FFFFFF`, `----------------!{ff4d4d}(Route selected):!{ffffff}--------------`);
			sendMessage(player, `FFFFFF`, `City: !{ff4d4d}${truckerCity[type]}!{ffffff} | Location: !{ff4d4d}${truckerLocation[type]}!{ffffff}.`); 
			sendMessage(player, `FFFFFF`, `Route price: !{ff4d4d}${player.formatMoney(routePrice, 0)}!{ffffff} (-${routeTax}$ tax).`);  
			sendMessage(player, `FFFFFF`, `------------------------------------------------------`);  
			break;
		} 
	}
});
 
//Job commands si events
mp.events.add('commandGetJob', cmd_GetJob); //Functie get job
mp.events.add('commandQuitJob', cmd_QuitJob); //Functie enter exit from house. 
 
mp.events.addCommand('gotojob', (player, id) => {
    if(!id) return sendUsage(player, '/gotojob [job id]'); 
    if(player.data.admin < 2) return player.outputChatBox("You don't have admin level 2.");
    if(id > loaded_jobs_count || id < 1) return sendMessage(player, '009933', 'Invalid job ID.');

    player.position = new mp.Vector3(struct.jobs[id - 1].jobX, struct.jobs[id - 1].jobY, struct.jobs[id - 1].jobZ);
    sendAdmins('ff9900', `(Notice):!{ffffff} ${player.name} teleported to job ${struct.jobs[id - 1].jobName}.`);
}); 

mp.events.addCommand('stopwork', (player) => { 

	mp.events.call("playerStopWork", player);
});

mp.events.add('playerStopWork', (player) => {
	
	if(player.data.job != -1 && player.data.working == true) 
	{ 
		if(player.jobVehicle)
		{
			player.jobVehicle.destroy();
			player.jobVehicle = null;
		}

		if(player.jobTrailer)
		{
			player.jobTrailer.destroy();
			player.jobTrailer = null;
		}
 
		player.data.working = false;
		player.data.jobStage = 0;
  
		player.call('job_destroyBlip');
		player.call('job_destroyCheckpoint');
		player.call('job_closeCef');   
		  
		//HIDE HUD JOB INFORMATIONS
		player.call("onJobTimer", [0, 0]);
  
		player.call("showNotification", [`Your stopped working at job <a style="color:#8080ff">${struct.jobs[player.data.job].jobName}</a>.`]); 
	}
}); 
 
function cmd_GetJob (player) 
{ 
	for(let x = 0; x < loaded_jobs_count; x ++)
	{  
		if(player.IsInRange(struct.jobs[x].jobX, struct.jobs[x].jobY, struct.jobs[x].jobZ, 5)) 
		{
			player.data.job = x;
  
			//MESSAGE
			player.call("showNotification", [`Your job is now <a style="color:#8080ff">${struct.jobs[x].jobName}</a>.`]); 

			//MYSQL
			mysql_action('UPDATE `accounts` SET job = ? WHERE username = ?', [parseInt(x), player.name]); 
			break;
		} 
	} 
} 

function cmd_QuitJob (player) 
{ 
	if(player.data.job != -1) {
 
		if(player.data.working == true) 
		    return sendMessage(player, COLOR_ERROR, "You work, use [/stopwork].");
	
		player.data.job = -1;
 
		//MESSAGE 
		player.call("showNotification", [`You resigned from this job.`]); 

		//MYSQL
		mysql_action('UPDATE `accounts` SET job = ? WHERE username = ?', [player.data.job, player.name]); 
	}
} 
 
mp.events.addCommand('jobs', (player) => { 

	let jobsString = '';
 
	for(let x = 0; x < loaded_jobs_count; x ++)
	{
		jobsString += `<tr><td>${x + 1}</td><td>${struct.jobs[x].jobName}<td>${player.dist(new mp.Vector3(struct.jobs[x].jobX, struct.jobs[x].jobY, struct.jobs[x].jobZ)).toLocaleString(undefined, {maximumFractionDigits:2})}</td><td><button class="btn btn-success btn-sm" id = "jobButton" onclick = "sendJobInformations(3, ${x});">Find</button> ${(player.data.admin > 0) ? (`<button class="btn btn-danger btn-sm" id = "jobButton" onclick = "sendJobInformations(5, ${x});">Teleport</button>`) : ("")}</td></tr>`; 
	}
 
	player.call("showJobsBrowser", [jobsString]);
});   