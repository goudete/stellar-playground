// import StellarSdk from "stellar-sdk";
import {
    Keypair,
    Account,
    TransactionBuilder,
    BASE_FEE,
    Networks,
    Operation,
    Asset,
    Server
} from "stellar-sdk";

////////////////////////////////////////
/*
Balances
sender balance: https://testnet.steexp.com/account/GAZG7XVX5TUQ6GJENODNK4ZB46ROGYHOOK6I3DEJNRCCUX6LKIWPP6MQ
receiver balance: https://testnet.steexp.com/account/GA6KRCI4GRNHXL4XPHDSIHI32A2HHNOT7GIG64XY54CPISNJYVRRCR6T

*/
////////////////////////////////////////


// async function createTestAccounts() {
//     const sender = Keypair.random();
//     const receiver = Keypair.random();

//     try {
//         console.log(
//             "Funding test accounts on the test network (takes a few seconds)…"
//         );
//         const responseSender = await fetch(
//             `https://friendbot.stellar.org?addr=${sender.publicKey()}`
//         );
//         const responseReceiver = await fetch(
//             `https://friendbot.stellar.org?addr=${receiver.publicKey()}`
//         );
//         const dataSender = await responseSender.json();
//         const dataReceiver = await responseReceiver.json();

//         console.log(`Sender Public Key: ${sender.publicKey()}`);
//         console.log(`Sender Secret Key: ${sender.secret()}`);

//         console.log(`Receiver Public Key: ${receiver.publicKey()}`);
//         console.log(`Receiver Secret Key: ${receiver.secret()}`);

//         return {
//             sender,
//             receiver,
//         };
//     } catch (e) {
//         console.error("Oh no! Something went wrong:", e);
//     }
// }


async function sendPayment(senderPubKey, receiverPubKey, senderSeceret) {

    const AMOUNT = "1000";
    const server = new Server("https://horizon-testnet.stellar.org");

    try {
        const senderKeyPair = Keypair.fromSecret(senderSeceret);
        const sequence = await server.accounts().accountId(senderKeyPair.publicKey()).call();

        const senderAccount = new Account(senderKeyPair.publicKey(), sequence.sequence);

        const transaction = new TransactionBuilder(senderAccount, {
            fee: BASE_FEE,
            networkPassphrase: Networks.TESTNET,
        }).addOperation(
            Operation.payment({
                destination: receiverPubKey,
                asset: Asset.native(),
                amount: AMOUNT,
            }),
        ).setTimeout(0)
            .build();

        transaction.sign(senderKeyPair);

        console.log({
            message: 'Transaction successfully created and signed 🤙'
        })

        const transactionResult = await server.submitTransaction(transaction);
        console.log(`🚀🚀🚀 Transaction submitted to ${Networks.TESTNET}`);

        console.log({
            message: `Success! ${senderPubKey} paid ${receiverPubKey} ${AMOUNT} XLM`,
            amount: AMOUNT
        });

        return;

    } catch (error) {
        console.log('Error: ', error)
    }
}

(async () => {
    const SENDER_PUB_KEY = 'GAFYZELIQ7WKORXKJDGJXLKS3ESZYYEOQPVFQI4UYU47S2FSQF4AZIPN';
    const RECEIVER_PUB_KEY = 'GAN2LVEAZAT7YUO3HXX2PS6S4QVMMJQ2ODZG5K3ZAWUWT3LXFI56S3TH';


    // const { sender, receiver } = await createTestAccounts();
    // console.log(JSON.stringify(sender, receiver));

    await sendPayment(SENDER_PUB_KEY, RECEIVER_PUB_KEY, SENDER_SECRET);

    process.exit(0);
})();

