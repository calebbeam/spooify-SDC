DROP TABLE IF EXISTS Playlists, Tracks, Albums, Artists;

CREATE TABLE Artists (
    artist_id text PRIMARY KEY,
    artist_name text,
    followers bigint, 
    image text
);

CREATE TABLE Albums (
    album_id text PRIMARY KEY,
    album_name text,
    year_made bigint,
    song_amount bigint,
    total_duration bigint,
    artist_id text REFERENCES Artists(artist_id),
    photo text
);

CREATE TABLE Tracks (
    track_id text PRIMARY KEY,
    name text,
    duration bigint,
    album_id text REFERENCES Albums(album_id),
    artist_id text REFERENCES Artists(artist_id),
    featured_artist text REFERENCES Artists(artist_id)
);

CREATE TABLE Playlists (
    playlist_key serial PRIMARY KEY,
    playlist_id bigint,
    playlist_name text,
    username text,
    song_amount bigint,
    playlist_duration bigint,
    track_id text REFERENCES Tracks(track_id),
    date_added bigint
);
