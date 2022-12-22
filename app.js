require("dotenv").config();
const mikrotikService = require("./services/mikrotik/MikrotikServices");
const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);
const mikrotikConfig = {
  host: process.env.MK_HOST,
  user: process.env.MK_USER,
  password: process.env.MK_PASSWORD,
};

bot.command("start", async (ctx) => {
  await ctx.telegram.sendMessage(ctx.message.chat.id, "=== Hello Selamat Datang Di Robot Mikrotik ===\n * Klik <b><i>Cek</i></b> untuk cek IP whitelist\n * Klik <b><i>Tambah</i></b> untuk tambah IP whitelist\n * Klik <b><i>Ubah</i></b> untuk ubah IP whitelist", { reply_markup: {
    resize_keyboard: true,
    keyboard: [ ["Cek"], ["Tambah"], ["Ubah"] ],
    one_time_keyboard: true,
  }, parse_mode: "html"});
});

// Bot Command Inline Keyboard
bot.hears("Format", async (ctx) => {
  await ctx.telegram.sendMessage(ctx.message.chat.id, "Untuk cek ip silahkan kirim dengan format berikut:\nCEK#Nama#Ip Whitelist\nContoh:\nCEK#OTO123#45.23.55.187");
});

bot.hears("Tambah", async (ctx) => {
  await ctx.telegram.sendMessage(ctx.message.chat.id, "Untuk tambah ip silahkan kirim dengan format berikut:\nTAMBAH#Nama#Ip Whitelist\nContoh:\nTAMBAH#OTO123#45.23.55.187");
});

bot.hears("Ubah", async (ctx) => {
  await ctx.telegram.sendMessage(ctx.message.chat.id, "Untuk tambah ip silahkan kirim dengan format berikut:\nTAMBAH#Nama#Ip Lama#Ip Baru\nContoh:\nUBAH#OTO123#45.23.55.129#78.113.33.44");
});

const destructure = (txt) => {
  const txtSplited = txt.split("#");
  if (txtSplited.length === 3) {
    let [command, name, ip] = txtSplited;
    return {
      command,
      name,
      ip,
    };
  } else if (txtSplited.length === 3) {
    let [command, name, ip, new_ip] = txtSplited;
    return {
      command,
      name,
      ip,
      new_ip,
    };
  } else {
    return new Error("Jumlah input data tidak valid");
  }
} 

bot.use((ctx) => {
  const msg = ctx.message.text;
  if (msg.includes("CEK")) {
    console.log(destructure(msg));
  } else if (msg.includes("TAMBAH")) {
    console.log(destructure(msg));
  } else if (msg.includes("UBAH")) {
    console.log(destructure(msg));
  }
});

bot.launch();
