import {
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./auth";

/*
  gc - generated content
  ugc - user generated content
*/
export const playlistKinds = pgEnum("playlist_kinds", ["gc", "ugc"]);

export const playlists = pgTable("playlists", {
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  id: text().primaryKey(),
  title: text().notNull(),
  coverUrl: text("coverUrl"),
  kind: playlistKinds().notNull(),
  created: timestamp()
    .$defaultFn(() => new Date())
    .notNull(),
  modified: timestamp()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const trackStates = pgEnum("track_states", [
  "waiting",
  "processing",
  "ready",
  "failed",
]);

export const tracks = pgTable("tracks", {
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  id: text().primaryKey(),
  title: text().notNull(),
  coverUrl: text("coverUrl"),
  state: trackStates().notNull(),
  created: timestamp()
    .$defaultFn(() => new Date())
    .notNull(),
  modified: timestamp()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const playlistToTrack = pgTable(
  "playlist_to_track",
  {
    playlistId: text("playlist_id")
      .notNull()
      .references(() => playlists.id, {
        onDelete: "cascade",
      }),
    trackId: text("track_id")
      .notNull()
      .references(() => tracks.id, {
        onDelete: "cascade",
      }),
  },
  (t) => [primaryKey({ columns: [t.playlistId, t.trackId] })]
);
