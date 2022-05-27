const { parse } = require('path');
var struct = require('../struct.js');

const date = new Date();
const hour = date.getHours();
const min  = date.getMinutes(); 

require('../mysql.js');
require('../index.js');
 
//Loaded from database informations  
gm.mysql.handle.query('SELECT * FROM server_house', [], function (error, results, fields) {
	for(let i = 0; i < results.length; i++) {
		  
		struct.houses[i].houseOwner = results[i].owner;
        struct.houses[i].houseID = i + 1;
        
        struct.houses[i].housePrice = results[i].price;
        struct.houses[i].houseRent = results[i].rentPrice;
        struct.houses[i].houseBalance = results[i].balance;
        struct.houses[i].houseDescription = results[i].description;
        struct.houses[i].houseStatus = results[i].status;

        //exterior pos
		struct.houses[i].houseX = results[i].exitX;
		struct.houses[i].houseY = results[i].exitY;
        struct.houses[i].houseZ = results[i].exitZ;
        struct.houses[i].houseHeading = results[i].exitAngle;
 
        //int pos
		struct.houses[i].houseIntX = results[i].entX;
		struct.houses[i].houseIntY = results[i].entY;
        struct.houses[i].houseIntZ = results[i].entZ;
            
		struct.houses[i].house3DText = mp.labels.new(`House ${i + 1}\n~r~Status: ${struct.houses[i].houseStatus == 1 ? '~g~unlocked' : '~r~locked'}~s~\n~r~Owned by ~s~${struct.houses[i].houseOwner}\nPress ~r~[F]~s~ to interract\nPress ~r~[H]~s~ for informations`, new mp.Vector3(parseFloat(results[i].exitX), parseFloat(results[i].exitY), parseFloat(results[i].exitZ)),
		{
			los: true,
			font: 4,
			drawDistance: 10,
        });   
         
		struct.houses[i].house3DTextInt = mp.labels.new(`~g~[EXIT DOOR]~s~\nPress ~r~[F]~s~ to interract`, new mp.Vector3(results[i].entX, results[i].entY, results[i].entZ),
		{
			los: true,
			font: 4,
			drawDistance: 10,
		});   
 
		struct.houses[i].housePickup = mp.markers.new(1, new mp.Vector3(parseFloat(results[i].exitX), parseFloat(results[i].exitY), parseFloat(results[i].exitZ - 1.1)), 1,
		{
		    direction: new mp.Vector3(0, 0, 0),
		    rotation: new mp.Vector3(0, 0, 0),
		    visible: true,
		    dimension: 0
        });   

        struct.houses[i].houseBlip = mp.blips.new(411, new mp.Vector3(parseFloat(results[i].exitX), parseFloat(results[i].exitY), parseFloat(results[i].exitZ - 1.1)), {
            name: `${struct.houses[i].housePrice > 0 || struct.houses[i].houseOwner == "AdmBot" ? "~r~For sale (use /buyhouse)" : `Owner: ${struct.houses[i].houseOwner}`}`,
            scale: 0.8,
            color: 25,
            drawDistance: 5,
            shortRange: true,
            dimension: 0,
        });

        loaded_house_count ++;
    }
    
    console.log(`[MYSQL] Loaded houses: ${loaded_house_count.toString()}`);
});

//House interract
mp.events.add('interractHouse', (player) => {

    for(let x = 0; x < loaded_house_count; x++)
    { 
        if(player.IsInRange(struct.houses[x].houseX, struct.houses[x].houseY, struct.houses[x].houseZ, 3))
        {   
            interractHouse(player, x); 
            break;
        } 
    }
});


function interractHouse(player, x)
{
    player.setVariable('interractHouse', x);
    player.call("playerIntteractHouse", [x + 1, struct.houses[x].houseOwner, player.formatMoney(struct.houses[x].housePrice, 0), player.formatMoney(struct.houses[x].houseRent, 0), struct.houses[x].houseDescription]);
    return;
}
 
