import { addDoc, collection,deleteDoc, doc,getDocs, updateDoc, orderBy, query, queryEqual, setDoc, where, getDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebase';
import { format } from 'date-fns';


export const addUser = async(uid, email) => { // When adding a security list to firebase make sure you cant add user with admin tags
    try{
        await setDoc(doc(db, 'users', uid), {uid,email,points:0, accepted:[],rejected:[], pendingFix:[], pendingReview:[]});
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
        const response = await addDoc(collection(db, 'submissions'), {uid, courseName, title, bucket,date:formattedDate, status:'review'});
        await updateDoc(doc(db, 'users', uid), {
            pendingReview: arrayUnion(response.id)
         });
    } catch(e) {
        console.log(e);
    }
};

export const removeSubmission = async(docId) => {
    deleteDoc(doc(db, 'submissions', docId)).catch(e=>console.log(e));
}

export const listSubmissions = async() => { // Security note, make sure only admin can get the list of submissions
    try {
        const collectionRef = collection(db, "submissions");
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

export const addVerified = async( courseName, title, completeBucket, previewBucket) => {
        const formattedDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'2'");
        try{
            const docRef = doc(db, "courses", courseName);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) { // Checks if the course exists.
                // Adds a document retaining information to the complete submissions.
                addDoc(collection(db, 'courses',courseName,'assignments'), { title, completeBucket, previewBucket,date:formattedDate});
              } else {
                // Creates a new doc for the coursename which will hold a collection of assigments completed submissions
                addDoc(collection(db, 'courses',courseName,'assignments'),{ title, completeBucket, previewBucket,date:formattedDate} )
              }
            } catch(e){
                console.log(e);
            }
}

// Removes a document from the pending folder. If mode == false the doc will be remved from pendingReview else it will be removed from pendingFix
export const removePending = async(uid, mode) => {
    try{
        await deleteDoc(doc(db, mode ? 'pendingFix' : 'pendingReview', uid));
    } catch(e) {
        console.log(e);
    }
}  

export const moveToPendingFix = (uid,courseName,title,bucket,message) => { // Moves the submission from the submission firestore to the pendingFix firestore.
    const formattedDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'2'");
    addDoc(collection(db, 'pendingFix'), {uid, courseName, date:formattedDate, title, bucket, message});
}

export const moveToPendingReview = (uid,courseName,title,bucket,message) => { // Moves the submission from the pending fix firestore to the pendingF review firestore.
    const formattedDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'2'");
    addDoc(collection(db, 'submissions'), {uid, courseName, date:formattedDate, title, bucket, message});
}

export const moveToCompleteRejection = (uid,courseName,title,message) => {
    const formattedDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'2'");
    addDoc(collection(db, 'rejectedSubmissions'), {uid, courseName, date:formattedDate, title, message});
}
