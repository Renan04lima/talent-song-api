export interface GetSongs {
  get: (input: GetSongs.Input) => Promise<GetSongs.Output>
}

export namespace GetSongs {
  export type Input = {
    userId: string
    songName?: string
    artist?: string
    album?: string
  }

  export type Output = Array<{
    favoriteId: string
    songName: string
    artist: string
    album: string
  }>
}
