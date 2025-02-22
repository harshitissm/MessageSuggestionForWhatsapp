# ReplyXpert extension

Welcome to the **ReplyXpert Extension** This extension is designed to make your WhatsApp Web experience more productive and efficient by providing you with AI-generated answer suggestions powered by OpenAI's ChatGPT.

## Features
- AI-powered answer suggestions for your WhatsApp Web conversations
- Customizable settings for answer generation
- Quick and easy installation
- Seamless integration with WhatsApp Web UI
- Completely free to use

## Installation

1. Clone or download this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click on "Load unpacked" and select the folder containing the downloaded repository files.
5. The extension will now appear in your Chrome extensions list, and you can start using it with WhatsApp Web.

## Usage

1. Open any chat or group chat.
2. As you receive messages, the ChatGPT-powered answer suggestions will appear below the input field.
3. Click on a suggestion to automatically populate the input field with the suggested text.
4. Modify the text if needed and send your message as usual.

# Explanation of the Code Files

## Background.js File

### Overview

The background.js file is a JavaScript script used as part of a Chrome extension. It plays a vital role in coordinating and managing various background tasks and processes for the extension. Here's an explanation of its key components:

### Importing createGptUtterance.js

importScripts('createGptUtterance.js');
This line imports the createGptUtterance.js script into the background.js file. The createGptUtterance.js script is the application's integration with the OpenAI GPT model, and this import makes its functionality accessible within the background script.

### Enabling Strict Mode

'use strict';
The 'use strict'; statement is used to enable strict mode in JavaScript. In this context, it ensures that the code within background.js adheres to strict coding rules, helping to identify and prevent common coding errors.

### Purpose
The specific purpose of the background.js file will depend on your Chrome extension's functionality. Generally, background scripts are responsible for tasks that run in the background, such as handling events, managing data, and coordinating communication between different parts of the extension.


## CreateGptUtterence File

### Introduction

The createGPTUtterence JavaScript file is designed for integration with the OpenAI GPT model within a Google Chrome extension. It allows the extension to communicate with GPT and generate text responses based on user prompts. This following provides a breakdown of the code, explaining its functionality in simple terms.

### Message Listener Setup

chrome.runtime.onMessage.addListener(
    function (request, sender) {
    }
);

This code sets up a message listener within the Chrome extension. It listens for incoming messages sent by other parts of the extension. When a message is received, it checks if the message is requesting GPT-related actions, specifically looking for a message with the content "sendChatToGpt."

### Checking for GPT Request

if (request.message === "sendChatToGpt") {
}

If the received message is indeed a GPT request, the code proceeds to the next steps.

### Choosing GPT API and Interaction

chrome.storage.local.get({
  apiChoice: 'webapp'
}, (items) => {
  if (items.apiChoice === 'webapp') {
    createGPTUtteranceWebApi(request.prompt, async function (gptResponse) {
    });
  }
});

This portion of the code checks the user's preference for the GPT API (in this case, "webapp"). It then calls the createGPTUtteranceWebApi function, passing the user's input prompt to interact with the GPT model and generate a response.

## GPT Interaction Functions

### createGPTUtteranceWebApi Function
This function is responsible for managing the interaction with the GPT model. It takes the user's prompt and an error handling function as parameters. It ensures that any exceptions are handled gracefully.

### Fetching a Session Token
Before interacting with the GPT model, the code fetches a session token from the OpenAI server. This token is essential for authentication.

### Generating Unique IDs and Creating Headers
The code includes helper functions such as generateUUIDv4 to create unique IDs and createHeaders to construct the necessary HTTP headers required for the API request.

### Sending a Conversation to GPT
The postConversation function sends the user's prompt to the GPT model and handles the response.

### Conclusion
This code snippet enables the Chrome extension to seamlessly integrate with the OpenAI GPT model, facilitating the generation of text responses based on user inputs. By following the provided documentation, you can effectively implement this functionality within your extension.


## confirmDialog File

The confirmDialog.js file contains JavaScript code that is injected into web page by the extension. Its primary function is to create a custom confirmation dialog box with "Yes" and "No" buttons. This dialog can be displayed to the user to gather their input or confirmation for various actions. The file also manages the display and styling of the dialog box, ensuring a user-friendly and visually consistent experience. This script enhances user interaction within web pages and can be a valuable tool for extension developers to create user prompts and dialogs in web applications.

## contentScript File

### overview 

contentscript.js is a JavaScript file designed to enhance the functionality of the extension. The file is the core part of the extension which focuses on responding to the actions of the user. It specifically focuses on improving the user experience within a chat interface by adding various features and capabilities.

### Dynamic DOM Mutation Detection

The script utilizes the Mutation Observer API to actively monitor changes in the DOM. It specifically looks for the addition of a main chat node and triggers processMainNode function passing the main chat node as an argument.

### User Permission Handling

Before sending chat data to GPT-3, the script checks for user permission and presents a confirmation dialog if needed to obtain user consent, ensuring privacy and data handling compliance.

### Event Listeners

Event listeners are attached to various elements within the chat interface. These listeners respond to user interactions, such as gpt button clicks or changes in chat history, and trigger corresponding actions within the extension.

### Creating the Prompt 

The Create Prompt function takes the ownership of creating the prompt which will be sent as the parameter to chatgpt api. The prompt function recieves the chathistory and the ownership of the last message and based on the ownership it develops the prompt.

### GPT Button Clicked

The gptButtonClicked function in contentscript.js file serves as an event handler for when Gpt button is clicked. The gptButtonClicked function is responsible for obtaining the user's permission before initiating the process of GPT-3 integration. It uses Chrome's local storage to track whether permission has been granted previously and displays a confirmation dialog to inform the user about the action and seek their consent. If the user consents, the function updates the storage to reflect their choice and proceeds with the action of generating response by triggering the triger event which calls for the parseHtmlFunction.

### Process Main Node 

It receives an addedNode as input, representing the newly added chat interface. It updates a global variable, globalMainNode, with a reference to the addedNode. The function reads data from Chrome's local storage using the readData() function, potentially fetching configuration settings. Here with get the "footer" element from the chat interface. Then after getting the main footer it calls for createGptFooter function in uiStuff.js which helps to generate the new footer element which holds the gpt interface also. It destructures the return values of a function createGptFooter() into three variables: newFooter, gptButtonObject, and copyButton. It assigns the gptButtonObject to a global variable, globalGptButtonObject, indicating its importance in the extension's functionality. It finds an element with the class ".selectable-text.copyable-text" within newFooter and assigns it to newFooterParagraph, representing a gpt text suggestion field. An event listener is added to the copyButton, allowing text from newFooterParagraph to be copied when the button is clicked. An asynchronous function, parseHtmlFunction(), is defined to parse HTML content within addedNode. It creates a prompt message based on chat history and message ownership. The gptButtonObject is marked as busy, indicating processing, and a message is sent to the extension's runtime. This message triggers the action related to GPT-3 integration in the createGptUtterance file.

### Conclusion

In summary, contentscript.js is a crucial component of the extension, enhancing the user's chat experience by facilitating natural language generation, managing user permissions, and dynamically adjusting the chat interface's style. Its event-driven design ensures responsive interactions, making it an integral part of the extension's functionality.

## Parser and UiStuff File 

### Overview

The parser file is used as the medium of parsing the last 10 messages of the chat from the Main Node. This JavaScript file provides a set of functions and a class for parsing and extracting chat history from HTML content, including the formatting of contact names, message ownership, and emoji handling. The parser function is called whenever the trigger event function is triggered. Whereas the UiStuff file is required for generating the chatGpt Interface for the WebPage.