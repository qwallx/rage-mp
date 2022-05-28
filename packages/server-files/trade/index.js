var mysql = require('mysql');   
var timer_global = null;   
var timer_global_seconds = 0;
 
mp.events.addCommand('trade', (player, target) => { 
    
    if(player.data.admin < 2) 
        return player.staffPerms(2);

    if(!target) 
        return sendUsage(player, '/trade [player]'); 

    const user = getNameOnNameID(target); 
    if(user === undefined) 
        return player.outputChatBox("There is no player online with the ID given.");
  
    player.sender = user;
    user.sender = player;
 
    sendMessage(player, 'ff3300', `(Trade):!{ffffff} You send offer to ${user.name} please wait.`); 
    user.call("invite_trading", [`${player.name} [${player.id}] wants to trade with you.<p>Do you accept ${player.name} trade request?</p>`]);  
});
  
mp.events.add("preload_click_invite_buttons", (player, option) => { 
   
    const user = player.sender;

    switch(option)
    {
        //CLOSE OFFER
        case 0:
        {
            //SEND MESSAGES
            sendMessage(player, 'ff3300', `(Trade):!{ffffff} You rejected trade invite from ${user.name} [${user.id}].`);
            sendMessage(user, 'ff3300', `(Trade):!{ffffff} ${player.name} [${player.id}] rejected your trade invite.`);
            break;
        }
 
        //ACCEPT OFFER
        case 1:
        {
            //SEND MESSAGES
            sendMessage(player, 'ff3300', `(Trade):!{ffffff} You accept trade menu with ${user.name} [${user.id}].`);
            sendMessage(user, 'ff3300', `(Trade):!{ffffff} ${player.name} [${player.id}] accept trade menu with you.`);
 
            player.tradeItems = [];
            user.tradeItems = [];

            player.tradeItmView = '';
            user.tradeItmView = '';

            player.itemsFinish = '';
            user.itemsFinish = '';
 
            player.tradeReady = false;
            user.tradeReady = false;

            player.tradeMoney = 0;
            user.tradeMoney = 0;
 
            load_inventory(player);
            break;
        }  
    } 
}); 

function load_inventory(player)
{
    const user = player.sender; 
    var total_items = ''; 
    var total_items2 = '';

    player.offer = '';
    user.offer = '';

    //------------------------------------------------------- [ PLAYER ITEMS] -------------------------------------------------------\\
    for(let x = 0; x < player.inventory.length; x++)
    {    
        total_items += `<div class = "box_item"> <span class="badge badge-sm badge-danger badge_trade" id = "badge_inv${player.inventory[x].type}">${player.inventory[x].quantity}</span> <div class="card-body text-center" onclick="clicked_item_inv(${x}, ${player.inventory[x].type}, ${player.inventory[x].invColor}, ${player.inventory[x].gender});"><img src="img/items/${(player.inventory[x].type >= 500) ? (player.inventory[x].type) : (player.inventory[x].indexItem)}.png" style = "width: 50px; margin-top: -55%; margin-left: -15%;"></div></div>`;
    }  

    player.call("start_trading", [total_items, user.name]);
 
    //------------------------------------------------------- [ USER ITEMS] -------------------------------------------------------\\
    for(let x = 0; x < user.inventory.length; x++)
    {    
        total_items2 += `<div class = "box_item"> <span class="badge badge-sm badge-danger badge_trade" id = "badge_inv${user.inventory[x].type}">${user.inventory[x].quantity}</span> <div class="card-body text-center" onclick="clicked_item_inv(${x}, ${user.inventory[x].type}, ${user.inventory[x].invColor}, ${user.inventory[x].gender});"><img src="img/items/${(user.inventory[x].type >= 500) ? (user.inventory[x].type) : (user.inventory[x].indexItem)}.png" style = "width: 50px; margin-top: -55%; margin-left: -15%;"></div></div>`;
    }  

    user.call("start_trading", [total_items2, player.name]);

    //UPDATE TRADE OFFER MENU
    player.call("update_offer_money", [`Your offer (<a style="color: #00cc7a;">0</a>$)`, `${user.name} offer (<a style="color: #00cc7a;">0</a>$)`]);
    user.call("update_offer_money", [`Your offer (<a style="color: #00cc7a;">0</a>$)`, `${player.name} offer (<a style="color: #00cc7a;">0</a>$)`]);
}

