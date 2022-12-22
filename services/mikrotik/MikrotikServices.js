const RosApi = require("node-routeros").RouterOSAPI;

// Method to connect with channel mikrotik and return channel 
exports.connectMikrotik = async (config) => {
  const channel = new RosApi(config);
  try {
    await channel.connect();
    console.log("Berhasil Connect...");
    return channel;
  } catch (error) {
    console.error(error);
  }
};

// Method to close connection with channel (!important use when run end the service)
exports.closeConnection = async (channel) => {
  return channel.close();
}

// Method to check available addressList
exports.checkAvailableAddressList = async (channel, listName, address, title) => {
  try {
    const addressLists = await channel.write("/ip/firewall/address-list/print");
    const filteredAddressList = addressLists.filter((data) => data.list === listName && data.address === address && data.comment === title);
    if (filteredAddressList.length > 0) {
      const status = filteredAddressList[0].disabled === "false" ? "Aktif" : "Tidak Aktif"; 
      return {
        tanggal_dibuat: filteredAddressList[0]["creation-time"],
        status 
      };
    } else {
      return {
        msg: "Belum ada data..."
      };
    }
  } catch (error) {
    console.error(error);
  }
};

// Method add ip address  addresslist 
exports.addToAddressList = async (channel, listName, address, title) => {
  try {
    const result = await channel.write("/ip/firewall/address-list/add",
    [
      `=list=${listName}`,
      `=address=${address}`,
      `=comment=${title}`
    ]);
    console.log(result);
    return result;
  } catch (error) {
    if (error.message === "failure: already have such entry") {
      return {
        msg: "IP sudah ada dilist..."
      }
    } else {
      console.error(error);
    }
  }
};
