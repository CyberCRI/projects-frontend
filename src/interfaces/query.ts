// add reverse order for each each (for backend ordering)
// like: Ordering<'create_at' | 'email'>
// output: 'create_at' | '-create_at' | 'email' | '-email'
export type Ordering<T extends string> = `-${T}` | T