mp.events.add("preload_add_item_on_trade", (player, x, type, invColor, quantity) => { 

    const user = player.sender; 

    //VERIFFICATION
    if(!quantity)
        return player.call("showNotification", ['Please enter value.']);
     
    if(x != -1 && player.inventory[x].quantity < quantity)
        return player.call("showNotification", ['You don`t have this quantity.']);

    if(x != -1 && type < 500 && player.inventory[x].invUsed == true)
        return player.call("showNotification", ['This item is in use, please detach.']);
  
    //ADD ITEMS ON TRADE MENU
    if(x == -1)
    {
        //SET VARIABLE
        player.tradeMoney = quantity;

        //SEND MESSAGE
        send_trade_message(player, `${player.name} added <a style = "color: #00cc7a;">money</a> in trade (amount: <a style = "color: #00cc7a;">${player.formatMoney(quantity, 0)}</a>$).`); 
   
        //UPDATE TRADE OFFER MENU
        player.call("update_offer_money", [`Your offer (<a style="color: #00cc7a;">${player.formatMoney(player.tradeMoney, 0)}</a>$)`, `${user.name} offer (<a style="color: #00cc7a;">${user.formatMoney(user.tradeMoney, 0)}</a>$)`]);
        user.call("update_offer_money", [`Your offer (<a style="color: #00cc7a;">${user.formatMoney(user.tradeMoney, 0)}</a>$)`, `${player.name} offer (<a style="color: #00cc7a;">${player.formatMoney(player.tradeMoney, 0)}</a>$)`]);
    }
    else add_item(player, user, player.inventory[x].name, type, player.inventory[x].indexItem, invColor, quantity, player.inventory[x].quantity, x);
});
 
function add_item(player, user, name, itemType, itemIndex, invColor, quantity, newQuantity, x)
{    
    if(!player.tradeItems.length)  
        return create_push_trade(player, user, itemType, itemIndex, invColor, name, quantity, newQuantity, x);  
 
    if(already_item_added(player, itemType, itemIndex) == true)
        return player.call("showNotification", [`This item is already in trade offer.`]);
 
    create_push_trade(player, user, itemType, itemIndex, invColor, name, quantity, newQuantity, x);   
}
 
function already_item_added(player, itemType, itemIndex)
{
    var status = false;

    for(let i = 0; i < player.tradeItems.length; i++)
    {    
        if(player.tradeItems[i].type == itemType && player.tradeItems[i].index == itemIndex) 
        { 
            status = true;
            break;
        }  
    } 
    return status;
} 
 
function create_push_trade(player, user, itemType, itemIndex, invColor, name, quantity, newQuantity, x)
{
    const initialObject = {type: itemType, index: itemIndex, invColor: invColor, name: name, quantity: quantity } 
    player.tradeItems.push(initialObject);  
 
    //SEND MESSAGE IN TRADE
    send_trade_message(player, `${player.name} added <a style = "color: #00cc7a;">${name}</a> [${(player.inventory[x].gender == 0) ? ('<span class="badge badge-primary"><i class="fa fa-male"></i> M</span>') : ('<span style = "background-color: #7300e6;" class="badge badge-primary"><i class="fa fa-female"></i> F</span>')}] in trade (quantity: <a style = "color: #00cc7a;">${quantity}</a>).`); 
   
    //SET TRADE OFFER TEXT
    player.offer += `<div class = "box_item"> <span class="badge badge-sm badge-danger badge_trade" id = "badge_offer${x}">${quantity}</span> <div class="card-body text-center" onclick = "remove_offer_item(${x}, ${itemType}, ${itemIndex});"><img src="img/items/${(itemType >= 500) ? (itemType) : (itemIndex)}.png" style = "width: 50px; margin-top: -55%; margin-left: -15%;"></div></div>`;

    //UPDATE TRADE OFFER MENU
    player.call("update_offer", [itemType, newQuantity, player.offer, user.offer]);
    user.call("update_offer", [itemType, newQuantity, user.offer, player.offer]);
 
    //UPDATE INVENTORY
    total_items = '';

    player.inventory[x].quantity -= parseInt(quantity);
 
    for(let i = 0; i < player.inventory.length; i++)
    {     
        if(player.inventory[i].quantity > 0)
        {  
            total_items += `<div class = "box_item"> <span class="badge badge-sm badge-danger badge_trade" id = "badge_inv${player.inventory[i].type}">${player.inventory[i].quantity}</span> <div class="card-body text-center" onclick="clicked_item_inv(${i}, ${player.inventory[i].type}, ${player.inventory[i].invColor}, ${player.inventory[i].gender});"><img src="img/items/${(player.inventory[i].type >= 500) ? (player.inventory[i].type) : (player.inventory[i].indexItem)}.png" style = "width: 50px; margin-top: -55%; margin-left: -15%;"></div></div>`;
        } 
    }  

    player.call("start_trading", [total_items, user.name]);   
}
  
