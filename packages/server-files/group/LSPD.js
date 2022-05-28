require('../mysql.js');
require('../index.js');

const struct = require('../struct.js'); 
const copsArms = [ 
    ['weapon_pistol'],
    ['weapon_nightstick'],
    ['weapon_assaultrifle'],
    ['weapon_compactrifle'] 
]
 
//Group LSPD
function giveCopsWeapon(player, type)
{
    switch(type)
    {
        case 0:
        {
            for(let x = 0; x <= 3; x++) player.giveWeapon(mp.joaat(copsArms[x]), 1000);
            break;
        }
        case 1:
        {
            player.removeAllWeapons();
        }
    }
}

mp.events.addCommand('duty', (player) => {

    if(player.data.playerGroup == -1)
        return sendMessage(player, 'ffffff', 'You are not in a faction.');

    if(player.data.playerGroup != 0) 
        return sendMessage(player, 'ffffff', 'You are not in a faction Los Santos Police Department.');
 
    player.setVariable('playerDuty', !player.getVariable('playerDuty')); //Switch variable

    player.model = mp.joaat((player.getVariable('playerDuty') == 1) ? ("s_m_y_cop_01") : (player.data.skin)); //Modifi player skin
    giveCopsWeapon(player, (player.getVariable('playerDuty') == 1) ? (0) : (1)); //Give | remove player weapons
    sendMessage(player, 'ff5050', `(Duty)!{ffffff} You are now ${(player.getVariable('playerDuty') == 1) ? ("on duty") : ("off duty")} in your faction.`); //Send player message
});

mp.events.addCommand('r', (player, message) => {
     
    if(player.data.playerGroup == -1)
        return sendMessage(player, 'ffffff', 'You are not in a faction.');

    if(player.data.playerGroup != 0) 
        return sendMessage(player, 'ffffff', 'You are not in a faction Los Santos Police Department.');

    if(!message) 
        return sendUsage(player, '/r [text]');  

    sendToGroup(COLOR_RADIO, player.data.playerGroup, `(/r) ${player.name} [${player.id}]: ${message}`);
});
  
mp.events.addCommand('d', (player, message) => {
     
    if(player.data.playerGroup == -1)
        return sendMessage(player, 'ffffff', 'You are not in a faction.');

    if(player.data.playerGroup != 0) 
        return sendMessage(player, 'ffffff', "You're not in a police department");

    if(!message) 
        return sendUsage(player, '/d [text]');  

    sendToGroup(COLOR_DEPARTMENT, 0, `${(player.data.group == 0) ? ("LVPD") : ("")} Rank ${player.data.playerGroupRank} ${player.name} [${player.id}]: ${message}`); 
});
 
mp.events.addCommand('cuff', (player, id) => {
     
    if(player.data.playerGroup == -1)
        return sendMessage(player, 'ffffff', 'You are not in a faction.');

    if(player.data.playerGroup != 0) 
        return sendMessage(player, 'ffffff', "You're not in a police department");

    if(!id) 
        return sendUsage(player, '/cuff [player]');  

    const target = getNameOnNameID(id);

    if(target == undefined) 
        return sendMessage(player, 'ffffff', 'Player not found.');

    target.setVariable('playerCuffed', true);
    target.playAnimation('mp_arresting', 'idle', 1, 49); //Problema, daca trece prin usi ii scoate animatia, o sa fac timer
 
    sendToGroup(COLOR_DEPARTMENT, 0, `${target.name} [${target.id}] has been handcuffed by ${player.name} [${player.id}].`); 
});
 
mp.events.addCommand('uncuff', (player, id) => {
     
    if(player.data.playerGroup == -1)
        return sendMessage(player, 'ffffff', 'You are not in a faction.');

    if(player.data.playerGroup != 0) 
        return sendMessage(player, 'ffffff', "You're not in a police department");

    if(!id) 
        return sendUsage(player, '/uncuff [player]');  

    const target = getNameOnNameID(id);

    if(target == undefined) 
        return sendMessage(player, 'ffffff', 'Player not found.');

    if(target.getVariable('playerCuffed') == false)
        return sendMessage(player, 'ffffff', 'This player is not cuffed.');

    target.setVariable('playerCuffed', false);
    target.stopAnimation();
 
    sendToGroup(COLOR_DEPARTMENT, 0, `${target.name} [${target.id}] has been uncuffed by ${player.name} [${player.id}].`); 
});

