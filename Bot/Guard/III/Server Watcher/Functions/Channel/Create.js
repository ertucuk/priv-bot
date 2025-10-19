const { checkWhitelist } = require('../../../../Utils/Functions.js');

module.exports = async function channelCreate(client, guild, audit, member, changes) {
  const safeMode = await checkWhitelist(client, member, 'channel');
  if (safeMode?.isWarn) return;

  guild.channels.cache.get(audit.targetId).delete({ reason: 'Ertu ~ Güvenlik Sistemi' });
};