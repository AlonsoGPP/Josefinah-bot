
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');


client.on('ready', () => {
  // Notifica a la consola que el bot está listo
  console.log(`[INFO]: ${client.user.tag} está listo. Inicializado correctamente.`);
});

client.on("message", message => {
  if(message.content.indexOf(config.prefix) !== 0) return;

  // Definiendo los argumentos
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Procesador de comandos
  try {
    console.log("[INFO]: " + message.author.tag + " executed '" + command + "'");
    let commandFile = require(`./commands/${command}.js`);
    commandFile.run(client, message, args, Discord);
  } catch (err) {
    console.log("[ERROR]: '" + command + "' is not an existing command.");
    console.error("[ERROR]: " + err.message);
    message.reply("No existe ese comando!");
  }
});

client.login(config.token);



client.on('message', (mensaje) => {
  var MensajeMinusculas = mensaje.content.toLowerCase();
  if (MensajeMinusculas.match('discord.gg/'||MensajeMinusculas.match('https://discord.gg/'))) {
      mensaje.reply('No pasar enlaces de otros canales de discord por aquí.').then(mens => {mens.delete(4500)});
      mensaje.delete();
  }
});

var prefix = config.prefix;

client.on("message", (message) => {
  if (message.content.startsWith(prefix + "kick")) {
    var perms = message.member.hasPermission("KICK_MEMBERS");
    if(!perms) return message.channel.send("`Error` `|` No tienes Permisos para usar este comando.");
      var member= message.mentions.members.first();
      member.kick().then((member) => {
          message.channel.send( "**" + member.displayName + "**" + " Ha sido kickeado exitosamente! ");
      }).catch(() => {
          message.channel.send("Acceso denegado");
         }); 
  }
});



client.on("message", (message) => {
if(message.content.startsWith(prefix +'ping')) {

  let ping = Math.floor(message.client.ping);
  
  message.channel.send(":ping_pong: Pong!")
    .then(m => {

        m.edit(`:incoming_envelope: Ping Mensajes: \`${Math.floor(m.createdTimestamp - Date.now())} ms\`\n:satellite_orbital: Ping DiscordAPI: \`${ping} ms\``);
    
    });
  
}});

client.on("message", (message) => {
  let msg = message.content.toLowerCase();
  let args = message.content.slice(prefix.length).trim().split(' ');
  let command = args.shift().toLowerCase();

if(command === 'ban'){
    
  let user = message.mentions.users.first();
  let razon = args.slice(1).join(' ');

  if (message.mentions.users.size < 1) return message.reply('Debe mencionar a alguien.').catch(console.error);
  if(!razon) return message.channel.send('Escriba un razón, `-ban @username [razón]`');
  if (!message.guild.member(user).bannable) return message.reply('No puedo banear al usuario mencionado.');
  

  message.guild.member(user).ban(razon);
  message.channel.send(`**${user.username}**, fue baneado del servidor, razón: ${razon}.`);



}});

const ms = require("ms");

module.exports.run = async (bot, message, args) => {

  //!tempmute @user 1s/m/h/d

  let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!tomute) return message.reply("Couldn't find user.");
  if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Can't mute them!");
  let muterole = message.guild.roles.find(`name`, "muted");
  //start of create role
  if(!muterole){
    try{
      muterole = await message.guild.createRole({
        name: "muted",
        color: "#000000",
        permissions:[]
      })
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    }catch(e){
      console.log(e.stack);
    }
  }
  //end of create role
  let mutetime = args[1];
  if(!mutetime) return message.reply("You didn't specify a time!");

  await(tomute.addRole(muterole.id));
  message.reply(`<@${tomute.id}> has been muted for ${ms(ms(mutetime))}`);

  setTimeout(function(){
    tomute.removeRole(muterole.id);
    message.channel.send(`<@${tomute.id}> has been unmuted!`);
  }, ms(mutetime));


//end of module
}

module.exports.help = {
  name: "tempmute"
}