//--------------------------------------------------------------------------------------------------------------[FACTION MENU SISTEM]-----------------------------------------------------------------------------------------------------------------------------------------------------------------

//EXECUTE FUNCTION 
mp.events.add('givePlayerWanted', (player, wanted, wantedReason, caller) => { 
 
    //Player wanteds
    player.data.playerWanted += wanted;
    player.data.playerWantedTime = 300;
    player.data.playerWantedCrimes = wantedReason;
    player.data.playerCrimesTime = getDates();
    player.data.playerCrimeCaller = caller;
  
    //MYSQL  
    mysql_action('UPDATE `accounts` SET wanted = ?, wantedTime = ?, wantedCrimes = ?, wantedCrimeTime = ?, wantedCaller = ? WHERE username = ? LIMIT 1', [player.data.playerWanted, player.data.playerWantedTime, player.data.playerWantedCrimes, player.data.playerCrimesTime, player.data.playerCrimeCaller, player.name]); 
    
    //EDIT HUD WANTED LEVEL
    player.call("edit_wantedLevel", [player.data.playerWanted, player.data.playerWantedTime]);
 
    //Reload player CEF / reload for all cops 
    onReloadCefCops();      
});
 
mp.events.add('updaMemberStatistics2', (player, memberName, buttonSelect, count) => { 
 
    const member = getNameOnNameID(memberName);
    const variable = [
        ['faction warn', 'playerGroupWarns'], 
        ['faction punish', 'playerGroupFP'], 
        ['rank', 'playerGroupRank']
    ];
      
    if(!count || count < 0)
        return player.call("showNotification", [`Please enter valid value (0 - 7).`]);

    if(member != undefined)
    {
        //EDIT IN GAME
        switch(buttonSelect)
        {
            case 0: member.data.playerGroupWarns = count; break;
            case 1: member.data.playerGroupFP    = count; break;
            case 2: member.data.playerGroupRank  = count; break;
        } 

        //SEND MESSAGES
        sendMessage(member, '3399ff', `(Group):!{ffffff} ${player.name} [${player.id}] edit your ${variable[buttonSelect][0]} in [!{ff6600}${count}!{ffffff}].`);
    }
 
    //UPDATE DATABASE 
    mysql_action(`UPDATE accounts SET ${variable[buttonSelect][1]} = ? WHERE username = ?`, [count, memberName]); 

    //SEND MESSAGES  
    sendToGroup('3399ff', player.data.playerGroup, `(Group):!{ffffff} ${player.name} [${player.id}] edit ${memberName} ${variable[buttonSelect][0]} in [!{ff6600}${count}!{ffffff}].`);
 
    //RELOAD CEF
    gm.mysql.handle.query('SELECT * FROM `accounts` WHERE `username` = ? LIMIT 1', [memberName], function(err, results) {   
        if(err) 
        {
            console.log(err);
            player.call("showNotification", [`[ERROR]: Please try again.`]);
            return;
        } 

        player.call("openFactionModal", [0, results[0].id, results[0].username, results[0].playerGroupRank, results[0].playerGroupWarns, results[0].playerGroupFP]);
    });   
});

function reloadMemberInfo(player, playerID, x)
{
    gm.mysql.handle.query('SELECT * FROM `accounts` WHERE `id` = ? LIMIT 1', [playerID], function(err, results) {   
        if(err) 
        {
            console.log(err);
            player.call("showNotification", [`[ERROR]: Please try again.`]);
            return;
        } 

        player.call("openFactionModal", [x, results[0].id, results[0].username, results[0].playerGroupRank, results[0].playerGroupWarns, results[0].playerGroupFP]);
    });   
}
 
