import { addDoc, collection,deleteDoc ,doc,getDocs, updateDoc, orderBy, query, queryEqual, setDoc, where, getDoc, arrayUnion, deleteField } from 'firebase/firestore';
import { db } from './firebase';
import { format } from 'date-fns';


export const addUser = async(uid, email) => { // When adding a security list to firebase make sure you cant add user with admin tags
    try{
        await setDoc(doc(db, 'users', uid), {uid,email,points:0, submissions:[]});
    } catch(e) {
        console.log(e);
    }
}

export const isAdmin = async(uid) => {
    try {
        const docRef = doc(db, "users", uid); 
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        const isVerified  = data.isAdmin;
        return isVerified; 
    }catch(e) {
        console.log(e)
    }
}

export const addSubmission = async(uid, courseName, title ,bucket) => {
    const formattedDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'2'");
    try {
        const response = await addDoc(collection(db, 'submissions'), {uid, courseName, title, bucket,dateSubmitted:formattedDate, status:'review'});
        await updateDoc(doc(db, 'users', uid), {
            submissions: arrayUnion(response.id)
         });
    } catch(e) {
        console.log(e);
    }
};

export const listSubmissions = async() => { // Security note, make sure only admin can get the list of submissions
    try {
        const collectionRef = query(collection(db, "submissions"), where("status", "==", "review"));
        const submissions =  await getDocs(collectionRef);
        return submissions;
    }catch(e) {
        console.log(e)
    }
};

export const getSubmission = async(docId) => {
    try {
        const docRef = doc(db, 'submissions', docId);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        return data;
    } catch(e) {
        console.log("Couldnt get sub from firestore");
    }
}

export const getUserSubmissionRef = async(uid) => {
    try {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        return data.submissions;
    } catch(e) {
        console.log("Couldnt get sub from firestore");
    }
}

export const acceptSubmission = async(docID ,courseName, title, completeBucket, previewBucket) => {
    const formattedDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'2'");
    try{
        await updateDoc(doc(db,'submissions',docID), {
            status: 'accepted', 
            message:deleteField(),
            bucket:deleteField(),
            completeBucket:completeBucket, 
            previewBucket:previewBucket, 
            acceptedAt:formattedDate
            }
        );
        
        const docRef = doc(db, 'courses', courseName);
        const docSnap = await getDoc(docRef);

        if(!docSnap.exists()){
            await setDoc(docRef, {assigments:[{docID}]});
        }else {
            await updateDoc(docRef,{ assigments: arrayUnion({docID})});
        }
        
    } catch(e){
        console.log(e);
    }
}

export const changeToPendingFix = async(uid,messageFix) => { // Moves the submission from the submission firestore to the pendingFix firestore.
    const formattedDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'2'");
    await updateDoc(doc(db,'submissions',uid), {status: 'fix', message: messageFix, bucket:'none'});
}

export const changeToPendingReview = async(uid) => { // Moves the submission from the pending fix firestore to the pendingF review firestore.
    const formattedDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'2'");
    updateDoc(doc(db, 'submissions', uid), {status: 'review'});
} // USer will use this, update the paramets with what user will update.

export const changeToCompleteRejection = (uid, messageReject) => {
    const formattedDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'2'");
    updateDoc(doc(db, 'submissions', uid), {status: 'rejected', bucket:'none',message:messageReject});
}
