import { TrackAttributes } from '../models/track';
import { Database } from '../models/database';
import { ISeeder } from './iseeder';

export class TrackSeeder implements ISeeder<TrackAttributes> {
    seed(db: Database): void {
        const tracks = this.getValues();
        tracks.forEach(track => db.Track.create(track));
    }

    getValues(): TrackAttributes[] {
        return [
            {
                id: 1,
                spotifyId: '1',
                name: 'Track 1',
                artists: 'Artist 1',
                duration: 100,
                description: 'A track',
                instruments: ['guitar', 'drums'],
                genres: ['rock', 'pop'],
                keywords: ['happy', 'sad'],
                bpm: 120,
                moods: ['happy', 'sad'],
                movements: ['fast', 'slow'],
                characters: ['hero', 'villain'],
                status: 'NOT_STARTED',
                voices: ['man'],
            },
            {
                id: 2,
                spotifyId: '2',
                name: 'Track 2',
                artists: 'Artist 2',
                duration: 200,
                description: 'Another track',
                instruments: ['piano', 'drums'],
                genres: ['jazz', 'pop'],
                keywords: ['happy', 'sad'],
                bpm: 140,
                moods: ['happy', 'sad'],
                movements: ['fast', 'slow'],
                characters: ['hero', 'villain'],
                status: 'NOT_STARTED',
                voices: ['man', 'woman'],
            },
            {
                id: 3,
                spotifyId: '3',
                name: 'Track 3',
                artists: 'Artist 3',
                duration: 300,
                description: 'Yet another track',
                instruments: ['guitar', 'drums'],
                genres: ['rock', 'pop'],
                keywords: ['happy', 'sad'],
                bpm: 160,
                moods: ['happy', 'sad'],
                movements: ['fast', 'slow'],
                characters: ['hero', 'villain'],
                status: 'NOT_STARTED',
                voices: ['woman'],
            },
        ];
    }
}
