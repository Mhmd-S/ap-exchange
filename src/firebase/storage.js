import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { format } from 'date-fns';

const BUCKET_URL = "gs://fir-1-2436b.appspot.com";

// Deletes a submsission from the 'submission' storage.
export const deleteFromStorage = async(bucket) => {
    const storageRef = ref(storage, bucket);
    deleteObject(storageRef);
}

export const uploadFile = async(file, uid) => {
    try{
        const formattedDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'2'");
        const bucket = `${BUCKET_URL}/submitted/${uid}/${formattedDate}.pdf`;
        const storageRef = ref(storage, bucket);
        await uploadBytes(storageRef, file);
        return bucket;
    }catch(e){
        console.log(e);
    }
}

export const getFile = async(bucket) => {
    try{
    const gsReference = ref(storage, bucket);
    const downloadURL = await getDownloadURL(gsReference);
    return downloadURL;
    } catch(e) {
        console.log(e);
    }
    
}

// Can upload the preview document or the completed one, depending on the mode. If mode is true then the completed will be uploaded if otherwise the preview will be uploaded
export const addVerifeidFile = async(file, courseName, mode) => {
    try {
        const formattedDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'2'");
        const bucket = `${BUCKET_URL}/${mode ? 'completed' : 'previews'}/${courseName}/${formattedDate}.pdf`;
        const storageRef = ref(storage, bucket);
        await uploadBytes(storageRef, file);
        return bucket;
    }catch(e){
        console.log(e);
    }
}


export const moveToPendingFixStorage = async(file) => {
    try {
        const formattedDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'2'");
        const bucket = `${BUCKET_URL}/${'pendingFix'}/${formattedDate}.pdf`;
        const storageRef = ref(storage, bucket);
        await uploadBytes(storageRef, file);
        return bucket;
    }catch(e){
        console.log(e);
    }
}

export const moveToPendingReviewStorage = async(file) => {
    try {
        const formattedDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'2'");
        const bucket = `${BUCKET_URL}/${'pendingReview'}/${formattedDate}.pdf`;
        const storageRef = ref(storage, bucket);
        await uploadBytes(storageRef, file);
        return bucket;
    }catch(e){
        console.log(e);
    }
}