function send_trade_message(player, text)
{ 
    //SEND MESSAGE TO PLAYER AND TO PLAYER 2
    player.call("preload_text_chat_andSnd", [text]);
    player.sender.call("preload_text_chat_andSnd", [text]); 
}
   
mp.events.add("preload_text_chat", (player, text) => { 
   
    send_trade_message(player, `${player.name}: ${text}`);
});
 
mp.events.add("preload_ready_close", (player, option) => { 
   
    const user = player.sender;

    switch(option)
    {
        //CLOSE TRADE MENU
        case 0:
        {
            if(timer_global != null)
                return player.call("showNotification", ['Trade timer is already started.']);

            //SEND MESSAGES
            sendMessage(player, 'ff3300', `(Trade):!{ffffff} You closed trade menu with ${user.name} [${user.id}].`);
            sendMessage(user, 'ff3300', `(Trade):!{ffffff} ${player.name} [${player.id}] closed trade menu with you.`);
         
            //DESTROY BROWSERS
            player.call("destroy_trade_browser2", []);
            user.call("destroy_trade_browser2", []); 

            //RELOAD ITEMS IN INVETORY
            mp.events.call("loadPlayerInventory", player, player.data.sqlid);
            mp.events.call("loadPlayerInventory", user, user.data.sqlid);
            break;
        }
 
        //READY TRADE MENU
        case 1:
        { 
            //VERIFFICATION
            if(!player.tradeItems.length && !player.tradeMoney)
                return player.call("showNotification", ['You don`t have items in trade.']);

            //SET VARIABLE
            player.tradeReady = !player.tradeReady;
 
            //SEND MESSAGE
            send_trade_message(player, `${player.name} is ${(player.tradeReady == true) ? ('<a style = "color: #00cc7a;">ready') : ('<a style = "color: #ff4d4d;">not ready')}</a> now.`);

            //SHOW CEF
            player.call("update_trade_ready", [player.tradeReady, user.name]);
            user.call("update_trade_ready", [user.tradeReady, player.name]);
   
            //IF ALL MEMBERS IS READY START TIMER
            if(player.tradeReady == true && user.tradeReady == true)
            {  
                timer_global_seconds = 10;

                timer_global = setInterval(() => {

                    timer_global_seconds --;

                    player.call("start_trade_timer", [`00:${timer_global_seconds}`]);
                    user.call("start_trade_timer", [`00:${timer_global_seconds}`]);
                
                    if(timer_global_seconds == 0)
                    {
                        //REMOVE PLAYER ITEMS
                        destroy_database_item(player);

                        //REMOVE USER ITEMS
                        destroy_database_item(user);

                        //SEND PLAYER ITEMS FROM USER
                        for(let i = 0; i < player.tradeItems.length; i++)
                        { 
                            player.itemsFinish += `• ${player.tradeItems[i].name} (quantity: <span style="color: purple;">${player.tradeItems[i].quantity}</span>)<br>`;

                            mp.events.call("givePlayerItem", user, false, player.tradeItems[i].type, parseInt(player.tradeItems[i].quantity), player.tradeItems[i].name, player.tradeItems[i].index, player.tradeItems[i].invColor, player.data.gender); 
                        }

                        //SEND USERS ITEMS FROM PLAYER
                        for(let i = 0; i < user.tradeItems.length; i++)
                        {   
                            user.itemsFinish += `• ${user.tradeItems[i].name} (quantity: <span style="color: purple;">${user.tradeItems[i].quantity}</span>)<br>`;

                            mp.events.call("givePlayerItem", player, false, user.tradeItems[i].type, parseInt(user.tradeItems[i].quantity), user.tradeItems[i].name, user.tradeItems[i].index, user.tradeItems[i].invColor, user.data.gender); 
                        }
 
                        if(player.tradeMoney > 0)
                        {
                            player.itemsFinish += `• Money (quantity: <span style="color: purple;">${player.tradeMoney}</span>)<br>`;

                            user.giveMoney(0, player.tradeMoney);
                        }
 
                        if(user.tradeMoney > 0)
                        {
                            user.itemsFinish += `• Money (quantity: <span style="color: purple;">${user.tradeMoney}</span>)<br>`;

                            player.giveMoney(0, user.tradeMoney);
                        }
 
                        //SEND MESSAGE
                        sendMessage(player, 'ff3300', `(Trade):!{ffffff} Trade with ${user.name} [${user.id}] finished succesfuly.`);
                        sendMessage(user, 'ff3300', `(Trade):!{ffffff} Trade with ${player.name} [${player.id}] finished succesfuly.`);  

                        //DESTROY BROWSERS
                        player.call("close_trade_menu", []);
                        user.call("close_trade_menu", []); 
 
                        //SHOW ITEMS RECEIVED
                        player.call("show_finish_trade_items", [player.itemsFinish, user.itemsFinish, `${user.name} items`]);
                        user.call("show_finish_trade_items", [user.itemsFinish, player.itemsFinish, `${player.name} items`]);
 
                        //CLEAR INTERVAL
                        clearInterval(timer_global);
                        timer_global = null; 
                    }
                    
                }, 1000); 
            }  
 
            if(player.tradeReady == false || user.tradeReady == false)
            { 
                if(timer_global != null)
                {
                    //CLEAR INTERVAL
                    clearInterval(timer_global);
                    timer_global = null;

                    player.call("start_trade_timer", [-1]);
                    user.call("start_trade_timer", [-1]);
                } 
            }
            break;
        }

        //CLEAR OFFER
        case 2:
        {
            //VERIFFICATION
            if(!player.tradeItems.length && !player.tradeMoney)
                return player.call("showNotification", ['You don`t have items in offer.']);
 
            if(timer_global != null)
                return player.call("showNotification", ['Trade timer is already started.']);

            //RESET VARIABLE
            var total_items = ''; 
            player.offer = '';
            player.tradeItems = []; 
            player.tradeMoney = 0; 
 
            //RELOAD ALL ITEMS
            mp.events.call("loadPlayerInventory", player, player.data.sqlid);

            player.call("clear_offer", [player.offer, user.offer]);
            user.call("clear_offer", [user.offer, player.offer]);
 
            //RELOAD INVENTORY 
            setTimeout(() => {
                for(let x = 0; x < player.inventory.length; x++)
                {
                    total_items += `<div class = "box_item"> <span class="badge badge-sm badge-danger badge_trade" id = "badge_inv${player.inventory[x].type}">${player.inventory[x].quantity}</span> <div class="card-body text-center" onclick="clicked_item_inv(${x}, ${player.inventory[x].type}, ${player.inventory[x].invColor}, ${player.inventory[x].gender});"><img src="img/items/${(player.inventory[x].type >= 500) ? (player.inventory[x].type) : (player.inventory[x].indexItem)}.png" style = "width: 50px; margin-top: -55%; margin-left: -15%;"></div></div>`;
                }
                
                player.call("start_trading", [total_items, user.name]);

                //UPDATE TRADE OFFER MENU
                player.call("update_offer_money", [`Your offer (<a style="color: #00cc7a;">0</a>$)`, `${user.name} offer (<a style="color: #00cc7a;">0</a>$)`]);
                user.call("update_offer_money", [`Your offer (<a style="color: #00cc7a;">0</a>$)`, `${player.name} offer (<a style="color: #00cc7a;">0</a>$)`]);
 
            }, 500);
 
            //SEND MESSAGE
            send_trade_message(player, `${player.name} clear his offer.`);
            break;
        }
    } 
}); 
 
