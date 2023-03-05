const NOSTR_RELAYS = JSON.parse(process.env.NOSTR_RELAYS) || ['wss://nos.lol', 'wss://relay.snort.social', 'wss://nostr.fediverse.jp'];
const NOSTR_PUBLIC_KEY = process.env.NOSTR_PUBLIC_KEY || "******************************";

// https://pushover.net/
// 1ヶ月あたり1万メッセージまで
const PUSHOVER_TOKEN = process.env.PUSHOVER_TOKEN;
const PUSHOVER_USER = process.env.PUSHOVER_USER;

var nostr = require('nostr-tools');
var WebSocket = require('websocket-polyfill');
var Push = require('pushover-notifications')
var p = new Push({
    user: PUSHOVER_USER,
    token: PUSHOVER_TOKEN,
})

async function getUserName(pool, pubkey) {
    let meta = await pool.get(NOSTR_RELAYS, {
        kinds: [0],
        authors: [pubkey],
    });
    if (meta) {
        let content = JSON.parse(meta.content);
        if (content.name) {
            return "@" + content.name;
        }
        if (content.display_name) {
            return content.display_name;
        }
        if (content.username) {
            return content.username;
        }
    }
    return nostr.nip19.npubEncode(pubkey).substring(0,10);
}

async function main(){
    let eose = false;
    const pool = new nostr.SimplePool();
    const yourname = await getUserName(pool, nostr.nip19.decode(NOSTR_PUBLIC_KEY).data);
    const yourPublicKey = nostr.nip19.decode(NOSTR_PUBLIC_KEY).data; // hex
    console.log(yourname);

    let sub = pool.sub(NOSTR_RELAYS, [{
        kinds: [1],
        '#p': [nostr.nip19.decode(NOSTR_PUBLIC_KEY).data]
    }]);

    sub.on('event', async event => {
        //自分への返信は無視
        if (event.pubkey === yourPublicKey) {
            return;
        }
        //Repostは無視
        if (event.content === "#[0]") {
            return;
        }
        //EOSEまで無視
        if (eose === false) {
            return;
        }
        let name = await getUserName(pool, event.pubkey);
        let content = event.content.replace("#[0]", yourname);
        console.log(event);
        console.log(name);
        console.log(content);

        var msg = {
            message: (name + ": " + content).substring(0,1000),
            title: "nostr2pushover"
        }
        p.send(msg, function (err, result) {
            if (err) {
                throw err
            }

            console.log(result)
        })
    });

    sub.on('eose', () => {
        eose = true;
        console.log("EOSE");
    });
};
main();