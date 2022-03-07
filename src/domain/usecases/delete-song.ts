import { DeleteSongRepo, SongBelongToTheUserRepo } from '@/domain/contracts/repos'
import { NotBelogsError } from '@/application/errors'

type Input = { userId: string, favoriteId: string }
type Setup = (deleteSongRepo: DeleteSongRepo, songBelongToTheUserRepo: SongBelongToTheUserRepo) => DeleteSong
export type DeleteSong = (input: Input) => Promise<void>

export const setupDeleteSong: Setup = (deleteSongRepo, songBelongToTheUserRepo) => async ({ favoriteId, userId }) => {
  const belongs = await songBelongToTheUserRepo.belong({ favoriteId, userId })
  if (!belongs) throw new NotBelogsError()
  await deleteSongRepo.delete({ favoriteId, userId })
}
