var struct = require('../struct.js'); 
require('../mysql.js');
require('../index.js'); 
 
mp.events.add('startPizzaJob', (player) => {  
  
    if(player.data.drivingLicense == 0) 
        return sendMessage(player, 'FFFFFF', `You don't have a driving license.`);    

    player.data.jobStage = 1; 
    player.data.working = true;
   
    player.jobVehicle = mp.vehicles.new(mp.joaat('faggio'), new mp.Vector3(1256.257, -357.365, 68.280), 
    { 
        dimension: player.dimension,
        color: [[57, 172, 244], [57, 172, 244]],
        locked: false, 
        fuel: 100,
        owner: 'State of San Andreas',
        engine: false,
        type: 'Job Vehicle', 
        owner: player.name 
    }); 
 
    player.putIntoVehicle(player.jobVehicle, 0);
 
    //Random set CP
    let id = 0; 
    for(let x = 0; x < loaded_house_count; x ++) id = x;

    player.call('job_setBlip', ['Deliver to: House' + struct.houses[id].houseX, struct.houses[id].houseY, struct.houses[id].houseZ]);
    player.call('job_setCheckpoint', [struct.houses[id].houseX, struct.houses[id].houseY, struct.houses[id].houseZ, 4]);

    sendMessage(player, 'ff4d4d', `(Job info):!{ffffff} Go to !{ff4d4d}[location]!{ffffff} and deliver this pizza..`); 
    return;
}); 
 
mp.events.add('onJobCheckpointEntered', (player) => {
 
    if(player.data.job == 3) 
    {  
        if(player.data.jobStage == 1) 
        {  
            player.data.jobStage = 2;

            player.call('job_destroyCheckpoint');
            player.call('job_destroyBlip');
            player.call('job_setCheckpoint', [1255.706, -360.952, 68.279, 5]);
            player.call('job_setBlip', ['Job: Back to HQ', 1255.706, -360.952, 68.279]);
 
            //Give player money
            let money = player.data.level * (500 + Math.random() * 6).toFixed(0); 
            player.giveMoney(0, money);

            sendMessage(player, 'ff4d4d', `(Job info):!{ffffff} You received !{ff4d4d}${player.formatMoney(money, 0)}!{ffffff}$ for this delivery.`);  
            sendMessage(player, 'ff4d4d', `(Job info):!{ffffff} Get back to !{ff4d4d}Horny's Burgers!{ffffff} to take a new delivery.`);  
        }
        else if(player.data.jobStage == 2) 
        {
            if(!player.vehicle || player.vehicle != player.jobVehicle) return mp.events.call('stopWork', player, "You've lost the vehicle");
            
            player.call('job_destroyCheckpoint');
            player.call('job_destroyBlip');
             
			player.data.jobStage = 1; 
			player.data.working = true;
		 
			//Random set CP
			let id = 0; 
			for(let x = 0; x < loaded_house_count; x ++) id = x;
		
			player.call('job_setBlip', ['Deliver to: House' + struct.houses[0].houseX, struct.houses[0].houseY, struct.houses[0].houseZ]);
			player.call('job_setCheckpoint', [struct.houses[0].houseX, struct.houses[0].houseY, struct.houses[0].houseZ, 4]);
		
			sendMessage(player, 'ff4d4d', `(Job info):!{ffffff} Go to !{ff4d4d}[location]!{ffffff} and deliver this pizza.`);
        }
    }
});

 