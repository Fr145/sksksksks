import random
from telegram import Update
from telegram.ext import Updater, CommandHandler, CallbackContext

def start(update: Update, context: CallbackContext) -> None:
    update.message.reply_text("Welcome to the SK Key Generator bot! Use /skgen to generate SK keys.")

def skgen(update: Update, context: CallbackContext) -> None:
    user_id = update.message.from_user.id
    num_keys = 1  # Default number of keys
    start_letters = "ABC"  # Default start letters

    # Retrieve user input from message
    if len(context.args) >= 1:
        num_keys = int(context.args[0])
    if len(context.args) >= 2:
        start_letters = context.args[1]

    sk_keys = generate_sk_keys(num_keys, start_letters)
    sk_keys_text = "\n".join(sk_keys)
    update.message.reply_text(sk_keys_text)

def generate_sk_keys(num_keys, start_letters):
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    sk_keys = []

    for _ in range(num_keys):
        sk_key = f"sk_live_{start_letters}"
        sk_length = random.randint(24, 71)

        for _ in range(len(start_letters), sk_length):
            random_index = random.randint(0, len(characters) - 1)
            sk_key += characters[random_index]

        sk_keys.append(sk_key)

    return sk_keys

def main() -> None:
    # Replace 'YOUR_BOT_TOKEN' with your actual bot token
    updater = Updater("YOUR_BOT_TOKEN")

    dp = updater.dispatcher
    dp.add_handler(CommandHandler("start", start))
    dp.add_handler(CommandHandler("skgen", skgen))

    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()
