const createPasswordChangeCode = () => {
  const length = 6;
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * 9);
    code += randomIndex;
  }

  let codeExpires = Date.now() + 500 * 60 * 1000;

  return { code, codeExpires };
};

module.exports = createPasswordChangeCode;
