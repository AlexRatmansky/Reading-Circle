export type Article = {
  title: string
  date: string
  path: string
};

export type ert = {
  index?: number
  text: [string]
  author?: string
};

export type fileData = {
  title: string
  month: string
  day: string

  intro: ert
  body: [ert]
  conclusion: ert
};