mp.events.add('playerManagerExecute', (player, button, playerID, ticketMember, ticketReason, wantedMember, wantedReason, wantedAmount, playerSearch, licenseID, licenseTime, uninviteFP, uninviteReason) => { 
    
    const licenseNames = [['driving'], ['weapon'], ['boat'], ['fly']];
    
    switch(button)
    { 
        //Close CEF
        case 0: 
        { 
            player.setVariable('playerMenuOpen', false);
            break;
        }

        //Send ticket
        case 1:  
        {   
            const targetID = getNameOnNameID(ticketMember);
            let ticketValue = 0;
     
            if(targetID == undefined)
                return player.call("showNotification", [`This player is not connected.`]);
 
            if(ticketReason == 'Driving a vehicle without a registration number.') ticketValue = 1000;
            if(ticketReason == 'Possession of anti-radar devices.') ticketValue = 2000;
            if(ticketReason == 'Drunk driving.') ticketValue = 3000;
 
            //Send messages 
            player.call("showNotification", [`You sent ${ticketMember} a fine of ${player.formatMoney(ticketValue, 0)}$`]);
            sendMessage(player, '3399ff', `(Ticket):!{ffffff} You send a ticket to ${targetID.name} worth !{009933}${player.formatMoney(ticketValue, 0)}!{ffffff}$ reason: ${ticketReason}.`);
            sendMessage(targetID, '3399ff', `(Ticket):!{ffffff} You received a ticket from ${player.name} worth !{009933}${player.formatMoney(ticketValue, 0)}!{ffffff}$ (use /tickets for see them).`);
               
            //Update MYSQL  
            gm.mysql.handle.query('INSERT INTO `player_police_tickets` SET ticketMember = ?, ticketCop = ?, ticketReason = ?, ticketPrice = ?, ticketMemberSQL = ?, ticketDate = ?', [targetID.name, player.name, ticketReason, ticketValue, targetID.data.sqlid, getDates()], function(err, res) {

                if(err)
                {
                    console.log(`Error: ${err}`);
                    player.call("showNotification", [`[ERROR]: Please try again.`]);
                    return;
                }
                      
                //Reload player CEF / reload for all cops 
                onReloadCefCops(); 
            }); 
            break;
        }

        //Give wanted
        case 2:
        {
            const targetID = getNameOnNameID(wantedMember);
          
            if(targetID == undefined)
                return player.call("showNotification", [`This player is not connected.`]);
  
            //Send wanted
            mp.events.call("givePlayerWanted", targetID, wantedAmount, wantedReason, player.name); 
 
            //Send notiffication
            player.call("showNotification", [`Wanted created for ${targetID.name} [ID: ${targetID.id}].`]);
          
            sendToGroup('ff3333', player.data.playerGroup, `(Wanted):!{ffffff} ${targetID.name} [${targetID.id}] comited new crime ${wantedReason} (!{ff6666}wanted: ${wantedAmount}!{ffffff}) raported by ${player.name} [${player.id}].`);
            sendMessage(targetID, 'ff3333', `(Wanted):!{ffffff} You received new wanted raported by ${player.name} [${player.id}] wanted reason ${wantedReason} (!{ff6666}wanted: ${wantedAmount}!{ffffff}).`);
            break;
        }
  
        //Delete ticket
        case 3:
        {  
            //MYSQL
            mysql_action('DELETE FROM `player_police_tickets` WHERE ticketID = ?', [playerID]); 

            //Notiffication
            player.call("showNotification", [`Ticket deleted successfully.`]);

            //Reload player CEF / reload for all cops 
            onReloadCefCops(); 
            break;
        }

        //Search member 
        case 4: 
        {
            const targetID = getNameOnNameID(playerSearch);
          
            if(targetID == undefined)
                return player.call("showNotification", [`This player is not connected.`]);
 
            player.call("searchResolution", [targetID.id, targetID.name, targetID.data.drivingLicense, targetID.data.playerWanted, targetID.data.playerCrimes, targetID.data.playerArrests]);
            break; 
        }

        //Take license
        case 5:
        {   
            const targetID = getNameOnNameID(playerID);

            if(targetID == undefined)
                return player.call("showNotification", [`This player is not connected.`]);
  
            //MYSQL Update
            targetID.data.drivingLicense = 0;  
            mysql_action('UPDATE `accounts` SET drivingLicense = ? WHERE username = ?', [0, targetID.name]); 
            
            //Messages
            sendMessage(targetID, 'ff3333', `(License suspend):!{ffffff} ${player.name} [${player.id}] suspend your ${licenseNames[licenseID]} license.`); 
            player.call("showNotification", [`${targetID.name} [${targetID.id}] ${licenseNames[licenseID]} license was suspended.`]); 

            //Reload player CEF / reload for all cops 
            player.call("searchResolution", [targetID.id, targetID.name, targetID.data.drivingLicense, targetID.data.playerWanted, targetID.data.playerCrimes, targetID.data.playerArrests]);
            break;
        }

        //Give license
        case 6:
        {
            const targetID = getNameOnNameID(playerID);

            if(targetID == undefined)
                return player.call("showNotification", [`This player is not connected.`]);
  
            //MYSQL Update
            targetID.data.drivingLicense = licenseTime; 
            mysql_action('UPDATE `accounts` SET drivingLicense = ? WHERE username = ?', [licenseTime, targetID.name]); 

            //Messages
            sendMessage(targetID, 'ff3333', `(License update):!{ffffff} ${player.name} [${player.id}] update your ${licenseNames[licenseID]} license in ${licenseTime}h`); 
            player.call("showNotification", [`I-ai setat lui ${targetID.name} licenta in ${licenseTime}`]);

            //Reload player CEF / reload for all cops 
            player.call("searchResolution", [targetID.id, targetID.name, targetID.data.drivingLicense, targetID.data.playerWanted, targetID.data.playerCrimes, targetID.data.playerArrests]);
            break;
        }

        //Find player
        case 7:
        {
            const targetID = getNameOnNameID(playerID);

            setPlayerFind(player, targetID); 
            break;
        }

        //De facut
        case 8:
        {
            break;
        } 

        //Clear player wanted
        case 9:
        { 
            const targetID = getNameOnNameID(playerID);
 
            if(targetID == undefined)
                return player.call("showNotification", [`This player left server [error].`]);
     
            //Reset player variables
            targetID.data.playerWanted = targetID.data.playerWantedTime = targetID.data.playerCrimesTime = 0;
            targetID.data.playerWantedCrimes = targetID.data.playerCrimeCaller = '';
 
            //Update MYSQL 
            mysql_action('UPDATE `accounts` SET wanted = ?, wantedTime = ?, wantedCrimes = ?, wantedCrimeTime = ?, wantedCaller = ? WHERE username = ? LIMIT 1', [0, 0, '', '', '', targetID.name]); 

            //Reload player CEF / reload for all cops 
            onReloadCefCops(); 

            //REMOVE HUD
            targetID.call("edit_wantedLevel", [targetID.data.playerWanted, targetID.data.playerWantedTime]);

            //Send players messages
            player.call("showNotification", [`You cleared ${targetID.name} [${targetID.id}] wanted successfully.`]);
            sendMessage(player, '3399ff', `(Wanted):!{ffffff} You cleared ${targetID.name} [${targetID.id}] wanted successfully.`);
            sendMessage(targetID, '3399ff', `(Wanted):!{ffffff} ${player.name} [${player.id}] cleared your wanted.`);
            sendToGroupID(COLOR_DEPARTMENT, 0, `(Clear wanted):!{ffffff} ${player.name} [${player.id}] cleared ${targetID.name}'s [${targetID.id}] wanted successfully.`);
            break;
        } 

        //Uninvite member
        case 10:
        { 
            const targetID = getNameOnNameID(playerID);

            //MYSQL UPDATE 
            mysql_action('UPDATE `accounts` SET playerGroup = ?, playerGroupRank = ?, playerGroupFP = ?, playerGroupWarns = ?, playerGroupDays = ? WHERE id = ? LIMIT 1', [-1, 0, uninviteFP, 0, 0, playerID]); 
  
            //IN GAME UPDATE 
            if(targetID != undefined)
            {
                if(targetID.data.sqlid == playerID && targetID.data.playerGroup == player.data.playerGroup)
                { 
                    targetID.data.playerGroup = -1;
                    targetID.data.playerGroupFP = uninviteFP;

                    targetID.data.playerGroupRank = targetID.data.playerGroupWarns = targetID.data.playerGroupDays = -1;
                    player.call("showNotification", [`You uninvited [${targetID.name}] with ${uninviteFP} reason: ${uninviteReason}`]);
                } 
            }
               
            //RELOAD CEF
            onReloadCefCops();  
             
            //Notiffication
            player.call("showNotification", [`You uninvited this member`]);
            break;
        }

        //View member informations
        case 11:
        { 
            reloadMemberInfo(player, playerID, 0);
            break;
        }

        //Uninvite member 
        case 12:
        {
            reloadMemberInfo(player, playerID, 1);
            break;
        }    
    } 
});
 
 
function setPlayerFind(player, finding)
{
    //player - cel ce acceseaza find-ul
    //finding - cel pe care se pune checkpointul

    //Set variable
    player.setVariable('playerFind', finding);
    player.haveCheckpoint = true;
 
    //Set checkpoint 
    player.call('setPlayerCheckPoint', [player, finding.position.x, finding.position.y, finding.position.z, `${finding.name} [${finding.id}]`]);  
}

