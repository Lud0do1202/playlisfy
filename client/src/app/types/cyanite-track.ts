// export type CyaniteTrack = {
//   // id: number;
//   // title: string;
//   // artist: string;
//   // style: {
//   //   bpm: number;
//   //   mood: string;
//   //   genre: string;
//   //   instruments: string;
//   //   movement: string;

export type CyaniteTrack = {
  id: string;
  success: boolean;
  title?: string;
  description?: string;
  error?: 'OVERLOAD' | 'WAS_NOT_ANALYZED' | 'ENQUEUE_FAILED' | 'ALREADY_ENQUEUED';
};
