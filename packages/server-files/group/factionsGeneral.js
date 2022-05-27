var struct = require('../struct.js');  
  
require('../mysql.js');
require('../index.js');
 
//Loaded from database informations  
gm.mysql.handle.query('SELECT * FROM server_groups', [], function (error, results, fields) {
	for(let i = 0; i < results.length; i++) {
		   
        struct.group[i].groupID = i + 1;
        struct.group[i].groupName = results[i].name;
         
        //exterior pos
		struct.group[i].groupExitX = results[i].exitX;
		struct.group[i].groupExitY = results[i].exitY;
        struct.group[i].groupExitZ = results[i].exitZ;
        
        //int pos
		struct.group[i].groupIntX = results[i].entX;
		struct.group[i].groupIntY = results[i].entY;
        struct.group[i].groupIntZ = results[i].entZ;
        struct.group[i].groupIntHead = results[i].entHead;

        //Normal variables
        struct.group[i].groupMaxMembers = results[i].maxMembers;
        struct.group[i].groupMinLevel = results[i].minLevel;
        struct.group[i].groupType = results[i].groupType;
            
		struct.group[i].group3DText = mp.labels.new(`~r~ID:~s~ ${i + 1}~n~~r~Name: ~s~${results[i].name}`, new mp.Vector3(parseFloat(results[i].exitX), parseFloat(results[i].exitY), parseFloat(results[i].exitZ)),
		{
			los: true,
			font: 4,
			drawDistance: 10,
		});   

		struct.group[i].groupPickup = mp.markers.new(1, new mp.Vector3(parseFloat(results[i].exitX), parseFloat(results[i].exitY), parseFloat(results[i].exitZ - 1.1)), 1,
		{
		    direction: new mp.Vector3(0, 0, 0),
		    rotation: new mp.Vector3(0, 0, 0),
		    visible: true,
		    dimension: 0
        });   
        loaded_groups_count ++;
    }
    
    console.log(`[MYSQL] Loaded groups: ${loaded_groups_count.toString()}`);
});
 
//Event player click button
mp.events.add('actionClickFaction', (player, x) => {  
    switch(x)
    {
        case -1: break;
        default:
        {
			player.call('setPlayerCheckPoint', [player, struct.group[x].groupExitX, struct.group[x].groupExitY, struct.group[x].groupExitZ]); 
            sendMessage(player, 'ff9900', `(Group point):!{ffffff} A checkpoint has been placed at group !{ff9900}${struct.group[x].groupName}!{ffffff}.`); 
            break; 
        }
    }  
}); 

//Spawn on faction
mp.events.add('spawnPlayerAtFaction', (player) => {

    const x = player.data.playerGroup;

    player.spawn(new mp.Vector3(struct.group[x].groupIntX, struct.group[x].groupIntY, struct.group[x].groupIntZ));  
    player.heading = struct.group[x].groupIntHead;
    return;
});

mp.events.addCommand('gotohq', (player, id) => {
    if(!id) return sendUsage(player, '/gotohq [HQ id]'); 
    if(player.data.admin < 2) return player.outputChatBox("You don't have admin level 2.");
    if(id > loaded_groups_count || id < 1) return sendMessage(player, '009933', 'Invalid HQ ID.');

    player.position = new mp.Vector3(struct.group[id - 1].groupExitX, struct.group[id - 1].groupExitY, struct.group[id - 1].groupExitZ);
    sendAdmins('ff9900', `(Notice):!{ffffff} ${player.name} teleported to group ${struct.group[id - 1].groupName}.`);
}); 
  