mp.events.addCommand('find', (player, id) => { 
 
    if(!id) 
        return sendUsage(player, '/cuff [player]');  

    const target = getNameOnNameID(id);

    if(target == undefined) 
        return sendMessage(player, 'ffffff', 'Player not found.');


    setPlayerFind(player, target);
}); 


mp.events.addCommand('killcp', (player) => { 

    if(!player.haveCheckpoint)
        return player.call("showNotification", [`You dont have a checkpoint.`]);
 
    player.haveCheckpoint = false;
    player.setVariable('playerFind', -1); 

    player.call("destroy_checkpoint", []);  

    player.call("one_find_hud", [0]);


    sendMessage(player, '00cc99', `(Checkpoint):!{ffffff} You destroyed checkpoint.`); 
    
}); 
 
setInterval(() => {
  
    mp.players.forEach(player => {

        if(player.loggedInAs == true)
        { 
            //UPDATE VEHICLE ODOMETER
            update_vehicle_odometer(player);
    
            //UPDATE PLAYER WANTED LEVEL
            if(player.data.playerWantedTime > 0) 
            { 
                player.data.playerWantedTime --;

                if(player.data.playerWantedTime == 0 && player.data.playerWanted > 0)
                {
                    player.data.playerWanted --;
                    
                    player.data.playerWantedTime = 300;
                }

                //EDIT HUD WANTED LEVEL
                player.call("edit_wantedLevel", [player.data.playerWanted, player.data.playerWantedTime]);
            }
    
            //UPDATE PLAYER FIND CHECKPOINT
            if(player.haveCheckpoint == true)
            { 
                const user = player.getVariable('playerFind');

                if(user != -1)
                {     
                    const dist = player.dist(user.position);
    
                    player.call('set_find_checkpoint', [player, dist, user.position.x, user.position.y, user.position.z, `${user.name} [${user.id}]`]);  
                } 
            } 

            //Mute sistem
            if(player.data.mute > 0) player.data.mute -= parseInt(1);
            
            //Rent vehicle time
            if(player.getVariable('vehicleRentedTime') > 0) mp.events.call("timerRentVehicle", player);  
        }
    });  
}, 1000);
 

