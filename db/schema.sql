-- Raw data
CREATE TABLE IF NOT EXISTS matches (
    match_id VARCHAR PRIMARY KEY,
    set_id VARCHAR NOT NULL,
    game_datetime TIMESTAMP NOT NULL,
    player_puuid VARCHAR NOT NULL,
    placement INT NOT NULL
);

CREATE TABLE IF NOT EXISTS match_units (
    match_id VARCHAR REFERENCES matches(match_id),
    unit_name VARCHAR NOT NULL,
    tier INT,
    PRIMARY KEY(match_id, unit_name)
);

CREATE TABLE IF NOT EXISTS match_items (
    match_id VARCHAR REFERENCES matches(match_id),
    unit_name VARCHAR NOT NULL,
    item VARCHAR NOT NULL,
    PRIMARY KEY(match_id, unit_name, item)
);

CREATE TABLE IF NOT EXISTS match_augments (
    match_id VARCHAR REFERENCES matches(match_id),
    augment VARCHAR NOT NULL,
    is_legend BOOLEAN,
    PRIMARY KEY(match_id, augment)
);

-- Aggregated tables
CREATE TABLE IF NOT EXISTS champion_stats (
	champion TEXT NOT NULL,
	set_id TEXT NOT NULL,
	games_played INTEGER,
	avg_placement NUMERIC(4,2),
	top4_rate NUMERIC(3,2),
	last_updated TIMESTAMP DEFAULT NOW(),
	PRIMARY KEY(champion, set_id)
);

CREATE TABLE IF NOT EXISTS augment_stats (
	augment TEXT NOT NULL,
	set_id TEXT NOT NULL,
	games_played INTEGER,
	avg_placement NUMERIC(4,2),
	top4_rate NUMERIC(3,2),
	last_updated TIMESTAMP DEFAULT NOW(),
	PRIMARY KEY (augment, set_id)
);

CREATE TABLE IF NOT EXISTS item_stats (
	item TEXT NOT NULL,
	set_id TEXT NOT NULL,
	games_played INTEGER,
	avg_placement NUMERIC(4,2),
	top4_rate NUMERIC(3,2),
	last_updated TIMESTAMP DEFAULT NOW(),
	PRIMARY KEY (item, set_id)
);