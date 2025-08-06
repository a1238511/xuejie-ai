// ✅ 學姊 AI：Replit 練習平台完整修正版本（Node.js）
// 使用 GPT-4 API，自動出題、糾錯、講解、評分

require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const { OpenAI } = require('openai')

const app = express()
app.use(bodyParser.json())

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// 題庫資料
const questions = {
  day1: [
    { q: '你是07:00上班，預約單要查哪些時間碼？', a: '查230～080，補查080避免漏單' },
    { q: '請說出派單第一步與第二步？', a: '回覆請稍等、改標頭、點亮待處理，然後貼主群' }
  ],
  day2: [
    { q: '三重→桃機，3件行李怎麼報價？', a: '799起跳 + 超件50 = 849元' },
    { q: '喊單規則：第一人12分，第二人10分，要派誰？', a: '派10分鐘的第二人' }
  ],
  day3: [
    { q: '空趟定義？', a: '預約前20分內取消，或等15分未上車，皆為空趟' },
    { q: '交接需檢查哪些？', a: '機場單、點數、客訴、主群貼文、交接表' }
  ]
}

// ✅ 首頁說明畫面（避免出現 Cannot GET /）
app.get('/', (req, res) => {
  res.send('✅ 學姊 AI 練習平台啟動成功，請用 POST /chat 送出你的回答')
})

// ✅ 對話 API（自動評分與講解）
app.post('/chat', async (req, res) => {
  const { message, day } = req.body
  const qaList = questions[day] || []
  const selected = qaList[Math.floor(Math.random() * qaList.length)]

  const prompt = `你是派單訓練教官「學姊」，依照公司講義標準出題與講解。

題目：${selected.q}
學員回答：${message}
正確答案：${selected.a}

請你回覆：
✅ 若答對：說明為何正確，加一點補充知識
❌ 若答錯：說明錯在哪裡、提供正解、補一點相關規則
語氣請專業、直接、有效率，不囉嗦。`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: prompt }
      ]
    })
    const reply = completion.choices[0].message.content
    res.json({ question: selected.q, reply })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '出題失敗，請稍後再試' })
  }
})

// ✅ 啟動伺服器
app.listen(3000, () => {
  console.log('✅ 學姊 AI 練習平台啟動成功：http://localhost:3000')
})
