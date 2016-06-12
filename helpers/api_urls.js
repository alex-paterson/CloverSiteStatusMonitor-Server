var CLIENT_URL = process.env.CLIENT_URL;

exports.passwordResetURL = (token, user_id) => {
  return `${CLIENT_URL}/password_reset_complete?token=${token}&user_id=${user_id}`
};