//Enter leave house
mp.events.add('commandEnterLeaveHouse', (player) => {

    for(let x = 0; x < loaded_house_count; x++)
    {
        //Enter in house
        if(player.IsInRange(struct.houses[x].houseX, struct.houses[x].houseY, struct.houses[x].houseZ, 3))
        {  
            if(struct.houses[x].houseStatus == 0)
            {
                if(player.getVariable('requestOnHouse') != x)
                { 
                    player.setVariable('requestOnHouse', x);
                    player.setVariable('requestTime', `${hour} : ${min < 10 ? `0${min}` : min}`);
  
                    //Update owner list request
                    updateOwnerList(x);

                    player.call("showNotification", [`Your request has been added to the list.`]);  
                } 
                break;;
            }
 
            player.data.houseEntered = x;
            player.dimension = x;
            player.position = new mp.Vector3(struct.houses[x].houseIntX, struct.houses[x].houseIntY, struct.houses[x].houseIntZ); 
            break;
        }

        //Exit from house
        if(player.IsInRange(struct.houses[x].houseIntX, struct.houses[x].houseIntY, struct.houses[x].houseIntZ, 3))
        {  
            player.data.houseEntered = -1;
            player.dimension = 0;
            player.position = new mp.Vector3(struct.houses[x].houseX, struct.houses[x].houseY, struct.houses[x].houseZ);
            player.heading = struct.houses[x].houseHeading; 
            break;
        }
    } 
});

mp.events.add("updateHouseLabel", (i) => {
 
    struct.houses[i].houseBlip.destroy();
    struct.houses[i].house3DText.destroy(); 
    
    struct.houses[i].house3DText = mp.labels.new(`House ${i + 1}\n~r~Status: ${struct.houses[i].houseStatus == 1 ? '~g~unlocked' : '~r~locked'}~s~\n~r~Owned by ~s~${struct.houses[i].houseOwner}\nPress ~r~[F]~s~ to interract\nPress ~r~[H]~s~ for informations`, new mp.Vector3(struct.houses[i].houseX, struct.houses[i].houseY, struct.houses[i].houseZ),
    {
        los: true,
        font: 4,
        drawDistance: 10,
    });   
  
    struct.houses[i].houseBlip = mp.blips.new(411, new mp.Vector3(parseFloat(struct.houses[i].houseX), parseFloat(struct.houses[i].houseY), parseFloat(struct.houses[i].houseZ - 1.1)), {
        name: `${struct.houses[i].housePrice > 0 || struct.houses[i].houseOwner == "AdmBot" ? "~r~For sale (use /buyhouse)" : `Owner: ${struct.houses[i].houseOwner}`}`,
        scale: 0.8,
        color: 25,
        drawDistance: 5,
        shortRange: true,
        dimension: 0,
    }); 
});

mp.events.add("saveHouse", (i) => {
  
    mysql_action('UPDATE `server_house` SET owner = ?, price = ?, rentPrice = ?, description = ? WHERE houseID = ? LIMIT 1', [struct.houses[i].houseOwner, struct.houses[i].housePrice, struct.houses[i].houseRent, struct.houses[i].houseDescription, struct.houses[i].houseID]); 
}); 

mp.events.addCommand('gotohouse', (player, id) => {
    if(player.data.admin < 2) 
        return player.outputChatBox("You don't have admin level 2.");

    if(!id) 
        return sendUsage(player, '/gotohouse [house id]'); 
     
    if(id > loaded_house_count || id < 1) 
        return sendMessage(player, '009933', 'Invalid house ID.');

    player.position = new mp.Vector3(struct.houses[id - 1].houseX, struct.houses[id - 1].houseY, struct.houses[id - 1].houseZ);
    sendAdmins('ff9900', `(Notice):!{ffffff} ${player.name} teleported to house ${id}.`); 
}); 
 
mp.events.addCommand('unrentroom', (player) => {

    const x = player.data.house;

    if(player.data.house == -1) return sendMessage(player, 'ffffff', `You don't have a house.`); 
    if(struct.houses[x].houseOwner == player.name) return sendMessage(player, 'ffffff', `Casa este detinuta de tine, foloseste [/sellhousetostate] pentru a o vinde.`); 
    
    player.data.house = -1;

    mysql_action('UPDATE `accounts` SET house = ? WHERE username = ? LIMIT 1', [-1, player.name]); 

    sendMessage(player, '00cc66', `(Rent):!{ffffff} You are no longer the tenant of this house.`);
});
 
mp.events.addCommand('findhouse', (player, id) => {
  
    if(!id) return sendUsage(player, '/findhouse [house id]');  
    if(id > loaded_house_count || id < 1) return sendMessage(player, '009933', 'Invalid house ID.');
  
    player.call("setPlayerCheckPoint", [player, struct.houses[id - 1].houseX, struct.houses[id - 1].houseY, struct.houses[id - 1].houseZ]);
    sendMessage(player, 'ff4d4d', `(Info):!{ffffff} A checkpoint was placed at house ${id}.`);
}); 
 
