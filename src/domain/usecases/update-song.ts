import { UpdateSongRepo } from '@/domain/contracts/repos'

type Input = { userId: string, favoriteId: string, songName?: string, artist?: string, album?: string }
type Output = { songName: string, artist: string, album: string}
type Setup = (updateSongRepo: UpdateSongRepo) => UpdateSong
export type UpdateSong = (input: Input) => Promise<Output>

export const setupUpdateSong: Setup = (updateSongRepo) => async input => {
  const songs = await updateSongRepo.update(input)
  return songs
}
