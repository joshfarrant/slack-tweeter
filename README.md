# slack-tweeter
Tweet from Slack with the /tweet slash command

## Usage

```
npm install
```

Also, you will need to create a config.json file in the following format.

```
{
  "slackToken" : "", // The token given when setting up slash-command integration on Slack
  "allowedUsers" : "*", // Can be either "*" to allow all, or an array of usernames
  "disallowedUsers" : [] // Array of usernames
}
```

To run, simply run the following.

```
node app.js
```