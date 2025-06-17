import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { AttachmentPresenter } from './attachment-presenter'

export class QuestionDetailsPresenter {
  static toHTTP(questionDetails: QuestionDetails) {
    return {
      questionId: questionDetails.questionId.toString(),
      author: {
        id: questionDetails.author.id.toString(),
        name: questionDetails.author.name,
      },
      attachments: questionDetails.attachments.map(AttachmentPresenter.toHTTP),
      title: questionDetails.title,
      slug: questionDetails.slug.value,
      bestAnswerId: questionDetails.bestAnswerId?.toString(),
      content: questionDetails.content,
      createdAt: questionDetails.createdAt,
      updatedAt: questionDetails.updatedAt,
    }
  }
}
