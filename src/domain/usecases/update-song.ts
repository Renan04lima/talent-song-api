import { UpdateSongRepo, SongBelongToTheUserRepo } from '@/domain/contracts/repos'
import { NotBelogsError } from '@/application/errors/not-belongs'

type Input = { userId: string, favoriteId: string, songName?: string, artist?: string, album?: string }
type Output = { songName: string, artist: string, album: string}
type Setup = (updateSongRepo: UpdateSongRepo, songBelongToTheUserRepo: SongBelongToTheUserRepo) => UpdateSong
export type UpdateSong = (input: Input) => Promise<Output>

export const setupUpdateSong: Setup = (updateSongRepo, songBelongToTheUserRepo) => async ({ favoriteId, userId, songName, artist, album }) => {
  const belongs = await songBelongToTheUserRepo.belong({ favoriteId, userId })
  if (!belongs) throw new NotBelogsError()
  const songs = await updateSongRepo.update({ favoriteId, userId, songName, artist, album })
  return songs
}
