export type QuestionType = {
  id: string
  code_source: string
  category: string
  difficulty: 'easy'|'medium'|'hard'|'impossible'
  question_text: string
  explanation?: string
  image_url?: string
  options: { text: string; is_correct: boolean }[]
  code_reference?: string
}

export const Question = {
  async list(_filters: any = null, _limit = 5000): Promise<QuestionType[]> {
    // TODO: connect to Google Apps Script data source
    return []
  },
  async filter(_filters: any = null, _cursor: any = null, _limit = 500): Promise<QuestionType[]> {
    return []
  }
}