mp.events.addCommand('housemenu', (player) => { 

    accesingHouseMenu(player);
}); 

function accesingHouseMenu(player)
{
    const x = player.data.house;
    let rentersString = requestJoin = offersString = ''; 

    player.setVariable('menuHouseOpened', true);
    player.setVariable('interractHouse', player.data.house);
  
    gm.mysql.handle.query('SELECT * FROM `accounts` WHERE `house` = ?', [player.data.house], function (error, results, fields) {

        mp.players.forEach(players => {
            if(players.loggedInAs == true)
            { 
                if(players.getVariable('requestOnHouse') != -1 && players.getVariable('requestOnHouse') == x) 
                {  
                    requestJoin += `<tr><td><center>${players.id}</center></td><td><center>${players.name}</center></td><td><center><span class="badge badge-pill badge-warning">${players.getVariable('requestTime')}</span></center></td><td><center><button type = "button" class = "btn btn-outline-success btn-sm" onclick = "closePlayerHMenu(5, ${players.id});">Acces <i class="fa fa-check-circle" aria-hidden="true"></i></button>  <button type = "button" class = "btn btn-outline-danger btn-sm" onclick = "closePlayerHMenu(6, ${players.id});">Reject <i class="fa fa-times-circle-o" aria-hidden="true"></i></button></center></td></tr>`; 
                }   

                if(players.getVariable('houseOffered') == x)
                {                                                                                                               
                    offersString += `<tr><td><center>${players.id}</center></td><td><center>${players.name}</center></td><td><center><span class="badge badge-pill badge-warning">${players.getVariable('offerTime')}</span></center></td><td><center><span class="badge badge-pill badge-success">${players.formatMoney(players.getVariable('houseOfferedMoney'), 0)}$</span></center></td><td><center><button type = "button" class = "btn btn-outline-success btn-sm" onclick = "houseInterracts(3, ${players.id});">Accept <i class="fa fa-check-circle" aria-hidden="true"></i></button>  <button type = "button" class = "btn btn-outline-danger btn-sm" onclick = "houseInterracts(4, ${players.id});">Delete <i class="fa fa-times-circle-o" aria-hidden="true"></i></button></center></td></tr>`;
                }
            }
        }); 
 
        for(let i = 0; i < results.length; i++) 
        {
            rentersString += `<tr><td>${i + 1}</td><td>${results[i].username}</td><td>${results[i].level}</td></tr>`;  
        }
         
        player.call("showPlayerHouseMenu", [struct.houses[x].houseStatus, struct.houses[x].houseOwner, player.formatMoney(struct.houses[x].houseRent, 0), player.formatMoney(struct.houses[x].houseBalance, 0), struct.houses[x].houseDescription, results.length, rentersString, requestJoin, offersString]);
    });  
    return;
} 

function updateOwnerList(x) 
{
    const owner = getNameOnNameID(struct.houses[x].houseOwner);

    if(owner != undefined)
    { 
        if(owner.getVariable('menuHouseOpened') == true) 
        { 
            accesingHouseMenu(owner); 
        }
    } 
    return;
}
 
