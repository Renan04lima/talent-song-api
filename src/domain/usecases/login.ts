type Input = { email: string, password: string }
type Output = { token: string}
export type Login = (input: Input) => Promise<Output>
