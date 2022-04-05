// includes
const secret = require("./secret");
const https = require("https");
const { Client, Intents } = require('discord.js');

// global variable
const client = new Client({ intents: ['DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILDS'] });

const linkApi = 'api.adn2.ovh';
const linkUri = 'https://adn2.ovh/';
const port = 443;

// traitement
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', msg => {
    if (msg.content.trim().split(" ")[0].toLowerCase() == "link") {
        let getFlag = (lsParam, flag) => {
            for (let i = 0; i < lsParam.length; i++) {
                if (lsParam[i] == "--" + flag || lsParam[i] == "-" + flag[0]) {
                    return lsParam[i + 1];
                }
            }
        }
        let sendReq = (myData, path, endFunc) => {
            const data = JSON.stringify(myData);

            const options = {
                hostname: linkApi,
                port: port,
                path: '/' + path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                }
            }

            const req = https.request(options, res => {
                res.on('data', endFunc);
            });

            req.on('error', error => {
                console.error(error)
            })

            req.write(data);
            req.end();
        }
        let showErr = () => {
            msg.channel.send({
                embeds: [{
                    color: 3066993,
                    description: "Link command:\n\nFlags:\n--token || -t\n--link || -l\n--redirect || -r\nlink create [-t your_token] [-l link] -r redirection_link\nlink getLink -t your_token\nlink getView -t your_token -l link\nlink update -t your_token -l link -r redirection_link\nlink delete -t your_token -l link\n\nyour_token: a string, make it strong and secret\nlink: a string, it is the part after \"https://adn2.ovh/\"\nredirection_link: a string, it is the link where the user are redirected",
                }],
            });
        }

        let lsParam = msg.content.trim().split(/ +/);
        lsParam.shift();

        if (lsParam.length == 0) {
            showErr();
            return;
        }
        
        let type = lsParam.shift().toLowerCase();
        if (type == "create") {
            sendReq({
                token: getFlag(lsParam, "token"),
                link: getFlag(lsParam, "link"),
                redirect: getFlag(lsParam, "redirect"),
            },
            type,
            data => {
                data = JSON.parse(data);
                if (data.res == "ok") {
                    msg.channel.send({
                        embeds: [{
                            color: 3066993,
                            description: data.link,
                        }],
                    });
                }
                else {
                    msg.channel.send({
                        embeds: [{
                            color: 3066993,
                            description: data.err,
                        }],
                    });
                }
            });
        }
        else if (type == "getlink") {
            sendReq({
                token: getFlag(lsParam, "token"),
            },
            type,
            data => {
                data = JSON.parse(data);
                if (data.res == "ok") {
                    let lsField = [];
                    data.lsLink.forEach(link => {
                        if (link.link.length == 0) link.link = '\u200B';
                        if (link.redirect.length == 0) link.redirect = '\u200B';
                        lsField.push({ name: 'Link', value: linkUri + link.link, inline: true });
                        lsField.push({ name: 'Redirect', value: link.redirect, inline: true });
                        lsField.push({ name: '\u200B', value: "\u200B"});
                    });
                    msg.channel.send({
                        embeds: [{
                            color: 3066993,
                            description: "Your links",
                            fields: lsField,
                        }],
                    });
                }
                else {
                    msg.channel.send({
                        embeds: [{
                            color: 3066993,
                            description: data.err,
                        }],
                    });
                }
            });
        }
        else if (type == "getview") {
            sendReq({
                token: getFlag(lsParam, "token"),
                link: getFlag(lsParam, "link"),
            },
            type,
            data => {
                data = JSON.parse(data);
                if (data.res == "ok") {
                    let lsField = [];
                    data.lsView.forEach(view => {
                        lsField.push({ name: 'IP', value: view.ip, inline: true });
                        lsField.push({ name: 'Date', value: Date(view.moment), inline: true });
                        lsField.push({ name: '\u200B', value: "\u200B"});
                    });
                    msg.channel.send({
                        embeds: [{
                            color: 3066993,
                            description: "Your views",
                            fields: lsField,
                        }],
                    });
                }
                else {
                    msg.channel.send({
                        embeds: [{
                            color: 3066993,
                            description: data.err,
                        }],
                    });
                }
            });
        }
        else if (type == "update") {
            sendReq({
                token: getFlag(lsParam, "token"),
                link: getFlag(lsParam, "link"),
                redirect: getFlag(lsParam, "redirect"),
            },
            type,
            data => {
                data = JSON.parse(data);
                if (data.res == "ok") {
                    msg.channel.send({
                        embeds: [{
                            color: 3066993,
                            description: "Ok",
                        }],
                    });
                }
                else {
                    msg.channel.send({
                        embeds: [{
                            color: 3066993,
                            description: data.err,
                        }],
                    });
                }
            });
        }
        else if (type == "delete") {
            sendReq({
                token: getFlag(lsParam, "token"),
                link: getFlag(lsParam, "link"),
            },
            type,
            data => {
                data = JSON.parse(data);
                if (data.res == "ok") {
                    msg.channel.send({
                        embeds: [{
                            color: 3066993,
                            description: "Ok",
                        }],
                    });
                }
                else {
                    msg.channel.send({
                        embeds: [{
                            color: 3066993,
                            description: data.err,
                        }],
                    });
                }
            });
        }
        else {
            showErr();
        }
    }
});

client.login(secret.botToken);