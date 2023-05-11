import { baseApiMultiPartFormClient } from '@utils/api';
import { UploadSchema } from '@schemas/UploadSchema';

export const uploadFile = (formData: FormData) => baseApiMultiPartFormClient.post<UploadSchema>('/files', formData);
