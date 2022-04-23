import axios, { CancelTokenSource } from "axios";
import client from "./client";

interface FileResponse {
  encoding: string;
  id: string;
  mimetype: string;
  originalname: string;
  size: number;
}

export class FileUploadHandler {
  private cancelToken: CancelTokenSource;

  public onUploadProgress?: (progressEvent: ProgressEvent) => void;
  public request: Promise<FileResponse>;
  public file: File;

  constructor(url: string, file: File) {
    this.file = file;
    this.cancelToken = axios.CancelToken.source();

    const form = new FormData();
    form.append("files", file);
    this.request = axios
      .post(url, form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => this.onUploadProgress?.(e),
        cancelToken: this.cancelToken.token,
      })
      .then((res) => res.data.data?.[0]);
  }

  public cancel() {
    this.cancelToken.cancel();
  }
}

const fileApi = {
  postFile: (file: File) => {
    return new FileUploadHandler(process.env.REACT_APP_STATIC_URL + "/files", file);
  },

  postBlobFile: (blob: Blob): Promise<Array<FileResponse>> => {
    return client.post(
      "/files",
      { files: blob },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
};

export default fileApi;
