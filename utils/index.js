exports.destructureCommand = (txt) => {
  if (txt.includes("=")) {
    const splitEqual = txt.split("=").join("#");
    const txtSplited = splitEqual.split("#");
    const [command, name_old, ip_old, name_new, ip_new] = txtSplited; 
    // console.log(txtSplited);
    return {
      command,
      name_old,
      ip_old,
      name_new,
      ip_new,
    };
  }
  const txtSplited = txt.split("#");
  const [command, name, ip] = txtSplited;
  return {
    command,
    name,
    ip,
  };
};

exports.currentFormatDate = () => {
  const date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const strTime = `${hours}:${minutes}:${seconds}`;
  return (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
}
