/**
 * Mask user identifier for privacy in public leaderboards and winner records
 * e.g., "usr_***8942" or "a***@veloop.com"
 */
const maskUserId = (userId) => {
  if (!userId) return 'usr_***';
  const str = userId.toString();
  return `usr_***${str.slice(-4)}`;
};

const maskName = (name) => {
  if (!name) return 'Anonymous';
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return `${parts[0].charAt(0)}***${parts[0].slice(-1)}`;
  }
  return `${parts[0]} ${parts[parts.length - 1].charAt(0)}***`;
};

module.exports = {
  maskUserId,
  maskName,
};
