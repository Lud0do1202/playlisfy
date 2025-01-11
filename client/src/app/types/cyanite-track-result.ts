import { CyaniteTrack } from "./cyanite-track";
import { MemorySpotifyHistory } from "./memory-spotify-history";

export type CyaniteTrackResult =
{ success: boolean; track: CyaniteTrack | null; historyTrack: MemorySpotifyHistory }