mp.events.add('playerPressHouseButton', (player, type, descriere, rentPrice, playerID) => { 
      
    //Variables
    const requester = getNameOnNameID(playerID);
    const house = requester.getVariable('requestOnHouse');
    const x = player.data.house;

    switch(type)
    {
        //Close menu
        case 0: 
        {
            player.setVariable('menuHouseOpened', false);
            break;  
        }

        //Lock house
        case 1:  
        { 
            struct.houses[x].houseStatus = (struct.houses[x].houseStatus == 1) ? (0) : (1); 
   
            player.call("showNotification", [`Your house is now ${(struct.houses[x].houseStatus == 1) ? (`<a style="color:green">unlocked</a>`) : (`<a style="color:red">locked</a>`)}.`]); 
            break;
        } 
        case 2: 
        {
            sendMessage(player, 'ff4d4d', `(House menu):!{ffffff} A checkpoint was placed at house ${x + 1}.`);
            
            player.call('setPlayerCheckPoint', [player, struct.houses[x].houseX, struct.houses[x].houseY, struct.houses[x].houseZ]); 
            break;
        } 
        case 3:
        {  
            struct.houses[x].houseDescription = descriere;  
            
            player.call("showNotification", [`Description edited: ${struct.houses[x].houseDescription}.`]); 
            break;
        }
        case 4:  
        {
            struct.houses[x].houseRent = rentPrice;    
 
            player.call("showNotification", [`Rent price edited: ${player.formatMoney(struct.houses[x].houseRent, 0)}$ [${rentPrice == 0 ? (`<a style="color:red">rent blocked</a>`) : (`<a style="color:green">rent allow</a>`)}].`]);   
            break;
        }  

        //Allow player request to join on your house
        case 5: 
        {
            if(requester == undefined)
                return player.call("showNotification", [`This player is not connected.`]);

            if(!requester.IsInRange(struct.houses[house].houseX, struct.houses[house].houseY, struct.houses[house].houseZ, 5))
                return player.call("showNotification", [`This player is not near the house.`]);
 
            //Set variable 
            requester.data.houseEntered = requester.dimension = house;
            requester.position = new mp.Vector3(struct.houses[house].houseIntX, struct.houses[house].houseIntY, struct.houses[house].houseIntZ);
       
            requester.setVariable('requestOnHouse', -1);
 
            //Send notiffications
            player.call("showNotification", [`You accepted ${requester.name} request to join in house.`]);
            requester.call("showNotification", [`${player.name} accepted your request to join in house.`]);
            break;
        }

        //Reject player request to join on your house
        case 6:
        { 
            if(requester == undefined)
                return player.call("showNotification", [`This player is not connected.`]);

            //Set variable
            requester.setVariable('requestOnHouse', -1);

            //Send notiffications
            player.call("showNotification", [`You rejected ${requester.name} request to join in house.`]);
            requester.call("showNotification", [`${player.name} rejected your request to join in house.`]);
            break;            
        }  
    }  
 
    if(type != 0) 
    {
        accesingHouseMenu(player);
        mp.events.call("updateHouseLabel", x);
    
        //Update informations in database 
        mysql_action('UPDATE `server_house` SET rentPrice = ?, status = ?, description = ? WHERE houseID = ? LIMIT 1', [struct.houses[x].houseRent, (struct.houses[x].houseStatus == 1) ? (0) : (1), struct.houses[x].houseDescription, struct.houses[x].houseID]);
    }
});
 
