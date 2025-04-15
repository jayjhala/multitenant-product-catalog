// src/common/dto/response.dto.ts

export class ResponseDto<T> {
  success: boolean;
  message: string;
  data?: T; // Optional, will be populated when the operation is successful
  error?: string; // Optional, will be populated when an error occurs
}