mp.events.addCommand('setleader', (player, _, id, group) => {

    if(player.data.admin < 6) 
        return player.outputChatBox("You don't have admin level 6.");

    if(!id || !group) 
        return sendUsage(player, '/setleader [player] [group]');  

    if(group < 1 || group > loaded_groups_count) 
        return sendMessage(player, 'ffffff', `Group invalid, please use ID <1 - ${loaded_groups_count}>.`);

    const target = getNameOnNameID(id);

    group = group - 1;

    if(target == undefined) 
        return sendMessage(player, 'ffffff', 'Player not found.');
 
    if(target.data.playerGroup != -1)
        return sendMessage(player, 'ffffff', 'This player is already in a faction.');

    target.data.playerGroup = group;
    target.data.playerGroupRank = 7;

    //Update MYSQL  
    mysql_action('UPDATE `accounts` SET playerGroup = ?, playerGroupRank = ?, playerGroupFP = ?, playerGroupWarns = ?, playerGroupDays = ? WHERE username = ?', [target.data.playerGroup, 1, 0, 0, 0, target.name]); 
 
    sendMessage(target, 'ff3300', `(Info):!{ffffff} ${player.name} set you leader at faction [!{ff3300}${struct.group[group].groupName}!{ffffff}].`);
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} set ${target.name} leader at faction ${struct.group[group].groupName}.`);
});

mp.events.addCommand('factions', (player) => {
 
    let factionsString = '';
 
	for(let x = 0; x < loaded_groups_count; x ++)
	{
		factionsString += `<tr><td>${struct.group[x].groupID}</td><td>${struct.group[x].groupName}</td><td>${1}/${struct.group[x].groupMaxMembers}</td><td><button class="btn btn-warning btn-sm" onclick = "closePlayerFMenu(${x})">Find</button></td></tr>`; 
	}
 
	player.call("showPlayerFactions", [player, factionsString, loaded_groups_count]); 
});
  
mp.events.addCommand('invite', (player, id) => {

    if(player.data.playerGroup == -1)
        return sendMessage(player, 'ffffff', 'You are not in a faction.');

    if(!id) 
        return sendUsage(player, '/invite [player]');  
 
    const target = getNameOnNameID(id);

    if(target == undefined) 
        return sendMessage(player, 'ffffff', 'Player not found.');
 
    if(target.data.playerGroup != -1)
        return sendMessage(player, 'ffffff', 'This player is already in a faction.');

    if(target.data.playerGroupFP > 0)
        return sendMessage(player, 'ffffff', 'This player have faction punish.');
 
    target.setVariable('invitedFactionID', player.data.playerGroup);
    
    //Reseteaza invitatia dupa 15 secunde
    setTimeout(function () {
       
        target.setVariable('invitedInFaction', false);
    
    }, 15000);  
  
    sendMessage(target, '66b3ff', `(Faction):!{ffffff} ${player.name} invited you to join in faction !{66b3ff}${struct.group[player.data.playerGroup].groupName}!{ffffff} (use /accept invite ${player.id}).`);
    sendMessage(player, '66b3ff', `(Faction):!{ffffff} You invited ${target.name} to join in your factions, please waiting.`);
});

mp.events.addCommand('accept', (player, _, option, id) => {

    if(!id || !option)
    {
        sendUsage(player, '/accept [option] [player]');  
        sendMessage(player, '009999', '(Options):!{ffffff} invite.');
        return;
    } 

    //Definitions
    const target = getNameOnNameID(id);
    const x = player.getVariable('invitedFactionID'); 

    //Verifications
    if(target == undefined) 
        return sendMessage(player, 'ffffff', 'Player not found.');

    if(player.getVariable('invitedInFaction') == false)
        return sendMessage(player, 'ffffff', 'Your invitation for join in faction expired.');
  
    //Set variables
    player.data.playerGroup = x;
    player.data.playerGroupRank = 1;
    player.data.playerGroupDays = 0;
 
    //Update MYSQL  
    mysql_action('UPDATE `accounts` SET playerGroup = ? WHERE username = ?', [player.data.playerGroup, player.name]); 

    //Messages 
    sendToGroup(COLOR_GROUPS, player.data.playerGroup, `(Group):!{ffffff} ${player.name} joined in your faction (invited by ${target.name} [${target.id}]).`);
    sendMessage(player, '66b3ff', `(Info):!{ffffff} You joined in faction !{66b3ff}${struct.group[x].groupName}!{ffffff} (invited by ${target.name} [${target.id}]).`);
});

mp.events.addCommand('auninvite', (player, _, id, ...reason) => {
    reason = reason.join(" ");

    if(player.data.admin < 6) 
        return player.outputChatBox("You don't have admin level 6.");

    if(!id || !reason) 
        return sendUsage(player, '/auninvite [player] [reason]');  

    const target = getNameOnNameID(id);

    if(target == undefined) 
        return sendMessage(player, 'ffffff', 'Player not found.');

    if(target.data.playerGroup == -1)
        return sendMessage(player, 'ffffff', 'This player is not in faction.');
 
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${target.name} was unvited by admin ${player.name} [${player.id}] from faction ${struct.group[target.data.playerGroup].groupName} (rank ${target.data.playerGroupRank} days: ${target.data.playerGroupDays}) with 20 FP reason: ${reason}.`);
    sendMessage(target, 'ff3300', `(Auninvite):!{ffffff} Admin ${player.name} [${player.id}] uninvited you from faction ${struct.group[target.data.playerGroup].groupName} (rank ${target.data.playerGroupRank} days: ${target.data.playerGroupDays}) with 20 FP reason: ${reason}.`);
 
    target.data.playerGroup = -1;
    target.data.playerGroupRank = 0;
    target.data.playerGroupWarns = 0;
    target.data.playerGroupDays = 0;
    
    target.setVariable('playerDuty', 0);

    target.model = mp.joaat(player.data.skin); //Modifi player skin
    target.removeAllWeapons();
  
    //MYSQL  
    mysql_action('UPDATE `accounts` SET playerGroup = ?, playerGroupRank = ?, playerGroupWarns = ?, playerGroupDays = ? WHERE username = ?', [-1, 0, 0, 0, target.name]); 
});

 
/*   
    --------Propuneri factiuni generale--------
 
    - De bagat in /tog optiunile si pt factiuni 
    - de facut zilele la factiuni sa creasca
     
*/ 