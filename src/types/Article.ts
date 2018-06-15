export type TextBlock = {
  index?: number
  text: [string]
  author?: string
};

export type FileData = {
  title: string
  month: 'string'
  day: 'string'

  intro: TextBlock
  body: TextBlock[]
  conclusion: TextBlock
};