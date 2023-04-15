import { addDoc, collection,deleteDoc , Timestamp,doc,getDocs, updateDoc, orderBy, limit,query, queryEqual, setDoc, where, getDoc, arrayUnion, deleteField, startAfter } from 'firebase/firestore';
import { db } from './firebase';



export const addUser = async(uid, email) => { // When adding a security list to firebase make sure you cant add user with admin tags
    try{
        await setDoc(doc(db, 'users', uid), {uid, 
                                            email, 
                                            points:0, 
                                            submissions:[], 
                                            ownedDocs: []
                                        });
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

export const addSubmission = async(uid, courseName, title, description, academicYear ,bucket) => {
    const dateNow = Timestamp.now();
    try {
        const response = await addDoc(collection(db, 'submissions'), {
            uid, 
            courseName, 
            title,
            description,
            academicYear, 
            bucket,
            dateSubmitted:dateNow, 
            status:'review'
        });
        await updateDoc(doc(db, 'users', uid), {
            submissions: arrayUnion(response.id)
         });
    } catch(e) {
        console.log(e);
    }
};
// 
export const listSubmissions = async(limitList) => { // Security note, make sure only admin can get the list of submissions
    try {
        const limitQuery = limitList === undefined ? 50 : limitList;
        const collectionRef = query(collection(db, "submissions"), where("status", "==", "review"), orderBy("dateSubmitted"), limit(limitQuery));
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
    const dateNow = Timestamp.now();
    try{
        await updateDoc(doc(db,'submissions',docID), {
            status: 'accepted', 
            message:deleteField(),
            bucket:deleteField(),
            completeBucket:completeBucket, 
            previewBucket:previewBucket, 
            acceptedAt:dateNow
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
    const dateNow = Timestamp.now();
    await updateDoc(doc(db,'submissions',uid), {status: 'fix', message: messageFix, bucket:'none'});
}

export const changeToPendingReview = async(uid, courseName, title,bucket, description, academicYear) => { // Moves the submission from the pending fix firestore to the pendingF review firestore.
    const dateNow = Timestamp.now();
    updateDoc(doc(db, 'submissions', uid), {status: 'review', description, academicYear,courseName, title,dateFixSubmitted:dateNow, bucket:bucket});
} // USer will use this, update the paramets with what user will update.

export const changeToCompleteRejection = (uid, messageReject) => {
    const dateNow = Timestamp.now();
    updateDoc(doc(db, 'submissions', uid), {status: 'rejected', bucket:'none',message:messageReject});
}


export const getCourses = async() => {
    try {
        const collectionRef = query(collection(db, "courses"));
        const courses =  await getDocs(collectionRef);
        console.log(courses)
        return courses;
    }catch(e) {
        console.log(e)
    }
}

export const getCourseDocs = async(courseName, lastRequested) => { // Continue this. Add another 'where' also chance the course to conaint one document with all the the coursesName. cheaper.
    try {
        let collectionRef;
        if(lastRequested === undefined){
            collectionRef = query(collection(db, "submissions"), where("courseName", "==", courseName),where("status", "==", "accepted"), orderBy("dateSubmitted"), limit(9)); 
        }else {
            collectionRef = query(collection(db, "submissions"), where("courseName", "==", courseName),where("status", "==", "accepted"), orderBy("dateSubmitted"), limit(9), startAfter(lastRequested.docs[lastRequested.docs.length - 1]));
        }
        const submissions =  await getDocs(collectionRef);
        return submissions;
    }catch(e) {
        console.log(e)
    }
}

export const getUserPoints = async(uid) => {
    try{
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        const points = data.points;
        return points;
    } catch(e) {
        console.log(e);
    }
}

export const addPointsToUser = async(uid, prevPoints) => {
    try{
        const docRef = doc(db, 'users', uid);
        await docRef.updateDoc({ points: prevPoints + 10 });
    }catch(e) {
        console.log(e);
    }
}

export const deductPointsFromUser = async(uid, prevPoints) => {
    try{
        const docRef = doc(db, 'users', uid);
        const points = prevPoints - 10;
        console.log(points);
        console.log(prevPoints);
        await updateDoc(docRef, { points: points})
    } catch(e) {
        console.log(e);
    }
}

export const addDocToUserOwned = async(userID, submissionID) => {
    try {
        const docRef = doc(db, 'users', userID);
        console.log(submissionID)
        await updateDoc(docRef,{ ownedDocs: arrayUnion(submissionID) })
    } catch (e) {
        console.log(e);
    }
}

export const getUserOwnedDocs = async(userID) => {
    try {
        const docRef = doc(db, 'users', userID);
        const response = await getDoc(docRef);
        const ownedDocs = response.data().ownedDocs;
        console.log(ownedDocs)
        return ownedDocs;
    } catch (e) {
        console.log(e);
    }
}