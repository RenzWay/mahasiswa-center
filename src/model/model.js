import {db} from "@/firebase/firebase";
import {addDoc, collection, deleteDoc, doc, getDocs, updateDoc} from "firebase/firestore"


export default class ModelFirestore {
    /*
    *  === Private collection for Model ===
    * */
    #task = collection(db, "task");
    #notes = collection(db, "notes");
    #schedule = collection(db, "schedule");

    /*
         === class method for Task Page ====

         include : get task, update task, add task, delete task
    */
    async getAllTask() {
        try {
            const response = await getDocs(this.#task)
            const tasks = response.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            return tasks
        } catch (err) {
            console.error(err)
            throw err
        }
    }

    async addTask(newTask) {
        try {
            const response = await addDoc(this.#task, newTask);
            return {id: response.id, ...newTask}
        } catch (err) {
            console.error("Add task error: ", err)
            throw err
        }
    }

    async updateTask(id, newTask) {
        try {
            const data = doc(db, "task", id);
            await updateDoc(data, newTask)
            return true
        } catch (err) {
            console.error(err)
            throw err
        }
    }

    async deleteTask(id) {
        try {
            const ref = doc(db, "task", id);
            await deleteDoc(ref);
            return true;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    /*
    * === Class method for note page ===
    * */

    async getAllNotes() {
        try {
            const res = await getDocs(this.#notes);
            return res.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
        } catch (err) {
            console.error(err)
            throw err;
        }
    }

    async addNote(newNote) {
        try {
            const docRef = await addDoc(this.#notes, newNote);
            return {id: docRef.id, ...newNote};
        } catch (err) {
            console.error(err);
            throw err;
        }
    }


    async updateNote(id, newNote) {
        try {
            const data = doc(db, "notes", id);
            await updateDoc(data, newNote);
            return true;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async deleteNote(id) {
        try {
            const res = await doc(this.#notes, id)
            return deleteDoc(res)
        } catch (err) {
            console.error(err)
        }
    }

    /*
    * === Class method for Schedule page ===
    * */

    async getAllSchedule() {
        try {
            const sched = await getDocs(this.#schedule)
            return sched.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
        } catch (err) {
            console.error(err)
            throw err;
        }
    }

    async addSchedule(newSchedule) {
        try {
            const sched = await addDoc(this.#schedule, newSchedule);
            return {id: sched.id, ...newSchedule}
        } catch (e) {
            console.error(e);
            throw e
        }
    }

    async updateSchedule(id, schedule) {
        try {
            const sched = await doc(db, "schedule", id);
            await updateDoc(sched, this.#schedule, schedule);
            return true;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async deleteSchedule(id) {
        try {
            const sched = await doc(db, "schedule", id)
            await deleteDoc(sched);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}