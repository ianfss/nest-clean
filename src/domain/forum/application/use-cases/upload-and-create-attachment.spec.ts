import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { UploadAndCreateAttachmenUseCase } from './upload-and-create-attachment'
import { FakeUploader } from 'test/storage/fake-uploader'
import { InvalidFileTypeError } from './errors/invalid-file-type-error'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let fakeUploader: FakeUploader
let sut: UploadAndCreateAttachmenUseCase

describe('Upload and Create Attachment', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    fakeUploader = new FakeUploader()
    sut = new UploadAndCreateAttachmenUseCase(
      inMemoryAttachmentsRepository,
      fakeUploader,
    )
  })

  it('should be able to upload and create an attachment', async () => {
    const result = await sut.execute({
      fileName: 'sample-upload.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    })
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'sample-upload.png',
      }),
    )
  })

  it('should not be able to upload an attachment with wrong file type', async () => {
    const result = await sut.execute({
      fileName: 'sample-upload.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidFileTypeError)
  })
})
