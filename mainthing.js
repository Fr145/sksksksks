const fs = require('fs');
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

const customUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1";
const telegramBotToken = '6639409271:AAHM4M4OKjEaDr-Js9dD3WiESakIL91a87Q';  // Replace with your actual Telegram bot token
const telegramChannelUsername = '@jsjssmdjdndd';  // Replace with your actual Telegram channel username
const siteFilePath = 'sitese.txt';  // Replace with the path to your sites file

const bot = new TelegramBot(telegramBotToken, { polling: false });

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkWebsiteMobile(url, user_agent) {
    try {
        const headers = { "User-Agent": user_agent };
        const response = await axios.get(url, { headers });

        const captchaPresent = response.data.toLowerCase().includes("captcha");
        const cloudfarePresent = response.data.toLowerCase().includes("checking your browser");
        const paymentGateways = identifyPaymentGateways(response.data);
        const optionsPresent = checkForOptions(response.data);
        const loginOptionsPresent = checkForLoginOptions(response.data);

      const resultMessage = `<b>==========Site Checker===========\nURL: ${url.replace(/^https?:\/\//, '')}\nCaptcha: ${captchaPresent ? 'Yes 😔' : 'No 🔥'}\nCloudflare: ${cloudfarePresent ? 'Yes 😔' : 'No 🔥'}\nLogin/Register: ${loginOptionsPresent.length > 0 ? 'Yes 😑' : 'No 🫡'}\nPayment Gateways: ${paymentGateways.join(', ') || "Not found ❌"}${paymentGateways.length > 0 ? ' 🔥' : ''}\nOptions: ${optionsPresent.join(', ') || "Not found ❌"}${optionsPresent.length > 0 ? ' ✅' : ''}\n=========By @Frazzz145==========</b>`;
      
        await bot.sendMessage(telegramChannelUsername, resultMessage, { parse_mode: 'HTML'});
    } catch (error) {
        console.error(`Error occurred: Bad Site`);
    }
}

function identifyPaymentGateways(htmlContent) {
  const gatewayPatterns = {
      "Stripe": /\bstripe\b/i,
      "Payflowpro": /\bpayflowpro\b/i,
      "Ayden": /\bayden\b/i,
      "Cybersource": /\bcyber\s*source\b/i,
      "Shopify": /\bshopify\b/i,
      "Authorize.Net": /\bauthorize\.net\b/i,
      "Braintree": /\bbraintree\b/i,
      "Square": /\bsquare\b/i,
      "PayPal": /\bpaypal\b/i,
      "Worldpay": /\bworldpay\b/i,
      "Skrill": /\bskrill\b/i,
      "WePay": /\bwepay\b/i,
      "2Checkout": /\b2checkout\b/i,
      "Amazon Pay": /\bamazon\s*pay\b/i,
      "Google Pay": /\bgoogle\s*pay\b/i,
      "AliPay": /\balipay\b/i,
      "Paytm": /\bpaytm\b/i,
      "Mollie": /\bmollie\b/i,
      "SagePay": /\bsagepay\b/i,
      "SecurePay": /\bsecurepay\b/i,
      "PayU": /\bpayu\b/i,
      "BlueSnap": /\bbluesnap\b/i,
      "Adyen": /\badyen\b/i,
      "Dwolla": /\bdwolla\b/i,
      "Paysafe": /\bpaysafe\b/i,     
      "Checkout.com": /\bcheckout\.com\b/i,
      "Payson": /\bpayson\b/i,
  };

    const identifiedGateways = [];

    for (const [gateway, pattern] of Object.entries(gatewayPatterns)) {
        if (pattern.test(htmlContent)) {
            identifiedGateways.push(gateway);
        }
    }

    return identifiedGateways;
}

function checkForOptions(htmlContent) {
    const optionPatterns = ['order', 'pricing', 'donate', 'membership', 'payment'];
    return optionPatterns.filter(option => new RegExp(option, 'i').test(htmlContent));
}

function checkForLoginOptions(htmlContent) {
    const loginOptionPatterns = ['login', 'register', 'sign in', 'sign up'];
    return loginOptionPatterns.filter(option => new RegExp(option, 'i').test(htmlContent));
}

async function processSites() {
    try {
        const sites = fs.readFileSync(siteFilePath, 'utf-8').split('\n').filter(Boolean);

        for (const site of sites) {
            await checkWebsiteMobile(site, customUserAgent);
            await sleep(5000);  // 5 seconds delay between checking each site
        }
    } catch (error) {
        console.error(`Error reading sites file: ${error.message}`);
    }
}

// Example usage
processSites();