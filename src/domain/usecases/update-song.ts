export interface UpdateSong {
  update: (input: UpdateSong.Input) => Promise<UpdateSong.Output>
}

export namespace UpdateSong {
  export type Input = {
    userId: string
    favoriteId: string
    songName?: string
    artist?: string
    album?: string
  }

  export type Output = {
    songName: string
    artist: string
    album: string
  }
}
