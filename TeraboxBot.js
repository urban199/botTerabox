export default {
  async fetch(request, env) {
      try {
          const url = new URL(request.url);
          const { pathname } = url;

          if (pathname === '/webhook' && request.method === 'POST') {

              return teleRequest(request, env);
          }
          return new Response('NOT FOUND', { status: 404 });
      } catch (error) {
          console.error(error);
          return new Response('yamete kudasai', { status: 500 });
      }
  },
};
// ======================
// CONFIGURATION
// ======================
const TOKEN = 'xnxx'; //masukkan bot token onii chan
const TELE_API = `https://api.telegram.org/bot${TOKEN}`;
const NAME = 'nama botmu';
const API = `kkk`; //masukkan api teracrot🗿
// ======================
// STATE
// ======================
const STATE = {
  MAIN_MENU: 'main_menu',
  WAIT_URL: 'wait_url'
}
// ======================
// KeyBoard
// ======================
function mainMenu() {
  return {
      inline_keyboard: [
          [{ text: 'hello', callback_data: 'main_menu' }],
          [{ text: 'masuukan url', callback_data: 'w_url' }]
      ]
  };
}
// ======================
// MAIN MAIN
// ======================
async function teleRequest(request, env) {
  try {
      const update = await request.json();
      if (update.callback_query) {
          const {id, message, data} = update.callback_query;
          await handleCallback(env, message.chat.id, message.message_id, data);
          await answerCallbackQuery(id);
          return new Response('OK');
      }
      if (update.message) {
          const chatId = update.message.chat.id;
          const text = update.message.text;
      
      if (text.startsWith('/')) {
          if (text === '/start') {
              await resetState(env, chatId);
              await wellcome(chatId, env);
              return new Response('OK');
          }
          if (text === '/ping') {
              await pingCrot(chatId);
              return new Response('OK')
          }
      }

      const userState = await getUserState(env, chatId);

      switch (userState) {
          case STATE.WAIT_URL:
              await teraboxUrl(env, chatId, text);
              break;
              default: await sendMessage(chatId, "hello onii chan /start")
      }
    }
      return new Response('OK');
  } catch (error) {
      console.error(error);
      return new Response('yamete kudasai onii chan', { status: 500 });
  }
}
// ======================
// MAIN MENU
// ======================
async function wellcome(chatId, env) {
let message = `Hello${NAME}`;
await resetState(env, chatId);
await sendMessage(chatId, message, {
  parse_mode: 'Markdown',
  reply_markup: mainMenu()
});
}
async function pingCrot(chatId) {
  let start = Date.now();
  let xxx = await sendMessage(chatId, 'ping...')
  let end = Date.now();
  let response = end - start;
  await deleteMessage(chatId, xxx.message_id);
  await sendMessage(chatId, `pong ${response} ms`);
}
// ======================
// TERABOX RESPONSE
// ======================
async function teraKuUrl(env, chatId, messageId) {
  await setUserState(env, chatId, STATE.WAIT_URL);

  await editMessage(chatId, messageId,
      "Masukkan URL untuk mencari:\n" +
      "<code>gasskeun onii chan</code>",
      { parse_mode: "HTML" }
  );
}
//convert
function formatBytes(bytes) {
  if (typeof bytes === 'string') bytes = parseInt(bytes);
  if (bytes === 0 || bytes === '0') return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
// Fungsi untuk menghasilkan ID acak
function generateRandomId() {
  return [...crypto.getRandomValues(new Uint8Array(8))]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function teraboxUrl(env, chatId, query, messageId) {
  let data;

  try {
      let xnx = await sendMessage(chatId, "exploit url....");
    const res = await fetch(
      `${API}/terabox?url=${encodeURIComponent(query)}`
    );
    data = await res.json();

    await new Promise(resolve => setTimeout(resolve, 1200));
    await deleteMessage(chatId, xnx.message_id)
  } catch (e) {
    return sendMessage(chatId, "❌ Gagal fetch api onii chan.");
  }

  if (data.status !== 'success' || !data.files || data.files.length === 0) {
    return sendMessage(chatId, `❌ Tidak ditemukan: ${query}`);
  }

  // result response
  const kururin = data.files.map((item, i) => ({
    index: i,
    filename: item.filename,
    size: formatBytes(item.size),
    path: item.path,
    download: item.download_link,
    thumbnail: item.thumbnail
  }));

  // simpan list
  const listId = generateRandomId();

  await env.STATE.put(
    `list:${chatId}:${listId}`,
    JSON.stringify({
      kururin,
      timestamp: Date.now()
    }),
    { expirationTtl: 3600 } //1 jam
  );

  // build msg
  let text = `🔍 *Hasil pencarian:* [lihat](${query})\n\n`;
  const keyboard = [];

  kururin.slice(0, 8).forEach((a, i) => {
    text += `${i + 1}. *${a.filename}*\n ${a.size} | [LINK](${a.download})\n\n`;

    keyboard.push([
      {
        text: `ඞ ${i + 1}. Detail`,
        callback_data: `detail:${listId}:${i}`
      }
    ]);
  });

  keyboard.push([{ text: "Ɑ͞ ̶͞ ̶͞ ̶͞ ل", callback_data: "main_menu" }]);

  await setUserState(env, chatId, STATE.MAIN_MENU);

  const milep = {
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: keyboard }
  };

  if (messageId) {
    return editMessage(chatId, messageId, text, milep);
  }

  return sendMessage(chatId, text, milep);
}
async function milepHunter(env, chatId, listId, index, messageId) {
  const missav = await env.STATE.get(`list:${chatId}:${listId}`);

  if (!missav) {
    return sendMessage(chatId, "data expired onii chan cari ulang ya..");
  }

  const { kururin } = JSON.parse(missav);

  const yamete = kururin[index];
  if (!yamete) return sendMessage(chatId, "❌ Data tidak ada onii chan.");
let text =`❟❛❟`;
text += `\`\`\`\n`;
text +=`•${yamete.filename}\n`;
text +=`•${yamete.size}\n`;
text +=`•${yamete.path}\n`;
text += `\`\`\`\n`;
text +=`•[PREVIEW](${yamete.thumbnail})`;


  const keyboard = [
    [
      {
        text: "Download",
        url: `${yamete.download}`
      }
    ],
    [
      {
        text: "Ɑ͞ ̶͞ ̶͞ ̶͞ ل",
        callback_data: `back_list:${listId}`
      }
    ]
  ];

  const opts = {
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: keyboard }
  };
  if (messageId) {
    return editMessage(chatId, messageId, text, opts);
  }

  return sendMessage(chatId, text, opts);
}
async function showList(env, chatId, listId, messageId, page = 0) {
const missav = await env.STATE.get(`list:${chatId}:${listId}`);

if (!missav) {
  return sendMessage(chatId, "data expired onii chan cari ulang ya.");
}

const { kururin } = JSON.parse(missav);

const PER_PAGE = 8;
const totalMilep = Math.ceil(kururin.length / PER_PAGE);
 page = Math.max(0, Math.min(page, totalMilep - 1));
  const start = page * PER_PAGE;
  const slice = kururin.slice(start, start + PER_PAGE);

const keyboard = [];
let text =`🔍 *Hasil pencarian*:\n\n`;

 slice.forEach((a, i) => {
  const realJanda = start + i;
  text += `${realJanda + 1}. *${a.filename}*\n ${a.size} | [LINK](${a.download})\n\n`;

  keyboard.push([
    {
      text: `ඞ ${realJanda + 1}. Detail`,
      callback_data: `detail:${listId}:${realJanda}`
    }
  ]);
});
//NAV BUTTON
const nav = [];
if (page > 0){ nav.push({ text: "↢", callback_data: `page:${listId}:${page - 1}`})};
nav.push({ text:`${page + 1}/${totalMilep}`, callback_data: 'NaN'})
if (page < totalMilep - 1){ nav.push({ text: "↣", callback_data: `page:${listId}:${page + 1}`})};

keyboard.push(nav);

keyboard.push([{ text: "Ɑ͞ ̶͞ ̶͞ ̶͞ ل", callback_data: "main_menu" }]);


const milep = {
  parse_mode: "Markdown",
  reply_markup: { inline_keyboard: keyboard }
};
if (messageId) {
  return editMessage(chatId, messageId, text, milep);
}

return sendMessage(chatId, text, milep);
}

