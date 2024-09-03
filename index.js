const SlackBot = require('slackbots');
const axios = require('axios');

let bot = new SlackBot({
    token: 'XXXXXX',
    name: 'mortybot',
});

const params = {
    icon_emoji: ':speech_balloon:'
};
let users = new Map();
bot.on('start', () => {
    bot.postMessageToChannel('api', 'Hey I\'m Morty and I am here to help ... use !help in our chat', params, () => {
        console.log('Will see about that!');
    });
    bot.getUsers()._value.members.forEach( (element) => {
        users.set(element.id, element.name);
    });
});

bot.on('error', err => console.log(err));

bot.on('message', data => {
    if (data.type === 'message') {
        handle_message(data);
    }
});

function getAdmin(user,projet) {
    let message = 'admin:123456';
    bot.postMessageToUser(user, message, params, () => {
    });
}

function getJokes(user) {
    axios.get('http://api.icndb.com/jokes/random?limitTo=[nerdy]').then(res => {
        const joke = res.data.value.joke;
        bot.postMessageToUser(user, `A Chuck Joke: ${joke}`, params, () => {
        });
    });
}

function ShowHelp(user) {
    const message = "The available commands are : !access [project_name] , !jokes\n" +
        "The access command takes as an argument a valid project_name without []" ;
    bot.postMessageToUser(user, message, params, () => {
    });
}

function handle_message(data) {
    let user = users.get(data.user);
    if (data.text.includes('access')) {
        let projet = data.text.split(' ')[1];
        getAdmin(user, projet);
    } else if (data.text.includes('joke')) {
        getJokes(user);
    } else if (data.text.includes('help')) {
        ShowHelp(user);
    } else{
        bot.postMessageToUser(user, 'Can \'t handle this request for the moment', params, () => {
        });
    }
}
