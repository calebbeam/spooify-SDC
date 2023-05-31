import { faker } from '@faker-js/faker';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'spooify_db',
  password: 'docker',
  port: 5432, // Change if necessary
});

// Function to generate random data for the Artists table
function generateArtistsData() {
  const artists = [];
  for (let i = 0; i < 10000; i++) {
    const artist = {
      artist_id: faker.string.uuid(),
      artist_name: faker.person.fullName(),
      followers: faker.number.int({ min: 1, max: 100000 
      }),
      image: faker.image.url(),
    };
    artists.push(artist);
  }
  return artists;
}

// Function to generate random data for the Albums table
function generateAlbumsData(artists) {
  const albums = [];
  for (let i = 0; i < 10000; i++) {
    const artist = faker.helpers.arrayElement(artists);
    const album = {
      album_id: faker.string.uuid(),
      album_name: faker.word.sample(),
      year_made: faker.number.int({ min: 1950, max: 2023 }),
      song_amount: faker.number.int({ min: 1, max: 20 }),
      total_duration: faker.number.int({ min: 1, max: 100000 }),
      artist_id: artist.artist_id,
      photo: faker.image.url(),
    };
    albums.push(album);
  }
  return albums;
}

// Function to generate random data for the Tracks table
function generateTracksData(artists, albums) {
  const tracks = [];
  let trackIdCounter = 1; // Start with a value of 1

  for (let i = 0; i < 10000; i++) {
    const artist = faker.helpers.arrayElement(artists);
    const album = faker.helpers.arrayElement(albums);

    const track = {
      track_id: trackIdCounter, // Use the trackIdCounter as the track_id value
      name: faker.word.sample(),
      duration: faker.number.int({ min: 1, max: 10000 }),
      album_id: album.album_id,
      artist_id: artist.artist_id,
      featured_artist: faker.helpers.arrayElement(artists).artist_id,
    };

    tracks.push(track);
    trackIdCounter++; // Increment the counter for the next iteration
  }

  return tracks;
}


// Function to generate random data for the Playlists table
function generatePlaylistsData(tracks) {
  const playlists = [];
  for (let i = 0; i < 10000; i++) {
    const playlist = {
      playlist_id: faker.number.int(),
      playlist_name: faker.word.sample(),
      username: faker.internet.userName(),
      song_amount: faker.number.int({ min: 1, max: 100 }),
      playlist_duration: faker.number.int({ min: 1, max: 1000 }),
      track_id: faker.helpers.arrayElement(tracks).track_id,
      date_added: faker.date.recent().getTime(),
    };
    playlists.push(playlist);
  }
  return playlists;
}

async function insertData() {
  const artistsData = generateArtistsData();
  const albumsData = generateAlbumsData(artistsData);
  const tracksData = generateTracksData(artistsData, albumsData);
  const playlistsData = generatePlaylistsData(tracksData);

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Insert data into the Artists table
    for (const artist of artistsData) {
      await client.query('INSERT INTO Artists (artist_id, artist_name, followers, image) VALUES ($1, $2, $3, $4)', [
        artist.artist_id,
        artist.artist_name,
        artist.followers,
        artist.image,
      ]);
    }

    // Insert data into the Albums table
    for (const album of albumsData) {
      await client.query('INSERT INTO Albums (album_id, album_name, year_made, song_amount, total_duration, artist_id, photo) VALUES ($1, $2, $3, $4, $5, $6, $7)', [
        album.album_id,
        album.album_name,
        album.year_made,
        album.song_amount,
        album.total_duration,
        album.artist_id,
        album.photo,
      ]);
    }

    // Insert data into the Tracks table
    for (const track of tracksData) {
      await client.query('INSERT INTO Tracks (track_id, name, duration, album_id, artist_id, featured_artist) VALUES ($1, $2, $3, $4, $5, $6)', [
        track.track_id,
        track.name,
        track.duration,
        track.album_id,
        track.artist_id,
        track.featured_artist,
      ]);
    }

    // Insert data into the Playlists table
    for (const playlist of playlistsData) {
      await client.query(`INSERT INTO Playlists (playlist_id, playlist_name, username, song_amount, playlist_duration, track_id, date_added) VALUES ($1, $2, $3, $4, $5, $6::bigint, $7)`, [
        playlist.playlist_id,
        playlist.playlist_name,
        playlist.username,
        playlist.song_amount,
        playlist.playlist_duration,
        playlist.track_id,
        playlist.date_added,
      ]);
    }

    await client.query('COMMIT');
    console.log('Data inserted successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error inserting data:', err);
  } finally {
    client.release();
    pool.end();
  }
}

// Call the function to insert data
insertData();
