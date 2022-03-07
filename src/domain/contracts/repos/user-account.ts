export interface LoadAccountByEmailRepo {
  load: (input: LoadAccountByEmailRepo.Input) => Promise<LoadAccountByEmailRepo.Output>
}

export namespace LoadAccountByEmailRepo {
  export type Input = {
    email: string
  }

  export type Output = {
    id: string
    password: string
  } | undefined
}
