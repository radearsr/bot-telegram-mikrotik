const RosApi = require("node-routeros").RouterOSAPI;

// Method to connect with channel mikrotik and return channel 
exports.connectMikrotik = async (config) => {
  const channel = new RosApi(config);
  await channel.connect();
  // console.log("Berhasil Connect...");
  return channel;
};

// Method to close connection with channel (!important use when run end the service)
exports.closeConnection = async (channel) => {
  return channel.close();
}

// Method to check available addressList
exports.checkAvailableAddressList = async (channel, listName, address, comment) => {
  const addressLists = await channel.write("/ip/firewall/address-list/print");
  const filteredAddressList = addressLists.filter((data) => data.list === listName && data.address === address || data.comment === comment);
  // console.log(filteredAddressList);
  if (filteredAddressList.length > 0) {
    const status = filteredAddressList[0].disabled === "false" ? true : false;
    return {
      ip_addess: filteredAddressList[0].address,
      created_at: filteredAddressList[0]["creation-time"],
      status,
      name: filteredAddressList[0].comment,
      is_create: false,
    };
  } else {
    return {
      msg: "Belum ada data...",
      is_create: true,
    };
  }
};

// Method add ip address to addresslist 
exports.addToAddressList = async (channel, listName, address, comment) => {
  const result = await channel.write("/ip/firewall/address-list/add",
  [
    `=list=${listName}`,
    `=address=${address}`,
    `=comment=${comment}`
  ]);
  return result;
};

// Method detail addresslist by address and comment
exports.getNumberByAddressAndComment = async (channel, listName, address, comment) => {
  const addressLists = await channel.write("/ip/firewall/address-list/print");
  const details = [];
  addressLists.forEach((addressList, idx) => {
    if (addressList.list === listName && addressList.address === address && addressList.comment === comment) {
      details.push({
        id: addressList[".id"],
        num: idx,
      });
    }
  });

  if (details.length < 1) throw new Error(`Data dengan NAMA ${comment} & IP ${address} tidak ditemukan`);
  return details;
};

// Method edit address list
exports.editAddressList = async (channel, number, listName, address, comment) => {
  const result = await channel.write("/ip/firewall/address-list/set",
  [
    `=numbers=${number}`,
    `=list=${listName}`,
    `=address=${address}`,
    `=comment=${comment}`
  ]);
  return result;
};
