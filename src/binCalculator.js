const prefix = "#bin ";

module.exports = function () {
  return async (msg) => {
    if (!msg.channel.guild) return;
    if (!msg.content.startsWith(prefix)) return;

    const formular = msg.content.replace(/[^(01\+\-\*/)]/g, "");
    if (!new RegExp(/^[01]+[\+\-\*/][01]+$/g).test(formular)) return;
    try {
      const operator = formular.match(/[\+\-\*/]/g).pop();
      const nums = formular.split(operator);
      const dec1 = parseInt(nums[0], 2);
      const dec2 = parseInt(nums[1], 2);
      let answer = "";
      switch (operator) {
        case "+":
          answer += (dec1 + dec2).toString(2);
          break;
        case "-":
          answer += (dec1 - dec2).toString(2);
          break;
        case "*":
          answer += (dec1 * dec2).toString(2);
          break;
        case "/":
          answer += Math.floor(dec1 / dec2).toString(2);
          answer += "," + (dec1 % dec2).toString(2);
          break;
      }
      await msg.channel.createMessage(`${formular}=${answer}. easy :robot:`);
    } catch (err) {
      console.warn("Failed to respond to binCalculator.");
      console.warn(err);
    }
  };
};
