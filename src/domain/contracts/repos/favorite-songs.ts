export interface CreateSongRepo {
  create: (input: CreateSongRepo.Input) => Promise<CreateSongRepo.Output>
}

export namespace CreateSongRepo {
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

export interface GetSongsRepo {
  get: (input: GetSongsRepo.Input) => Promise<GetSongsRepo.Output>
}

export namespace GetSongsRepo {
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

export interface UpdateSongRepo {
  update: (input: UpdateSongRepo.Input) => Promise<UpdateSongRepo.Output>
}

export namespace UpdateSongRepo {
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

export interface SongBelongToTheUserRepo {
  belong: (input: SongBelongToTheUserRepo.Input) => Promise<boolean>
}

export namespace SongBelongToTheUserRepo {
  export type Input = {
    userId: string
    favoriteId: string
  }
}

export interface DeleteSongRepo {
  delete: (input: DeleteSongRepo.Input) => Promise<void>
}

export namespace DeleteSongRepo {
  export type Input = {
    userId: string
    favoriteId: string
  }
}
