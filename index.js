import {
    sendPayment
} from './actions/sendPayment.js';


////////////////////////////////////////
/*
Balances
sender balance: https://testnet.steexp.com/account/GAZG7XVX5TUQ6GJENODNK4ZB46ROGYHOOK6I3DEJNRCCUX6LKIWPP6MQ
receiver balance: https://testnet.steexp.com/account/GA6KRCI4GRNHXL4XPHDSIHI32A2HHNOT7GIG64XY54CPISNJYVRRCR6T

*/
////////////////////////////////////////


(async () => {
    const SENDER_PUB_KEY = 'GAFYZELIQ7WKORXKJDGJXLKS3ESZYYEOQPVFQI4UYU47S2FSQF4AZIPN';
    const RECEIVER_PUB_KEY = 'GAN2LVEAZAT7YUO3HXX2PS6S4QVMMJQ2ODZG5K3ZAWUWT3LXFI56S3TH';

    // const { sender, receiver } = await createTestAccounts();
    // console.log(JSON.stringify(sender, receiver));

    await sendPayment(SENDER_PUB_KEY, RECEIVER_PUB_KEY, SENDER_SECRET);

    process.exit(0);
})();

