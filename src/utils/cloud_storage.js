const { Storage } = require('@google-cloud/storage');
const { format } = require('util');
const { randomUUID } = require('crypto');


const storage = new Storage({
    projectId: "fir-mvvm-237fb",
    keyFilename: './serviceAccountKey.json'
});

const bucket = storage.bucket("fir-mvvm-237fb.appspot.com");


module.exports = (file, pathImage) => {
    return new Promise((resolve, reject) => {
        
        if (!pathImage) {
            reject('La ruta del archivo es obligatoria');
            return;
        }

        const uuid = randomUUID(); // token unico por archivo
        let fileUpload = bucket.file(`${pathImage}`);
        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype,
                metadata: {
                    firebaseStorageDownloadTokens: uuid,
                }
            },
            resumable: false

        });

        blobStream.on('error', (error) => {
            console.log('Error al subir archivo a firebase', error);
            reject('Something is wrong! Unable to upload at the moment.');
        });

        blobStream.on('finish', () => {
            // The public URL can be used to directly access the file via HTTP.
            const url = format(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileUpload.name)}?alt=media&token=${uuid}`);
            console.log('URL DE CLOUD STORAGE ', url);
            resolve(url);
        });

        blobStream.end(file.buffer);
    });
}
