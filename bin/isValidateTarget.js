const TARGET_ENUM = ['txt', 'md'];

function isValidateTarget (target) {
  const normalTarget = String.prototype.toLowerCase.call(target);
  return TARGET_ENUM.indexOf(normalTarget) >= 0;
}

module.exports = isValidateTarget;
