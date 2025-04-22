/**
 * @typedef {import('../models/player').Player} Player
 * @typedef {import('../models/mob').Mob} Mob
 * @typedef {import('../models/item').Item} Item
 * @typedef {import('../models/store').Store} Store
 * @typedef {import('../models/room').Room} Room
 */

/**
 * @typedef {Object} mobDiedEvent
 * @property {Player|Mob} attacker
 * @property {Mob} mob
 */

/** @typedef {Object} TickEvent
 *  @property {number} now
 */

/** @typedef {Object} PlayerEvent
 *  @property {Player} player
 */

/** @typedef {Object} PlayerMoveEvent
 *  @property {Player} player
 *  @property {string} from
 *  @property {string} to
 *  @property {string} direction
 *  @property {string} enteredFrom
 */

/** @typedef {Object} PlayerDiedEvent
 *  @property {Player} player
 *  @property {Player|Mob} attacker
 */

/** @typedef {Object} PlayerXPGainEvent
 *  @property {Player} player
 *  @property {number} amount
 */

/** @typedef {Object} StorePurchaseEvent
 *  @property {Player} player
 *  @property {Item} item
 */

/** @typedef {Object} ItemPickupEvent
 *  @property {Player} player
 *  @property {Item} item
 *  @property {Room} room
 *  @property {string} source
 */

/** @typedef {Object} StoreRefreshedEvent
 *  @property {string} store
 */

/** @typedef {Object} ZoneGenerateEvent
 *  @property {Player} player
 *  @property {Item} item
 */

/** @typedef {Object} PortalOpenedEvent
 *  @property {Player} player
 *  @property {Room} room
 */

// empty export to allow importing types
module.exports = {
  PLAYER: {
    CONNECTED: 'player.connected',
    LOGGED_IN: 'player.logged_in',
    ENTERED_REALM: 'player.entered_realm',
    ENTERED_ROOM: 'player.entered_room',
    LEFT_REALM: 'player.left_realm',
    LEFT_ROOM: 'player.left_room',
    DIED: 'player.died',
    RESPAWNED: 'player.respawned',
    LEVEL_UP: 'player.level_up',
    XP_GAINED: 'player.xp.gain',
    LOGGED_OUT: 'player.logged_out',
    MOVED: 'player.moved',

    ITEM_PICKED_UP: 'player.item.picked_up',
    ITEM_DROPPED: 'player.item.dropped',
    ITEM_USED: 'player.item.used',
    ITEM_EQUIPPED: 'player.item.equipped',
    INVENTORY_CHANGED: 'player.inventory.changed',

    QUEST_UPDATED: 'player.quest.updated',
    CAMPAIGN_ADVANCED: 'player.campaign.advanced',
  },

  MOB: {
    SPAWNED: 'mob.spawned',
    DIED: 'mob.died',
    ATTACKED: 'mob.attacked',
  },

  COMBAT: {
    TICK: 'combat.tick',
    ROUND_END: 'combat.round_end',
    DAMAGE_DEALT: 'combat.damage.dealt',
    DAMAGE_RECEIVED: 'combat.damage.received',
  },

  ROOM: {
    ENTERED: 'room.entered',
    LEFT: 'room.left',
    ITEMS_CHANGED: 'room.items.changed',
    CLEARED: 'room.cleared',
  },

  ITEM: {
    DROPPED: 'item.dropped',
    PICKED_UP: 'item.picked_up',
    USED: 'item.used',
    EQUIPPED: 'item.equipped',
    CREATED: 'item.created',
  },

  STORE: {
    PURCHASED: 'store.purchase',
    REFRESHED: 'store.refreshed',
    INVENTORY_UPDATED: 'store.inventory.updated',
  },

  ZONE: {
    GENERATE: 'zone.generate',
    GENERATED: 'ZoneGenerateEvent.generated',
    PORTAL_OPENED: 'ZoneGenerateEvent.portal.opened',
    PLAYER_ENTERED: 'ZoneGenerateEvent.player.entered',
    COMPLETED: 'ZoneGenerateEvent.completed',
  },

  QUEST: {
    STARTED: 'quest.started',
    UPDATED: 'quest.updated',
    COMPLETED: 'quest.completed',
    FAILED: 'quest.failed',
  },

  CAMPAIGN: {
    STAGE_ENTERED: 'campaign.stage.entered',
    STAGE_COMPLETED: 'campaign.stage.completed',
    BOSS_SLAIN: 'campaign.boss.slain',
    ENDED: 'campaign.ended',
  },

  SYSTEM: {
    TICK: 'tick',
    SAVE: 'system.save',
    SHUTDOWN: 'system.shutdown',
    ANNOUNCE: 'system.announce',
  },
};
