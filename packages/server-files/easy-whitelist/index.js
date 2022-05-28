const allowedPlayers = require("./account.json");
var server_password = false;
  
mp.events.addCommand("whitelist", (player) => {
 
    if(player.data.admin < 2) 
        return player.staffPerms(2);
 
    server_password = !server_password;
      
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} [${player.id}] ${(server_password == true) ? ("!{ff3300}actived") : ("!{009933}dezactived")}!{ffffff} white list.`);
});


mp.events.add("playerJoin", player => {
    
    if(server_password == true && allowedPlayers.indexOf(player.socialClub) === -1) 
    {
        console.log('server pass')
        player.kick("Connection closed.");
    }
});