mp.events.add('houseInterractsSend', (player, button, offerPrice, playerID) => {

    const x = player.getVariable('interractHouse');
    const seller = getNameOnNameID(struct.houses[x].houseOwner);
    const bidder = getNameOnNameID(playerID);
 
    switch(button)
    {
        case 0: break;

        //Buy house
        case 1:
        {   
            //Veriffications
            if(struct.houses[x].housePrice <= 0)
                return player.call("showNotification", ["This house is not for sale."]); 

            if(player.data.house != -1)
                return player.call("showNotification", ["You already have a house."]); 

            if(player.data.money < struct.houses[x].housePrice)
                return player.call("showNotification", ["You don`t have this money."]); 

            if(seller != undefined)
            { 
                //HIDE HOUSE MENU  
                if(seller.getVariable('menuHouseOpened') == true)
                {
                    seller.setVariable('menuHouseOpened', false);
                    seller.call("closePlayerHouseMenu", [0]); 
                } 
 
                //VARIABLE
                seller.data.house = -1;
 
                //GIVE MONEY
                seller.giveMoney(0, struct.houses[x].housePrice); 

                //MESSAGE
                sendMessage(seller, 'ff4d4d', `(Info):!{ffffff} ${player.name} bought your house for ${player.formatMoney(struct.houses[x].housePrice, 0)}$.`);  
            }
            else 
            {  
                //MYSQL
                mysql_action('UPDATE `accounts` SET money = money + ?, house = ? WHERE username = ?', [struct.houses[x].housePrice, -1, struct.houses[x].houseOwner]); 
            }
 
            //TAKE MONEY
            player.giveMoney(1, struct.houses[x].housePrice);

            //Send message
            sendMessage(player, 'ff4d4d', `(Info):!{ffffff} You bought house ${x + 1} for price ${player.formatMoney(struct.houses[x].housePrice, 0)}$ rent: ${struct.houses[x].houseRent}.`); 

            //MYSQL & VARIABLE
            player.data.house = x; 
            mysql_action('UPDATE `accounts` SET house = ? WHERE username = ?', [player.data.house, player.name]); 

            //HOUSE UPDATE
            struct.houses[x].houseOwner = player.name;
            struct.houses[x].housePrice = 0;

            //UPDATE HOUSE LABEL
            mp.events.call("updateHouseLabel", x);
            
            //MYSQL
            mysql_action('UPDATE `server_house` SET owner = ?, price = ? WHERE houseID = ? LIMIT 1', [struct.houses[x].houseOwner, struct.houses[x].housePrice, struct.houses[x].houseID]); 

            //Update CEF
            interractHouse(player, player.getVariable('interractHouse'));
            break;
        }

        //Create house offer
        case 2:
        {
            //Veriffications
            if(player.data.house != -1)
                return player.call("showNotification", ["You already have a house."]); 


            //Set variables
            player.setVariable('houseOffered', x);
            player.setVariable('houseOfferedMoney', offerPrice);
            player.setVariable('offerTime', `${hour} : ${min < 10 ? `0${min}` : min}`);

            //Update CEF for owener (if this is active)
            updateOwnerList(x);
 
            //Notiffications 
			sendMessage(player, 'FFFFFF', `-------------------!{ff4d4d}(House offer):!{ffffff}-------------------`);
			sendMessage(player, 'FFFFFF', `You created an offer for house [!{ff4d4d}${x + 1}!{ffffff}] worth !{ff4d4d}${player.formatMoney(offerPrice, 0)}!{ffffff}$.`);  
            sendMessage(player, 'FFFFFF', `Please wait until the owner accepts it (!{ff4d4d}if you disconnect, offer expires!{ffffff}).`);  
			sendMessage(player, 'FFFFFF', `------------------------------------------------------`);  
            break;
        } 

        //Accept player house offer
        case 3:
        { 
            //Veriffications
            if(bidder == undefined)
                return player.call("showNotification", [`This player is not connected.`]);
  
            const money = bidder.getVariable('houseOfferedMoney');
  
            //Give money
            player.giveMoney(0, money);  
            if(bidder != undefined) bidder.giveMoney(1, money); 

            //RESET HOUSE OFFER
            bidder.setVariable('houseOffered', -1);
            bidder.setVariable('houseOfferedMoney', 0);
            bidder.setVariable('offerTime', 0);

            //UPDATE VARIABLES
            player.data.house = -1;
            bidder.data.house = x;

            //MYSQL
            mysql_action('UPDATE `accounts` SET house = ? WHERE username = ? LIMIT 1', [-1, player.name]); 
            mysql_action('UPDATE `accounts` SET house = ? WHERE username = ? LIMIT 1', [x, bidder.name]); 

            //SET HOUSE VARIABLES 
            struct.houses[x].housePrice = 0;
            struct.houses[x].houseOwner = bidder.name;

            //UPDATE HOUSE LABEL
            mp.events.call("updateHouseLabel", x); 

            //UPDATE MYSQL HOUSE LABEL
            mysql_action('UPDATE `server_house` SET owner = ?, price = ? WHERE houseID = ? LIMIT 1', [bidder.name, 0, struct.houses[x].houseID]); 
 
            //Notiffications
            player.call("showNotification", [`You accepted ${bidder.name} offer for your house [${x + 1}]. ${money}`]); 
            bidder.call("showNotification", [`${player.name} accepted your offer for his house [${x + 1}]. ${money}`]); 
            
            //HIDE HOUSE MENU  
            if(player.getVariable('menuHouseOpened') == true)
            {
                player.setVariable('menuHouseOpened', false);
                player.call("closePlayerHouseMenu", [0]); 
            } 
            break;
        }
        case 4:
        {  
            //Veriffications
            if(bidder == undefined)
                return player.call("showNotification", [`This player is not connected.`]);
 
            //Reset variables
            bidder.setVariable('houseOffered', -1);
            bidder.setVariable('houseOfferedMoney', 0);
            bidder.setVariable('offerTime', '');

            //Update CEF for owner (if this is active)
            updateOwnerList(x);

            //Notiffications
            player.call("showNotification", [`You declined ${bidder.name} offer for your house [${x + 1}].`]); 
            bidder.call("showNotification", [`${player.name} declined your offer for his house [${x + 1}].`]); 
            break;
        } 

        //Rent house
        case 5:
        {   
            //Veriffications
            if(struct.houses[x].houseRent == 0) 
                return player.call("showNotification", [`This house is not for rent.`]);
 
            player.data.house = x;

            //Update database   
            mysql_action('UPDATE `accounts` SET house = ? WHERE username = ?', [x, player.name]); 
 
            //Update CEF for owner (if this is active)
            updateOwnerList(x);

            //Notiffications
            player.call("showNotification", [`You rent house [${x + 1}] for ${struct.houses[x].houseRent}$.`]);  
            break;
        } 
    }  
});