import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  integer,
  text,
  date,
  pgEnum,
  boolean,
  timestamp,
  uniqueIndex,
  real,
  doublePrecision,
  primaryKey,
} from "drizzle-orm/pg-core";

//declaring an enum
export const genderEnum = pgEnum("gender_enum", ["man", "woman", "other"]);

//users
export const users = pgTable("users", {
  userId: uuid("user_id").primaryKey().unique().notNull().defaultRandom(),
  /*using a UUID is better than using an incremental integer id, because
    if you make branches, and add rows to each branch, once you try to merge the
    branches, they show a problem - two different rows with the same primary key.

    However. if we were to make a incremental integer primary key we would write:
    user_id: serial("user_id").primaryKey()
    which would have auto incremented the counter.    
  */

  phoneNumber: text("phone_number").notNull().unique(),
  originalAvatars: text("original_avatars")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`), //creates an empty text array by default. it must be populated, but it is not mandatory for the first phase of the registration
  smallAvatar: text("small_avatar"), //it is mandatory , but it is not mandatory for the first phase of the registration
  biography: text("biography"),
  //the template of date has to be: "MM/DD/YYYY" or "YYYY-MM-DD"!
  dateOfBirth: date("date_of_birth"),
  //gender is an enum - man, woman, other
  gender: genderEnum("gender"), //it is mandatory , but it is not mandatory for the first phase of the registration
  //is the user active, a.k.a, has the application on their phone
  active: boolean("active").default(true),
  //off-grid: the user has decided to be invisible and not see others
  offGrid: boolean("off-grid").default(true),
  nickname: text("nickname"), //it is mandatory , but it is not mandatory for the first phase of the registration
  //makes SQL create a timestamp once the record is created
  created: timestamp("created").defaultNow(),
  //is the user currently connected
  connected: boolean("connected").default(true),
  admin: boolean("admin").default(false),
  locationDate: timestamp("location_date"),
});
/*
uuid - a long long string for Ids
varchar - 255 char string. changes by use.
text - like varchar. just a better name
integer - a whole number
date - "The DATE type is used for values with a date part but no time part"
timestamp - type Date()
pgTable - how to create a table in postgres
primaryKey - the rows are defined by this column
unique - make sure it is unique
notNull - make sure it's not null
defaultRandom - create a random value

*/

/*
we also added a column named "location" of type "geography". 
we did that through the sql editor in Neon. Because Drizzle couldn't handle it.

This is the sql code line: 
//*ALTER TABLE "users" ADD COLUMN "user_location" geography;

Then we added a GIST index to the user_location column (to make it faster):
//*CREATE INDEX ON users USING gist(user_location);

mind you that you need to create the index BEFORE inserting data.
*/

//tagsUsers
export const tagsUsers = pgTable(
  "tags_users",
  {
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.tagId), //add a reference to tagTemplate table
    userId: uuid("user_id")
      .notNull()
      .references(() => users.userId),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.tagId, table.userId] }), //composite primary key
    };
  },
);

//tags  ex. "sea", "JavaScript", "basketball"
export const tags = pgTable("tags", {
  tagId: uuid("tag_id").primaryKey().notNull().unique().defaultRandom(),
  tagContent: text("tag_content").notNull(), //tag_content should not be unique, since there might be similar tags of different categories.
});

//joint table of tag templates and tag categories
export const tagsTagCats = pgTable(
  "tags_tag_cats",
  {
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.tagId),
    tagCategoryId: uuid("tag_category_id")
      .notNull()
      .references(() => tagCategories.tagCategoryId),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.tagCategoryId, table.tagId] }), //composite primary key
    };
  },
);

//tag template categories ex. "sports", "computer science", "90's kid"
export const tagCategories = pgTable("tag_categories", {
  tagCategoryId: uuid("tag_category_id")
    .primaryKey()
    .notNull()
    .unique()
    .defaultRandom(),
  categoryName: text("category_name").notNull().unique(),
});

// connections (friendships)
export const connections = pgTable("connections", {
  connectionId: uuid("connection_id")
    .notNull()
    .unique()
    .defaultRandom()
    .primaryKey(),
  connectionDate: timestamp("connection_date").defaultNow().notNull(),
  connectedUser1: uuid("connected_user1")
    .notNull()
    .references(() => users.userId),
  connectedUser2: uuid("connected_user2")
    .notNull()
    .references(() => users.userId),
});

// received connection requests
export const receivedConnectionRequests = pgTable(
  "received_connection_requests",
  {
    receivedRequestId: uuid("received_request_id")
      .primaryKey()
      .defaultRandom()
      .unique()
      .notNull(),
    recipientId: uuid("recipient_id")
      .notNull()
      .references(() => users.userId),
    senderId: uuid("sender_id")
      .notNull()
      .references(() => users.userId),
    requestDate: timestamp("request_date").defaultNow(),
    unread: boolean("unread").notNull().default(true),
  },
);

// sent connection requests
export const sentConnectionRequests = pgTable("sent_connection_requests", {
  sentRequestId: uuid("sent_request_id")
    .notNull()
    .primaryKey()
    .defaultRandom()
    .unique(),
  recipientId: uuid("recipient_id")
    .notNull()
    .references(() => users.userId),
  senderId: uuid("sender_id")
    .notNull()
    .references(() => users.userId),
  requestDate: timestamp("request_date").defaultNow().notNull(),
});

//blocks
export const blocks = pgTable("blocks", {
  blockId: uuid("block_id").primaryKey().defaultRandom().notNull().unique(),
  blockingUserId: uuid("blocking_user_id")
    .notNull()
    .references(() => users.userId),
  blockedUserId: uuid("blocked_user_id")
    .notNull()
    .references(() => users.userId),
  blockDate: timestamp("block_date").defaultNow().notNull(),
});

//chats
export const chats = pgTable("chats", {
  chatId: uuid("chat_id").primaryKey().defaultRandom().unique().notNull(),
  participant1: uuid("participant1")
    .notNull()
    .references(() => users.userId),
  participant2: uuid("participant2")
    .notNull()
    .references(() => users.userId),
});

//declaring an enum for message types
export const messageTypeEnum = pgEnum("message_type_enum", ["image", "text"]);

//chat messages

//we want the search of messages to go this way: each chat message has a chat id.
//that way we can index the chat messages with the chat id field.
//plus, when you just need to fetch all the messages of a certain chat id, it is more efficient
//than to search every message for the existence of two specific chat participants
export const chatMessages = pgTable(
  "chat_messages",
  {
    messageId: uuid("message_id")
      .primaryKey()
      .unique()
      .notNull()
      .defaultRandom(),
    chatId: uuid("chat_id")
      .notNull()
      .references(() => chats.chatId),
    date: timestamp("date").defaultNow().notNull(),
    sender: uuid("sender")
      .notNull()
      .references(() => users.userId),
    recipient: uuid("recipient")
      .notNull()
      .references(() => users.userId),
    type: messageTypeEnum("type").notNull(),
    imageURI: text("image_URI"), //if not image, don't insert anything, and it will be null
    text: text("text"), //if not text, don't insert anything, and it will be null
    unread: boolean("unread").default(true).notNull(),
    receivedSuccessfully: boolean("received_successfully")
      .default(false)
      .notNull(),
  },
  (table) => {
    return {
      /** we will be looking for all the messages that two users share in a chat room.
      So, will will search the "chat_messages" table for all the messages of that chat.
      That is why we should index the "chat_Id" column.
      */
      chatMessageIndex: uniqueIndex("chat_message_index").on(table.chatId),
    };
  },
);

//notification templates
export const notificationTemplates = pgTable("notification_templates", {
  notificationId: uuid("notification_id")
    .primaryKey()
    .notNull()
    .defaultRandom()
    .unique(),
  notificationName: text("notification_name").notNull().unique(),
  content: text("content").notNull(),
});

//event history
export const events = pgTable("events", {
  eventId: uuid("event_id").primaryKey().defaultRandom().notNull().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.userId),
  eventDate: timestamp("event_date").defaultNow().notNull(),
  eventType: uuid("event_type")
    .notNull()
    .references(() => eventTypes.eventTypeId),
  /*
  so, let's assume a user has blocked another user. a record will be added to the "blocks"
  table. that record will have a "block_id". through this id we can extrapolate data on 
  this event. the field "relevant_table_primary_key" records just that.
  */
  relevantTablePrimaryKey: uuid("relevant_table_primary_key").notNull(),
  //location_as_text is only relevant when storing location history of a user, else it is null
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
});

//declaring an enum for table names
export const tablesEnum = pgEnum("tables_enum", [
  "users",
  "location_records",
  "connections",
  "sent_connection_requests",
  "received_connection_requests",
  "blocks",
  "chats",
  "chat_messages",
  "tags",
  "tag_categories",
  "notificationTemplates",
]);

export const eventTypes = pgTable("event_types", {
  eventTypeId: uuid("event_type_id")
    .primaryKey()
    .notNull()
    .unique()
    .defaultRandom(),
  eventTypeName: text("event_type_name").notNull().unique(),
  tableAffected: tablesEnum("table_affected").notNull(),
});

//************************************************************* */
//************************************************************* */
// RELATIONS
// only needed for Drizzle to know which columns it can associate with which column

export const userRelations = relations(users, ({ many }) => ({
  tagsUsers: many(tagsUsers),
  connections: many(connections),
  receivedConnectionRequests: many(receivedConnectionRequests),
  sentConnectionRequests: many(sentConnectionRequests),
  blocks: many(blocks),
  chats: many(chats),
  events: many(events),
}));

export const tagsUsersRelations = relations(tagsUsers, ({ one }) => ({
  user: one(users, {
    fields: [tagsUsers.userId],
    references: [users.userId],
  }),
  tag: one(tags, {
    fields: [tagsUsers.tagId],
    references: [tags.tagId],
  }),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  tagsUsers: many(tagsUsers),
  tagCategories: many(tagsTagCats),
}));

export const tagOnTagCatRelations = relations(tagsTagCats, ({ one }) => ({
  tag: one(tags, {
    fields: [tagsTagCats.tagId],
    references: [tags.tagId],
  }),
  tagCategory: one(tagCategories, {
    fields: [tagsTagCats.tagCategoryId],
    references: [tagCategories.tagCategoryId],
  }),
}));

export const tagCategoryRelations = relations(tagCategories, ({ many }) => ({
  tags: many(tags),
}));

export const connectionsRelations = relations(connections, ({ one }) => ({
  connectedUser1: one(users, {
    fields: [connections.connectedUser1],
    references: [users.userId],
  }),
  connectedUser2: one(users, {
    fields: [connections.connectedUser2],
    references: [users.userId],
  }),
}));

export const receivedConnectionRequestRelations = relations(
  receivedConnectionRequests,
  ({ one }) => ({
    recipientId: one(users, {
      fields: [receivedConnectionRequests.recipientId],
      references: [users.userId],
    }),
    senderId: one(users, {
      fields: [receivedConnectionRequests.senderId],
      references: [users.userId],
    }),
  }),
);

export const sentConnectionRequestRelations = relations(
  sentConnectionRequests,
  ({ one }) => ({
    recipientId: one(users, {
      fields: [sentConnectionRequests.recipientId],
      references: [users.userId],
    }),
    senderId: one(users, {
      fields: [sentConnectionRequests.senderId],
      references: [users.userId],
    }),
  }),
);

export const blocksRelations = relations(blocks, ({ one }) => ({
  blockingUserId: one(users, {
    fields: [blocks.blockingUserId],
    references: [users.userId],
  }),
  blockedUserId: one(users, {
    fields: [blocks.blockedUserId],
    references: [users.userId],
  }),
}));

export const chatsRelations = relations(chats, ({ one, many }) => ({
  participant1: one(users, {
    fields: [chats.participant1],
    references: [users.userId],
  }),
  participant2: one(users, {
    fields: [chats.participant1],
    references: [users.userId],
  }),
  chatMessage: many(chatMessages),
}));

export const chatMessageRelations = relations(chatMessages, ({ one }) => ({
  chatId: one(chats, {
    fields: [chatMessages.chatId],
    references: [chats.chatId],
  }),
  //relation name
  sender: one(users, {
    //foreign key
    fields: [chatMessages.sender],
    //references
    references: [users.userId],
  }),
  recipient: one(users, {
    fields: [chatMessages.recipient],
    references: [users.userId],
  }),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  eventType: one(eventTypes, {
    //this foreign key
    fields: [events.eventType],
    //references
    references: [eventTypes.eventTypeId],
  }),
}));

export const eventTypesRelations = relations(eventTypes, ({ many }) => ({
  events: many(events),
}));
