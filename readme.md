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
`node extract_single_conversation_data.js` into the command line).
- Before running, make sure you change the `CONST_MESSAGE_PATH` at the top of
this script to point to the chat log you want to analyze (the .json file).
- Also, give a name for the output folder, which will be located in the
repository's root folder (the one containing the .js and .py files).

### Aggregate data over all chats
Run `node extract_personl_conversation_stats.js`. It will output some basic
stats about your messenger conversations to stdout, and will also save this
to a file called "conversations_data.txt".

## Misc. Notes
- You may be wondering: "why is the parsing done in node and then everything
else is python?" Well that's because I started in node since I thought reading
.json files would be fast (which it is), but then I discovered that I wanted
to use python to make plots and graphs. In hindsight, probably should have just
done everything in python. Welp.