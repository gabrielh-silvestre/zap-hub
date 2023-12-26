# zap-hub

## Description
This is a simple Node.js application that allows users to interact with ChatGPT using WhatsApp.
The user should be able to create a WhatsApp group and configure the Zap-Hub inside the group.

## How to use
1. Create a WhatsApp group
2. Name the group with the following prefix: `[GPT]`
3. Follow the instructions in the group to configure the Zap-Hub

### Availabe-Commands
- `!help` - Show the available commands
- `!register` - Set the OpenAI API key _(the message with the key will be deleted after setted)_
- `!unregister` - Remove the OpenAI API key
- `!gpt` - Send a message to the GPT-4 API, you can add a image to the message
- `<audio>` - Send audios from the configured WhatsApp Group to the GPT-4 API _(will send all received/created audios)_

### Important
- The Zap-Hub will only work in the group that was configured
- The Zap-Hub configuration is stored in the group description _(the description will be encoded)_
- You should NOT edit manually the Zap-Hub group description
- The Zap-Hub will use **YOUR** WhatsApp acount to receive and send messages, so have in mind that the Zap-Hub will always answer as **YOU** _(it will use your profile)_

## How to run

### Requirements
- Bun 1.0.16

### Steps
1. Clone this repository
2. Install the dependencies: `bun install`
3. Run the application: `bun run src/index.ts`
4. Login with your WhatsApp account using the QR Code **All the credentials are stored locally**
