

import {
    Keypair
} from "stellar-sdk";


async function createTestAccounts() {
    const sender = Keypair.random();
    const receiver = Keypair.random();

    try {
        console.log(
            "Funding test accounts on the test network (takes a few seconds)…"
        );
        const responseSender = await fetch(
            `https://friendbot.stellar.org?addr=${sender.publicKey()}`
        );
        const responseReceiver = await fetch(
            `https://friendbot.stellar.org?addr=${receiver.publicKey()}`
        );
        const dataSender = await responseSender.json();
        const dataReceiver = await responseReceiver.json();

        console.log(`Sender Public Key: ${sender.publicKey()}`);
        console.log(`Sender Secret Key: ${sender.secret()}`);

        console.log(`Receiver Public Key: ${receiver.publicKey()}`);
        console.log(`Receiver Secret Key: ${receiver.secret()}`);

        return {
            sender,
            receiver,
        };
    } catch (e) {
        console.error("Oh no! Something went wrong:", e);
    }
}

export {
    createTestAccounts
}