//RELOAD CEF
function onReloadCefCops()
{
    mp.players.forEach(cops => {

        if(cops.loggedInAs == true && cops.getVariable('playerMenuOpen') == true)
        {
            loadLSPDManager(cops);  
        } 
    }); 
}

//OPEN FACTION MENU
mp.events.addCommand('menu', (player) => { 
 
    player.setVariable('playerMenuOpen', true);

    loadLSPDManager(player);
}); 

function loadLSPDManager(player)
{ 
    let wantedsString = ticketsString = membersString = ''; 
 
    mp.players.forEach(x => {
        if(x.loggedInAs == true && x.data.playerWanted > 0)
        { 
           
            wantedsString += `<tr><td>${x.data.playerCrimesTime}</td><td>${x.data.playerCrimeCaller}</td><td>${x.name} <a style="color:#ff4d4d;">(wanted ${x.data.playerWanted})</a></td><td>${x.data.playerWantedCrimes}</td><td><button class="btn btn-primary btn-sm" type="button" onclick = "callButtonManager(7, ${x.id});">Find <i class="fa fa-location-arrow" aria-hidden="true"></i></button> <button class="btn btn-danger btn-sm" type="button" onclick = "callButtonManager(9, ${x.id});">Clear <i class="fa fa-times" aria-hidden="true"></i></button></td></tr>`
        }   
    });
 
    gm.mysql.handle.query('SELECT * FROM `accounts` WHERE `playerGroup` = ?', [player.data.playerGroup], function(err, results) {   
        for(let i = 0; i < results.length; i++) 
        { 
            membersString += `<tr><td>${i + 1}</td><td>${results[i].username}</td><td>${results[i].playerGroupRank}</td><td><a style="color:#2eb82e;">${results[i].playerGroupWarns}</a> / <a style="color:#ff3333;">3</a> | <a style="color:#2eb82e;">${results[i].playerGroupFP}</a> / <a style="color:#ff3333;">30</a></td><td><button class = "btn btn-primary btn-sm" type = "button" onclick = "callButtonManager(11, ${results[i].id});">Details <i class="fa fa-chevron-circle-down" aria-hidden="true"></i></button> <button class = "btn btn-danger btn-sm" type = "button" onclick = "callButtonManager(12, ${results[i].id});">Uninvite <i class="fa fa-user-times" aria-hidden="true"></i></button></td></tr>`;  
        }    

        gm.mysql.handle.query('SELECT * FROM `player_police_tickets`', [], function(err2, results2) { 
            for(let x = 0; x < results2.length; x++) 
            {  
                ticketsString += `<tr><td>${results2[x].ticketCop}</td><td>${results2[x].ticketMember}</td><td>${player.formatMoney(results2[x].ticketPrice, 0)}<a style="color:#00cc99;">$</a></td><td>${results2[x].ticketReason}.</td><td>${results2[x].ticketStatus == 1 ? ('<span class = "badge badge-pill badge-success">payed</span>') : ('<span class="badge badge-pill badge-danger">unpaid</span>')}</td><td><button class = "btn btn-danger btn-sm" type = "button" onclick = "callButtonManager(3, ${results2[x].ticketID});">Delete ticket <i class="fa fa-trash" aria-hidden="true"></i></button></td></tr>`;  
            }    
            player.call("showManagerLSPD", [player.data.playerGroup, wantedsString, ticketsString, membersString, struct.group[player.data.playerGroup].groupName]); 
        });   
    });    
    return;
}
 
