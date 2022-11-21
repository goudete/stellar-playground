import StellarSdk from "stellar-sdk";
import fetch from "node-fetch";

////////////////////////////////////////
/*
Balances
sender balance: https://testnet.steexp.com/account/GAZG7XVX5TUQ6GJENODNK4ZB46ROGYHOOK6I3DEJNRCCUX6LKIWPP6MQ
receiver balance: https://testnet.steexp.com/account/GA6KRCI4GRNHXL4XPHDSIHI32A2HHNOT7GIG64XY54CPISNJYVRRCR6T

*/
////////////////////////////////////////


async function createTestAccounts() {
    const sender = StellarSdk.Keypair.random();
    const receiver = StellarSdk.Keypair.random();

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


async function sendPayment(senderPubKey, receiverPubKey, senderSeceret, receiverSecret) {

    const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");
    const AMOUNT = "1000";


    const senderKeyPair = StellarSdk.Keypair.fromSecret(senderSeceret);
    const receiverKeyPair = StellarSdk.Keypair.fromSecret(receiverSecret);

    let sender;
    let receiver;
    try {
        [
            sender,
            receiver
        ] = await Promise.all([
            server.loadAccount(senderKeyPair.publicKey()),
            server.loadAccount(receiverKeyPair.publicKey())
        ]);

    } catch (error) {
        if (error instanceof StellarSdk.NotFoundError) {
            return {
                message: 'The account does not exist!',
                Error: error
            }
        } else {
            return {
                message: 'Error getting accounts',
                Error: error
            }
        }
    }

    try {
        const transaction = new StellarSdk.TransactionBuilder(sender, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: StellarSdk.Networks.TESTNET,
        })
            .addOperation(
                StellarSdk.Operation.payment({
                    destination: receiverPubKey,
                    asset: StellarSdk.Asset.native(),
                    amount: AMOUNT,
                }),
            )
            .setTimeout(180)
            .build();

        // THIS IS THE PROBLEMATIC LINE
        transaction.sign(sender);

        console.log({
            message: 'Transaction object',
            transaction
        });

    } catch (err) {
        return {
            message: 'Failure while creating transaction object',
            Error: err,
        }
    }

    // Submit the transaction to the Stellar network.
    try {
        const transactionResult = await server.submitTransaction(transaction);
        console.log('🚀🚀🚀 Transaction Result: ', transactionResult);

        recoupLumens(senderPubKey.secret());

        return {
            message: `Success! ${senderPubKey} paid ${receiverPubKey} ${AMOUNT} XLM`,
            amount: AMOUNT
        };

    } catch (err) {
        return {
            message: 'Failure while submitting transaction to Stellar network',
            Error: err
        };
    }
}

(async () => {
    const SENDER_PUB_KEY = 'GAFYZELIQ7WKORXKJDGJXLKS3ESZYYEOQPVFQI4UYU47S2FSQF4AZIPN';
    const RECEIVER_PUB_KEY = 'GAN2LVEAZAT7YUO3HXX2PS6S4QVMMJQ2ODZG5K3ZAWUWT3LXFI56S3TH';

    // const { sender, receiver } = await createTestAccounts();
    // console.log(JSON.stringify(sender, receiver));

    const result = await sendPayment(SENDER_PUB_KEY, RECEIVER_PUB_KEY, SENDER_SECRET, RECEIVER_SECRET);
    console.log(JSON.stringify(result, null, 4));
})();