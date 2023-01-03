exports.MsgStartBot = async (ctx) => {
  await ctx.telegram.sendMessage(ctx.message.chat.id, "=== Hello Selamat Datang Di Robot Mikrotik ===\n * Kirim /login#Password untuk login \n <b>Contoh:</b> \n /login#testing", { parse_mode: "HTML" });
};

exports.MsgLoginSuccess = async (ctx) => {
  await ctx.telegram.sendMessage(ctx.message.chat.id, "LOGIN Berhasil\n* Untuk whitelist ip anda bisa menggunakan format:\n/whitelist#NAMA#IP WHITELIST\nContoh:\n/whitelist#OTO123#45.23.55.187");
};

exports.MsgLoginFailed = async (ctx) => {
  await ctx.telegram.sendMessage(ctx.message.chat.id, "LOGIN Gagal\n* Kirim /login#Password untuk login \nContoh: \n /login#TESTING");
};

exports.MsgNotLogin = async (ctx) => {
  await ctx.telegram.sendMessage(ctx.message.chat.id, "Anda Belum LOGIN\n* Kirim /login#Password untuk login \nContoh: \n /login#TESTING");
}

exports.MsgResFormatWhitelist = async (ctx) => {
  await ctx.telegram.sendMessage(ctx.message.chat.id, "Untuk whitelist ip silahkan kirim dengan format berikut:\n/whitelist#NAMA#Ip Whitelist\nContoh/whitelist#OTO123#45.23.55.187");
};

exports.MsgResWhitelistAvailable = async (ctx, data) => {
  await ctx.telegram.sendMessage(ctx.message.chat.id, `=== IP SUDAH TERWHITELIST === \n IP             : ${data.ip_addess} \n NAMA     : ${data.name} \n STATUS  : ${data.status ? "AKTIF ✅" : "TIDAK AKTIF ❌"} \n TGL LIST : ${data.created_at.toUpperCase()} \n\n * Apakah anda ingin merubah? \n <b><i>Ya, Ubah</i></b> untuk cek IP whitelist`, {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [ ["Ya, Ubah"], ["Tidak, Selesai"] ],
      one_time_keyboard: true,
  }, parse_mode: "HTML" });
};

exports.MsgResClearAdd = async (ctx, command) => {
  await ctx.telegram.sendMessage(ctx.message.chat.id, `✅ TERWHITELIST ✅\nIP         : ${command.ip}\nNAMA : ${command.name}`);
};

exports.MsgResContinueEdit = async (ctx) => {
  await ctx.telegram.sendMessage(ctx.message.chat.id, "Untuk merubah IP dan NAMA silahkan kirim seperti berikut:\n<b>Format:</b>\n/ubah#Nama Lama#IP Lama=Nama Baru#IP Baru\n<b>Contoh:</b>\n/ubah#OTO123#45.23.55.187=OTO456#123.122.65.78", { parse_mode: "HTML" });
};

exports.MsgResValidationActionAdd = async (ctx) => {
  await ctx.telegram.sendMessage(ctx.message.chat.id, "Untuk melanjutkan KLIK <i><b>Ya, Lanjut</b></i> atau <i><b>Tidak, Keluar</b></i>", { reply_markup: {
    resize_keyboard: true,
    keyboard: [ ["Ya, Lanjut"], ["Tidak, Keluar"] ],
    one_time_keyboard: true,
  }, parse_mode: "HTML" });
};

exports.MsgResClearEdit = async (ctx, command) => {
  await ctx.telegram.sendMessage(ctx.message.chat.id, `✅ UPDATE BERHASIL ✅\nDari\nIP         : ${command.ip_old}\nNAMA : ${command.name_old}\nMenjadi\nIP         : ${command.ip_new}\nNAMA : ${command.name_new}`);
};

exports.MsgResEditError = async (ctx, message) => {
  await ctx.telegram.sendMessage(ctx.message.chat.id, message);
}

  