//--------------------------------------------------------------------------------------------------------------[TICKETS SISTEM]-----------------------------------------------------------------------------------------------------------------------------------------------------------------
mp.events.addCommand('tickets', (player) => { 

    createBrowserTickets(player);
}); 

function createBrowserTickets(player)
{
    let playerTickets = ''; 
    let payedTickets = 0;
 
    gm.mysql.handle.query('SELECT * FROM `player_police_tickets` WHERE `ticketMemberSQL` = ?', [player.data.sqlid], function(error, results) { 
        for(let x = 0; x < results.length; x++) {
 
            if(results[x].ticketStatus == 1) payedTickets ++;
 
            playerTickets += `<tr><td>${results[x].ticketCop}</td><td>${player.formatMoney(results[x].ticketPrice, 0)}<a style="color:#00cc99;">$</a></td><td>${results[x].ticketReason}</td><td>${results[x].ticketDate}</td><td>${results[x].ticketStatus == 1 ? ('<span class = "badge badge-pill badge-success">payed</span>') : ('<span class="badge badge-pill badge-danger">unpaid</span>')}</td><td>${results[x].ticketStatus == 0 ? (`<button class = "btn btn-outline-success btn-sm" type = "button" onclick = "playerTicketF(1, ${results[x].ticketID}, ${results[x].ticketPrice});">Pay <i class="fa fa-check-square" aria-hidden="true"></i></button>`) : ('<button class = "btn btn-outline-secondary btn-sm" type = "button">----</button>')}</td></tr>`;  
        }  

        if(!results.length)
            return player.call("showNotification", [`You dont have tickets.`]);
         
        player.call("showPlayerTickets", [playerTickets, `<h3>Welcome back, ${player.name}</h3>You have <a style="color:#ff3333;">${results.length}</a> tickets (<a style="color:#00cc99;">${payedTickets} paid</a>)`]); 
    });  
}

