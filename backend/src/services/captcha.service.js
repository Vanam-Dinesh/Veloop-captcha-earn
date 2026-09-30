const crypto = require("crypto");

const generateCaptchaText = () => {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let captchaText = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = crypto.randomInt(0, characters.length);
    captchaText += characters[randomIndex];
  }

  return captchaText;
};

const generateOptions = (captchaText) => {
  const correctOption = captchaText;
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  // First similar wrong option: change the first character.
  let replacement1;

  do {
    replacement1 = characters[crypto.randomInt(0, characters.length)];
  } while (replacement1 === captchaText[0]);

  const wrongOption1 = replacement1 + captchaText.slice(1);

  // Second similar wrong option: change the second character.
  let replacement2;

  do {
    replacement2 = characters[crypto.randomInt(0, characters.length)];
  } while (replacement2 === captchaText[1]);

  const wrongOption2 =
    captchaText[0] + replacement2 + captchaText.slice(2);

  // Completely different wrong option.
  let differentOption;

  do {
    differentOption = generateCaptchaText();
  } while (
    [correctOption, wrongOption1, wrongOption2].includes(differentOption)
  );

  // Shuffle choices so the correct answer isn't always option A.
  const options = [
    correctOption,
    wrongOption1,
    wrongOption2,
    differentOption,
  ];

  for (let i = options.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [options[i], options[j]] = [options[j], options[i]];
  }

  return {
    correctOption,
    options,
  };
};

const createCaptchaChallenge = () => {
  const captchaText = generateCaptchaText();
  const { correctOption, options } = generateOptions(captchaText);

  return {
    captchaText,
    options,
    correctOption,
  };
};

module.exports = {
  createCaptchaChallenge,
};