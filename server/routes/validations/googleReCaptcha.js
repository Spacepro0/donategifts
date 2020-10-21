const superagent = require('superagent');
const { logError } = require('../../helper/logger');

// check if captcha token is valid
// returns boolean
async function validateReCaptchaToken(token) {
  if (process.env.NODE_ENV === 'test') {
    return true;
  }
  const googleUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_CAPTCHA_KEY}&response=${token}`;
  return (async () => {
    try {
      const res = await superagent.post(googleUrl);
      return res.body.success;
    } catch (err) {
      logError(err);
      return false;
    }
  })();
}

module.exports = { validateReCaptchaToken };
