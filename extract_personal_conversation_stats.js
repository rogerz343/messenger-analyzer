/**
 * Extracts general aggregate statistics about your conversations on messenger.
 */

let fs = require("fs");
const MESSAGES_DIR = "./messages";

// data structures
let conversations = [];     // list of "conversation stats" objects

// using sync versions to avoid hassle of dealing with promises and race conditions
let folders = fs.readdirSync(MESSAGES_DIR);
for (let i = 0; i < folders.length; ++i) {
    let item = folders[i];
    let rel_path = MESSAGES_DIR + "/" + item;
    let stats = fs.statSync(rel_path);
    if (!stats.isDirectory()) { continue; }

    let msg_obj;
    try {
        msg_obj = require(rel_path + "/message.json");
    } catch (e) {
        continue;
    }
    let stats_obj = {};
    let curr_ppl = [];
    for (let i = 0; i < msg_obj.participants.length; ++i) {
        curr_ppl.push(msg_obj.participants[i].name);
    }
    stats_obj.name = msg_obj.title;
    stats_obj.members = curr_ppl;
    stats_obj.num_msgs = msg_obj.messages.length;

    conversations.push(stats_obj);
}

conversations.sort((o1, o2) => o2.num_msgs - o1.num_msgs);

let output_filename = "./conversations_data.txt";
let file = fs.createWriteStream(output_filename, { flags: "w" });
for (let i = 0; i < conversations.length; ++i) {
    let str = JSON.stringify(conversations[i]);
    console.log(str);
    file.write(JSON.stringify(conversations[i]) + "\n");
}
file.end();