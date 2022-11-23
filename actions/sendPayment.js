
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

        await server.submitTransaction(transaction);
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

export {
    sendPayment
}