import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { InvalidFileTypeError } from './errors/invalid-file-type-error'
import { Attachment } from '../../enterprise/entities/attachment'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { Uploader } from '../storage/uploader'

interface UploadAndCreateAttachmenUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAndCreateAttachmenUseCaseResponse = Either<
  InvalidFileTypeError,
  {
    attachment: Attachment
  }
>

@Injectable()
export class UploadAndCreateAttachmenUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateAttachmenUseCaseRequest): Promise<UploadAndCreateAttachmenUseCaseResponse> {
    if (!/^(image\/(png|jpe?g)|application\/pdf)$/.test(fileType)) {
      return left(new InvalidFileTypeError(fileType))
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    })

    const attachment = Attachment.create({
      title: fileName,
      url,
    })

    await this.attachmentsRepository.create(attachment)

    return right({ attachment })
  }
}