function destroy_database_item(player)
{
    for(let x = 0; x < player.inventory.length; x++)
    {     
        if(player.inventory[x].quantity == 0)
        {  
            //DELETE ITEM FROM MYSQL
            mysql_action('DELETE FROM `player_inventory` WHERE id = ? LIMIT 1', [player.inventory[x].id]); 

            //DESTROY ITEM FROM INVENTORY
            player.inventory.splice(x, 1); 
        }
        else mysql_action('UPDATE `player_inventory` SET quantity = ? WHERE id = ? LIMIT 1', [player.inventory[x].quantity, player.inventory[x].id]);  
    }
}

mp.events.add("preload_add_finall_item", (player, x, type, invColor, gender) => { 
 
    player.call("preload_clicked_item_inv2", [x, type, invColor, player.inventory[x].indexItem, player.inventory[x].name, gender, player.inventory[x].invUsed]); 
});


mp.events.add("preload_dettach_item", (player, x, type, status) => { 
 
    if(status == true && type < 500)
    {
        //CHANGE VARIABLE
        player.inventory[x].invUsed = false;

        //REMOVE ITEM FROM CHARACTER
        switch(player.inventory[x].indexItem)
        {
            case "jeans": player.setClothes(4, (player.inventory[x].invUsed == true) ? (player.inventory[x].type) : (0), (player.inventory[x].invUsed == true) ? (player.inventory[x].invColor) : (0), 0); break; //Jeans
            case "shoes": player.setClothes(6, (player.inventory[x].invUsed == true) ? (player.inventory[x].type) : (0), (player.inventory[x].invUsed == true) ? (player.inventory[x].invColor) : (0), 0); break; //Shoes
            case "jacket": player.setClothes(11, (player.inventory[x].invUsed == true) ? (player.inventory[x].type) : (0), (player.inventory[x].invUsed == true) ? (player.inventory[x].invColor) : (0), 0); break; //Jacket
            case "hat": player.setProp(0, (player.inventory[x].invUsed == true) ? (player.inventory[x].type) : (8), (player.inventory[x].invUsed == true) ? (player.inventory[x].invColor) : (0)); break; //Hat
            case "glasses": player.setProp(1, (player.inventory[x].invUsed == true) ? (player.inventory[x].type) : (0), (player.inventory[x].invUsed == true) ? (player.inventory[x].invColor) : (0)); break; //Glasses 
        } 
 
        //MYSQL
        mysql_action('UPDATE `player_inventory` SET invUsed = ? WHERE id = ? LIMIT 1', [player.inventory[x].invUsed, player.inventory[x].id]); 

        //NOTIFFICATION
        player.call("showNotification", [`Item has been detached from you.`]);

        //RELOAD MODAL ADD ITEM
        player.call("preload_clicked_item_inv2", [x, type, player.inventory[x].invColor, player.inventory[x].indexItem, player.inventory[x].name, player.data.gender, player.inventory[x].invUsed]);
    }
});
 
