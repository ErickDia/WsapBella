import { makeWASocket,  DisconnectReason, useMultiFileAuthState } from "@whiskeysockets/baileys";

let sock;

export async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
    sock = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        // logger: log({level: "silent"})
    });
    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect, qr } = update || {};
        if (qr) {
            console.log(qr);
        }
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        }
    });
    sock.ev.on("messages.update", (messageInfo) => {
        console.log("message update");
        // console.log(messageInfo);
    })

    sock.ev.on("messages.upsert", async ({messages}) => {
        console.log(messages);
        // const id = "51913207513@s.whatsapp.net";
        // const sentMsg = await sock.sendMessage(id, { text: "hola chula" });
    })

    sock.ev.on("creds.update", saveCreds)
}




export const isWspConnected = () => {
    return sock?.user ? {status: true, sock} : {status: false, sock:null};
};

