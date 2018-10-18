/**
 * Extracts some information (e.g. number of messages, word frequencies, number
 * of reacts, etc.) from the given messenger conversation. Saves the results
 * as .json files.
 */

// Put path to chat log here
const MESSAGE_PATH = "./messages/nas1hope_dbd429fcd8/message.json"
// Give a name for the output folder of this chat log
const OUTPUT_DIR_NAME = "na_hope";

// load chat logs
let message_obj = require(MESSAGE_PATH);
let messages = message_obj.messages;

// reacts (as of 2018)
let unicode_reacts = {
    "\u00f0\u009f\u0091\u008d": "Thumbs Up",
    "\u00f0\u009f\u0091\u008e": "Thumbs Down",
    "\u00f0\u009f\u0098\u0086": "Haha",
    "\u00f0\u009f\u0098\u008d": "Heart Eyes",
    "\u00f0\u009f\u0098\u00a0": "Angry",
    "\u00f0\u009f\u0098\u00a2": "Sad",
    "\u00f0\u009f\u0098\u00ae": "Wow"
};

// data structures
let global_words = {};      // map from word to number of times it occurs in all messages
let global_reacts = {};
for (let r in unicode_reacts) {
    global_reacts[unicode_reacts[r]] = 0;
}
let global_num_msgs = messages.length;
let global_num_chars = 0;
let global_num_words = 0;
let global_timestamps = [];

let ppl_data = {};          // map from person's name to their data

/* Adds a person with the given name to the ppl_data object */
function add_person(name) {
    let person_obj = {};
    person_obj.words = {};              // map from word to # of times this person uses the word
    person_obj.reacts_given = {};
    for (let r in unicode_reacts) {
        person_obj.reacts_given[unicode_reacts[r]] = 0;
    }
    person_obj.reacts_received = {};
    for (let r in unicode_reacts) {
        person_obj.reacts_received[unicode_reacts[r]] = 0;
    }
    person_obj.num_msgs = 0;
    person_obj.num_chars = 0;
    person_obj.num_words = 0;

    ppl_data[name] = person_obj;
}

/**
 * Format of facebook downloaded data:
 * "messages" is an array of objects. Each object always has the fields
 *   + "sender_name"
 *   + "timestamp_ms"
 *   + "type"
 * and may optionally have the fields
 *   + "content" (this should almost always be included, but in rare cases it isn't)
 *   + "photos"
 *   + "reactions"
 *   + "share"
 */

// main loop through all messages
for (let i = 0; i < messages.length; ++i) {
    let msg_obj = messages[i];
    let name = msg_obj.sender_name;
    if (!(name in ppl_data)) { add_person(name); }
    let person_obj = ppl_data[msg_obj.sender_name];

    if (!("content" in messages[i])) { continue; }  // rare edge case, no interesting data

    let words = msg_obj.content.split(" ");

    global_num_chars += msg_obj.content.length;
    global_timestamps.push(msg_obj.timestamp_ms);
    person_obj.num_chars += msg_obj.content.length;
    ++person_obj.num_msgs;

    for (let j = 0; j < words.length; ++j) {
        ++global_num_words;
        ++person_obj.num_words;

        let word = words[j];
        word = word.toLowerCase();      // get rid of this to make case-sensitive
        if (!(word in global_words)) { global_words[word] = 0; }
        ++global_words[word];
        if (!(word in person_obj.words)) { person_obj.words[word] = 0; }
        ++person_obj.words[word];
        if ("reactions" in msg_obj) {
            for (let k = 0; k < msg_obj.reactions.length; ++k) {
                let react = unicode_reacts[msg_obj.reactions[k].reaction];
                let giver = msg_obj.reactions[k].actor;
                if (!(giver in ppl_data)) { add_person(giver); }
                ++global_reacts[react];
                ++person_obj.reacts_received[react];
                ++ppl_data[giver].reacts_given[react];
            }
        }
    }
}

let fs = require("fs");
let output_dir = "./" + OUTPUT_DIR_NAME;
if (!fs.existsSync(output_dir)) { fs.mkdirSync(output_dir); }

/* Saves the data for the person with name [name] to a file in the output directory */
function save_data(name) {
    // word frequency map
    let entries = [];
    let freq_map = ppl_data[name].words;
    for (key in freq_map) {
        entries.push({ "word": key, "freq": freq_map[key] });
    }
    entries.sort((e1, e2) => e2.freq - e1.freq);

    let word_map_file = output_dir + "/" + name + "_wordfreq.txt";
    let writer = fs.createWriteStream(word_map_file, { flags: 'w' });
    for (let i = 0; i < entries.length; ++i) {
        writer.write(entries[i].word + ": " + entries[i].freq + "\n");
    }
    writer.end();

    // 
}

/* Saves the aggregate date from the chat to various in the output directory */
function save_data() {
    // global (not person-specific) stats file
    let global_data_obj = {
        "words": global_words,
        "reacts": global_reacts,
        "num_msgs": global_num_msgs,
        "num_chars": global_num_chars,
        "num_words": global_num_words,
        "timestamps": global_timestamps,
    }

    let global_data_file = output_dir + "/data.json";
    fs.writeFile(global_data_file, JSON.stringify(global_data_obj, null, 4));

    // person-specific data
    for (let person in ppl_data) {
        let person_data_file = output_dir + "/" + person + "_data.json";
        fs.writeFile(person_data_file, JSON.stringify(ppl_data[person], null, 4));
    }
    
}

save_data();