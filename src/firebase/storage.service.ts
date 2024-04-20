import { Injectable } from "@nestjs/common";
import { FirebaseService } from "./firebase.service";
interface UploadInfo {
    file: Express.Multer.File;
    key: string;
}

@Injectable()
export class StorageService {
    constructor(
        public readonly firebaseService: FirebaseService
    ) { }

    uploadFile(info: UploadInfo): Promise<string> {
        const bucket = this.firebaseService.getStorage().bucket()
        const { originalname, buffer, mimetype } = info.file;
        let filename = info.key || originalname;
        if (filename.startsWith('/')) {
            filename = filename.substring(1);
        }
        const fileRef = bucket.file(filename);

        const blobStream = fileRef.createWriteStream({
            metadata: {
                contentType: mimetype,
            },
        });
        return new Promise<string>((resolve, reject) => {
            blobStream.on('error', error => reject(error));
            blobStream.on('finish', async () => {
                try {
                    await fileRef.makePublic();
                    resolve(fileRef.name)
                } catch (error) {
                    reject(error);
                }
            });
            blobStream.end(buffer);
        });
    }

}