// ======================
// HANDLE Callback
// ======================
async function handleCallback(env, chatId, messageId, callbackData) {
  if (callbackData === 'main_menu') {
      let oniiChan = await getChat(chatId);
      let text = `${NAME}\n`;
      text += `\`\`\`\n`;
      text += `ID: ${chatId}\n`;
      text += `NAMA: ${oniiChan?.first_name} ${oniiChan?.last_name}\n`;
      text += `USERNAME: @${oniiChan?.username}\n`
      text += `\`\`\`\n`;
      await editMessage(chatId, messageId, text, {
          parse_mode: 'Markdown',
          reply_markup: mainMenu()
      });
      return;
  }
  if (callbackData === 'w_url') {
      await teraKuUrl(env, chatId, messageId);
      return;
  }
  if (callbackData.startsWith('detail:')) {
    const [, listId, index] = callbackData.split(':');
    await milepHunter(env, chatId, listId, index, messageId);
    return;
  }
  if (callbackData.startsWith('back_list:')) {
    const [, listId] = callbackData.split(':');
    await showList(env, chatId, listId, messageId);
    return;
  }
  if (callbackData.startsWith('page:')) {
    const [, listId, page] = callbackData.split(':');
    await showList(env, chatId, listId, messageId, Number(page));
    return;
  }
}
// ======================
// STATE MANAGEMENT
// ======================
async function setUserState(env, userId, state) {
  await env.STATE.put(`state_${userId}`, state);
}
async function getUserState(env, userId) {
  return await env.STATE.get(`state_${userId}`);
}
async function resetState(env, userId) {
  await env.STATE.delete(`wait_url${userId}`)
}
// ======================
// TELEGRAM API
// ======================
async function sendMessage(chatId, text, options = {}) {
  const payload = {
      chat_id: chatId,
      text,
      parse_mode: options.parse_mode || 'Markdown',
      disable_web_page_preview: true,
      ...options
  };

  const response = await fetch(`${TELE_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!data.ok) {
      console.error("Gagal mengirim pesan:", data);
      return null;
  }

  return data.result;
}

async function getChat(chatId) {
  const res = await fetch(`${TELE_API}/getChat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId
    })
  });
  const data = await res.json();
  if (!data.ok) {
    console.error("gagal mengambil data user", data);
    return null;
  }
  return data.result;
}

async function deleteMessage(chatId, messageId) {
  const response = await fetch(`${TELE_API}/deleteMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, message_id: messageId })
  });

  const data = await response.json();
  if (!data.ok) {
      console.error("Gagal menghapus pesan:", data);
  }
  return data.ok;
}

async function editMessage(chatId, messageId, text, options = {}) {
  const payload = {
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: options.parse_mode || 'Markdown',
      ...options
  };

  await fetch(`${TELE_API}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
  });
}

async function answerCallbackQuery(callbackId) {
  await fetch(`${TELE_API}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: callbackId })
  });
}