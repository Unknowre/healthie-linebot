require("dotenv").config()
const express = require("express")
const line = require("@line/bot-sdk")

const app = express()

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
}

const client = new line.Client(config)

app.post("/webhook", line.middleware(config), async (req, res) => {
  try {
    await Promise.all(req.body.events.map(handleEvent))
    res.status(200).end()
  } catch (err) {
    console.error(err)
    res.status(500).end()
  }
})

async function handleEvent(event) {
  if (event.type !== "message") return null
  if (event.message.type !== "text") {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "ตอนนี้รองรับเฉพาะข้อความนะ",
    })
  }

  const text = event.message.text.trim()

  if (text === "คำนวณแคล") {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "พิมพ์ชื่ออาหาร + ปริมาณได้เลย เช่น\n- ข้าวมันไก่ 1 จาน\n- ไข่ต้ม 2 ฟอง\n- ชานมไข่มุก 1 แก้ว",
    })
  }

  return client.replyMessage(event.replyToken, {
    type: "text",
    text: `รับข้อความแล้ว: ${text}`,
  })
}

app.get("/", (req, res) => res.send("OK"))

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running")
})
