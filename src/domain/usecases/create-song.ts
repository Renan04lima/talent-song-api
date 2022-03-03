export interface CreateSong {
  create: (input: CreateSong.Input) => Promise<CreateSong.Output>
}

export namespace CreateSong {
  export type Input = {
    userId: string
    songName: string
    artist: string
    album: string
  }

  export type Output = {
    favoriteId: string
    songName: string
    artist: string
    album: string
  }
}
