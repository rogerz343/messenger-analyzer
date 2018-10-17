# messenger-analyzer
Aggregates data from your facebook messenger chat logs.

## Setting Up
You should have some version of python 3 installed and node.js installed on
your computer.

## Getting Messenger Files
Go to your facebook account/settings and "Download Your Information". You can
download various types of information about your facebook/messenger account. But
just make sure that the "Messenger" box is checked and that you download with
the JSON (.json) format. Inside the downloaded files, there should be a folder
called "messages" which contains many folders, each for a different messenger
chat group. Place this "messages" folder into the root directory of this
repository (the one that contains the .js and .py files).

## Running the Files/Scripts
### Data for individual chat groups
First, run "extract_messenger_data.js" with node (i.e. type
`node extract_messenger_data.js` into the command line).
- Before running, make sure you change the `CONST_MESSAGE_PATH` at the top of
this script to point to the chat log you want to analyze (the .json file).
- Also, give a name for the output folder, which will be located in the
repository's root folder (the one containing the .js and .py files).

### Aggregate data over all chats