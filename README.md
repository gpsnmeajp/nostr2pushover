# nostr2pushover
Nostrのあなた宛のリプライを、スマートフォン等にプッシュ通知するためのクライアントです。  
適当なサーバー上などで動かしてください。  

公開鍵のみで利用できます。

利用するためには、pushover.netにて利用登録が必要です。(トライアル期間あり)  
スマートフォンアプリは800円(買い切り)です。  
1ヶ月あたり1万回までの通知が利用できます。

https://pushover.net/

It is a client for sending push notifications to smartphones of Nostr's reply to you.
Please run it on a suitable server.

Only public keys are available.

In order to use it, user registration is required at pushover.net. (with trial period)
The smartphone app is 800 yen (outright purchase).
Up to 10,000 notifications are available per month.

https://pushover.net/

# 動作環境
+ node v19.2.0
+ Windows 11 (多分Linuxとかでも動くと思います)

# Licence
MIT Licence

# Dependencies

```
  "dependencies": {
    "nostr-tools": "^1.5.0",
    "pushover-notifications": "^1.2.2",
    "websocket-polyfill": "^0.0.3"
  },
```