mp.events.add('playerPayTicket', (player, button, ticketID, ticketPrice) => { 
    switch(button)
    {
        case 0: break; 
        default:
        { 
            //MYSQL
            mysql_action('UPDATE `player_police_tickets` SET `ticketStatus` = ? WHERE ticketID = ? LIMIT 1', [1, ticketID]); 

            //MESSAGE
            sendMessage(player, '00cc99', `(Ticket pay):!{ffffff} You paid for ticket [${ticketID}] worth  $!{00cc99}${player.formatMoney(ticketPrice, 0)}!{ffffff}.`); 

            //Remove money 
            player.giveMoney(1, ticketPrice); 
             
            //Reload player CEF / reload for all cops 
            onReloadCefCops(); 

            //Reload CEF for player
            createBrowserTickets(player);
            break;
        } 
    }
});













   
/*   
    --------Propuneri LSPD--------
  
    - De bagat /arrest 
    - De bagat /mdc  
    - De bagat sistem de wanted la player
*/ 

/*
    --------Updates--------

    - Adaugate mesaje pentru membrii din factiunea ta cand te loghezi
    - Adaugata comanda /invite si /accept invite [player]
    - Adaugata comanda /auninvite pentru adminii level 6+ 

    Factions sistem (LSPD):
        - load from database
        - command /factions to view server factions
        - acum daca ai factiune te spawneaza la ea (urmeaza sa bag si /spawnchange)
        - adaugata comanda /duty
        - adaugata comanda /r
        - adaugata comanda /setleader pentru adminii level 6+
        - adaugata comanda /d pentru cei din departamente
        - adaugata comanda /cuff respectiv /uncuff
        - adaugata comanda /tickets pentru playeri
        - adaugata functia givePlayerWanted pentru a da wanted


    Cef Global factiuni
        - Terminata partea de incarcare a membrilor, ticketelor, amenzilor
        - Terminata partea de tickete
        - Terminata partea de give wanted (mai am sa ii dea stelele)
        - Facuta partea de clear wanted
        - Facuta partea de find wanted
        - Facuta partea de set and take license
        
        - Terminata partea de member uninvite
        - Terminata partea de view members 
            - De facut butoanele set rank, set fw, set fp
        - 
*/ 

/*


  if(player.info.prisonTime && player.info.prisonTime != 0) {
    let jailCells = [
      [459.784, -994.225, 24.915, 280.496], // jail1 (ped)
      [459.431, -998.052, 24.915, 273.883], // jail2 (ped)
      [459.310, -1001.653, 24.915, 262.609] // jail3 (ped)
    ]
    let cell = jailCells[Math.floor(Math.random() * jailCells.length)];
    player.spawn(new mp.Vector3(cell[0], cell[1], cell[2]));
    player.position = new mp.Vector3(cell[0], cell[1], cell[2]);
    player.health = 100;
    player.armour = 0;
    player.model = player.info.character.model;
    mp.events.call("loadClothes", player);
    return false;
  }

 */ 