mp.events.add("preload_delete_item_offer", (player, x, type, index, quantity) => { 

    //SETEAZA INAPOI IN INVENTAR SUMA PE CARE O AVEA
    //player.inventory[x].quantity += parseInt(quantity);
 
    //sendMessage(player, 'ff3300', `(Trade):!{ffffff} Trade with ${user.name} [${user.id}] finished succesfuly.`);
});

 
/*
    1. Adaugata comanda /trade [player_id]
    2. Adaugat chat live 
    3. Adaugata functia ce preia itemele tale si le arata in inventar
    4. Adaugata functia pentru a pune itemele in trade offer
    5. Adaugat butonul 'close' pentru a inchide trade offer-ul 
    6. Adaugat badge pentru itemele tale din inventar 
    7. Adaugat badge pentru itemele tale din trade offer 
    8. Adaugat badge pentru itemele partenerului din trade offer  
    9. Daca suma itemului din inventar a ajuns la 0 acesta dispare de acolo
    10. Adaugata optiunea de ready/not ready
    11. Adaugat un buton pentru a sterge tot ce ai adaugat in inventar
    12. Adaugat un buton pentru a adauga bani in inventar
    13. Acum cand dai sa adaugi un item in acel modal iti va aparea si numele lui
    14. Adaugat un timer de 10-20 care la sfarsit le da itemele
    ------------------------------ [IN LUCRU] ------------------------------
      
    15. De adaugat o functie prin care sa vezi numele itemului  
    16. Cand pune haine in inventar si e in use sa o scoata dupa el cand o da celuilalt ✅
    17. Cand dai click pe itemu adaugat sa ai optiunea sa il scoti (apare modal)
*/