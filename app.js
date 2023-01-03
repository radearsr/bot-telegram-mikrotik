require("dotenv").config();
const { Console } = require("console");
const fs = require("fs");
const { Telegraf } = require("telegraf");
const bcrypt = require("bcrypt");

const mikrotikService = require("./services/mikrotik/MikrotikServices");
const telegrafService = require("./services/telegraf/TelegrafService");
const utils = require("./utils");
const { configMK } = require("./config");

const logger = new Console({
  stdout: fs.createWriteStream("accessLog.txt"),
  stderr: fs.createWriteStream("errorLog.txt"),
});
const TELE_BOT = new Telegraf(process.env.BOT_TOKEN);
const LIST_NAME = "LIST1";
const STATUS_USER = {
  username_tele: "",
  fname_tele: "",
  lname_tele: "",
  login: false,
  temp_data: [],
};

// Login Use Case
const validationLogin = async (ctx, msg) => {
  const [,password] =  msg.split("#");

  if (password === undefined) {
    return await telegrafService.MsgLoginFailed(ctx);
  }

  const continues = await bcrypt.compare(password, process.env.PASSWORD);

  if (!continues) {
    return await telegrafService.MsgLoginFailed(ctx);
  }

  STATUS_USER.login = true;
  STATUS_USER.username_tele = ctx.chat.username;
  STATUS_USER.fname_tele = ctx.chat.first_name;
  STATUS_USER.lname_tele = ctx.chat.last_name;
  logger.log(`[${utils.currentFormatDate()}] LOGIN ${STATUS_USER.username_tele} ${STATUS_USER.fname_tele}`);
  return await telegrafService.MsgLoginSuccess(ctx);
}

const verifyLogin = async (ctx) => {
  if (STATUS_USER.login) return true;
  await telegrafService.MsgNotLogin(ctx);
  return false;
}

// Add Whitelist Use Case
const verifywhitelistUseCase = async (ctx, msg) => {
  let channel;
  try {
    channel = await mikrotikService.connectMikrotik(configMK);
    const login = await verifyLogin(ctx);
    if (!login) return false;
    const command = utils.destructureCommand(msg);
    const verifyAddress = await mikrotikService.checkAvailableAddressList(channel, LIST_NAME, command.ip, command.name);
    if (!verifyAddress.is_create) {
      await telegrafService.MsgResWhitelistAvailable(ctx, verifyAddress);
    } else {
      STATUS_USER.temp_data.push(command);
      await telegrafService.MsgResValidationActionAdd(ctx);
    }
  } catch (error) {
    logger.error(`[${utils.currentFormatDate()}] Verify Whitelist Use Case ${error}`);
    console.error(error);
  } finally {
    await mikrotikService.closeConnection(channel);
  }
};

// Add Whitelist Use Case
const addWhitelistUseCase = async (ctx, command) => {
  let channel;
  try {
    channel = await mikrotikService.connectMikrotik(configMK);
    const login = await verifyLogin(ctx);
    if (!login) return false;
    const [addedWhitelist] = await mikrotikService.addToAddressList(channel, LIST_NAME, command.ip, command.name);
    if (addedWhitelist.ret !== undefined || addedWhitelist.ret !== "") {
      STATUS_USER.temp_data = [];
      logger.log(`[${utils.currentFormatDate()}] ADD ${STATUS_USER.username_tele} ${STATUS_USER.fname_tele} | ${command.name}~${command.ip} |`);
      return telegrafService.MsgResClearAdd(ctx, command);
    }
  } catch (error) {
    logger.error(`[${utils.currentFormatDate()}] Add Whitelist Use Case ${error}`);
  } finally {
    await mikrotikService.closeConnection(channel);
  }
};

// Edit Whitelist Use Case
const editWhitelistUseCase = async (ctx, msg) => {
  let channel;
  try {
    channel = await mikrotikService.connectMikrotik(configMK);
    const login = await verifyLogin(ctx);
    if (!login) return false;
    const commandBot = utils.destructureCommand(msg);
    const [details] = await mikrotikService.getNumberByAddressAndComment(channel, LIST_NAME, commandBot.ip_old, commandBot.name_old);
    await mikrotikService.editAddressList(channel, details.num, LIST_NAME, commandBot.ip_new, commandBot.name_new);
    logger.log(`[${utils.currentFormatDate()}] EDIT ${STATUS_USER.username_tele} ${STATUS_USER.fname_tele} | ${commandBot.name_old}~${commandBot.ip_old} => ${commandBot.name_new}~${commandBot.ip_new} |`);
    await telegrafService.MsgResClearEdit(ctx, commandBot);
  } catch (error) {
    logger.error(`[${utils.currentFormatDate()}] Edit Whitelist Use Case ${error}`);
    if (error.message.includes("Data dengan NAMA")) {
      await telegrafService.MsgResEditError(ctx, error.message);
    } else if (error.message.includes("failure: already have such entry")) {
      const commandBot = utils.destructureCommand(msg);
      const detailVerif = await mikrotikService.checkAvailableAddressList(channel, LIST_NAME, commandBot.ip_new, commandBot.name_new);
      await telegrafService.MsgResWhitelistAvailable(ctx, detailVerif);
    } else {
      console.error(error);
    }
  } finally {
    await mikrotikService.closeConnection(channel);
  }
};

// Bot Command Start
TELE_BOT.command("start", async (ctx) => {
  telegrafService.MsgStartBot(ctx);
});

// Bot Command Login
TELE_BOT.command("login", async (ctx) => {
  await validationLogin(ctx, ctx.message.text);
});

// Bot Command Whitelist
TELE_BOT.command("whitelist", async (ctx) => {
  await verifywhitelistUseCase(ctx, ctx.message.text);
});

// Bot Command Ubah
TELE_BOT.command("ubah", async (ctx) => {
  await editWhitelistUseCase(ctx, ctx.message.text);
})

// Bot Hears All Command
TELE_BOT.use( async (ctx) => {
  const msg = ctx.message.text;
  if (msg.includes("Ya, Lanjut")) {
    await addWhitelistUseCase(ctx, STATUS_USER.temp_data[0]);
  } else if (msg.includes("Ya, Ubah")) {
    telegrafService.MsgResContinueEdit(ctx);
  } else if (msg.includes("Tidak, Keluar")) {
    STATUS_USER.login = false;
  } else if (msg.includes("Tidak, Selesai")) {
    STATUS_USER.login = false;
  }
});

TELE_BOT.launch();
