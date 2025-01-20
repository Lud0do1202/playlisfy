import { TrackAttributes } from '../models/track';
import { DB } from '../models/database';
import { ISeeder } from './iseeder';

export class TrackSeeder implements ISeeder<TrackAttributes> {
    seed(): void {
        const tracks = this.getValues();
        tracks.forEach(track => DB.TrackModel.create(track));
    }

    getValues(): TrackAttributes[] {
        return [
            {
                spotifyId: '1mvI5pGoh84IiFSbWxEkGH',
                uri: 'spotify:track:1mvI5pGoh84IiFSbWxEkGH',
                name: 'CLOUDS',
                artists: 'NF',
                duration: 243760,
                status: 'NOT_STARTED',
                bpm: 128,
                characters: 'Bold, Unpolished, Cool, Powerful',
                description: "A motivational, and anthemic hip - hop record. it's gonna make you bob your head!",
                genres: 'Rap Hip - Hop, Pop, R&B, Pop-Rap',
                instruments: 'Bass Guitar, Electric Guitar, Percussion, Electronic Drums, Drum Kit',
                moods: 'Confident, Resolute, Strong, Determined, Powerful',
                movements: 'Stomping',
                voices: 'Male',
            },
            {
                spotifyId: '5r9OlaHzqlOKkFAv0q5Gm3',
                uri: 'spotify:track:5r9OlaHzqlOKkFAv0q5Gm3',
                name: 'Wasteland',
                artists: 'Arcane',
                duration: 161133,
                status: 'NOT_STARTED',
                bpm: 128,
                characters: 'Epic',
                description: "Fire burning in my soul, it's my right to have it all.",
                genres: 'Pop',
                instruments: 'Piano, Synthesizer, Electronic Piano, Electronic Drums, Percussion',
                moods: 'Emotional, Soaring, Cold, Supernatural, Mysterious',
                movements: 'Flowing',
                voices: 'Female',
            },
        ];
    }
}
