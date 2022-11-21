import StellarSdk from "stellar-sdk";
import fetch from "node-fetch";



async function sendPayment(senderKeypair, receiverPubKey) {
    
    const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");
    const amount = "100";

      const [
        {
          max_fee: { mode: fee },
        },
        sender,
      ] = await Promise.all([
        server.feeStats(),
        server.loadAccount(senderKeypair),
      ]);


    const transaction = new StellarSdk.TransactionBuilder(sender, {
        fee,
        networkPassphrase: StellarSdk.Networks.TESTNET,
    })
        .addOperation(
            // This operation sends the destination account XLM
            StellarSdk.Operation.payment({
                destination: receiverPubKey,
                asset: StellarSdk.Asset.native(),
                amount,
            }),
        )
        .setTimeout(30)
        .build();
    transaction.sign(sender);

    try {
        // Submit the transaction to the Stellar network.
        const transactionResult = await server.submitTransaction(transaction);
        console.log(transactionResult);

        return {
            message: 'Success',
            amount
        }

    } catch (e) {
        console.error("Oh no! Something went wrong.");
        console.error(e.response.data.detail);
        console.error(e.response.data.extras.result_codes);
        console.error(e.response.data.type);
        return e.response.data;
    }
}

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

(async () => {
    const { sender, receiver } = await createTestAccounts();
    console.log(JSON.stringify(sender, receiver));

    const result = await sendPayment(sender.publicKey(), receiver.publicKey());
    console.log(JSON.stringify(result));
})();