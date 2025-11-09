import {auth, db, provider} from "@/firebase/firebase";
import {addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where} from "firebase/firestore"
import {onAuthStateChanged, signInWithPopup} from "firebase/auth";


export default class ModelFirestore {
    /*
    *  === Private collection for Model ===
    * */
    #task = collection(db, "task");
    #notes = collection(db, "notes");
    #schedule = collection(db, "schedule");

    // ✅ UBAH INI: Dari synchronous jadi async
    async #getUser() {
        return new Promise((resolve, reject) => {
            // Cek current user dulu (fast path)
            const currentUser = auth.currentUser;
            if (currentUser) {
                resolve(currentUser);
                return;
            }

            // Kalau null, tunggu auth state initialize
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                unsubscribe();

                if (!user) {
                    alert("You must login first!");
                    reject(new Error("The user is not logged in yet"));
                } else {
                    resolve(user);
                }
            });
        });
    }

    /**
     * Mengecek apakah user sudah login.
     * Jika belum, arahkan ke halaman login.
     * @param {Function} handle - callback saat user belum login.
     */
    async loginFirst(handle) {
        return new Promise((resolve, reject) => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                unsubscribe();
                if (!user) {
                    // belum login → panggil handler redirect
                    if (typeof handle === "function") handle("/pages/home");
                    reject(new Error("User belum login, redirect ke login page."));
                } else {
                    // sudah login → lanjut
                    resolve(user);
                }
            });
        });
    }

    async loginWithGoogle() {
        try {
            const result = await signInWithPopup(auth, provider)
            const user = result.user;
            console.log("User signed in with Google:", user);
            return user
        } catch (e) {
            console.error(e);
            throw new Error(e);
        }
    }

    async logout() {
        try {
            await auth.signOut();
            alert("You Logout Successfully");
        } catch (e) {
            alert("You Logout Error!");
            console.error(e);
            throw new Error(e);
        }
    }


    /*
         === class method for Task Page ====

         include : get task, update task, add task, delete task
    */
    async getAllTask() {
        try {
            const user = await this.#getUser(); // ✅ TAMBAH AWAIT
            if (!user) return [];
            const q = query(this.#task, where("email", "==", user.email));
            const response = await getDocs(q);
            return response.docs.map((doc) => ({id: doc.id, ...doc.data()}));
        } catch (err) {
            console.error("Get tasks error:", err);
            throw err;
        }
    }

    async addTask(newTask) {
        try {
            const user = await this.#getUser(); // ✅ TAMBAH AWAIT
            const data = {...newTask, email: user.email}; // simpan email
            const response = await addDoc(this.#task, data);
            return {id: response.id, ...data};
        } catch (err) {
            console.error("Add task error:", err);
            throw err;
        }
    }

    async updateTask(id, newTask) {
        try {
            const data = doc(db, "task", id);
            await updateDoc(data, newTask);
            return true;
        } catch (err) {
            console.error("Update task error:", err);
            throw err;
        }
    }

    async deleteTask(id) {
        try {
            const ref = doc(db, "task", id);
            await deleteDoc(ref);
            return true;
        } catch (err) {
            console.error("Delete task error:", err);
            throw err;
        }
    }

    /*
     === NOTES ===
    */
    async getAllNotes() {
        try {
            const user = await this.#getUser(); // ✅ TAMBAH AWAIT
            const q = query(this.#notes, where("email", "==", user.email));
            const res = await getDocs(q);
            return res.docs.map((doc) => ({id: doc.id, ...doc.data()}));
        } catch (err) {
            console.error("Get notes error:", err);
            throw err;
        }
    }

    async addNote(newNote) {
        try {
            const user = await this.#getUser(); // ✅ TAMBAH AWAIT
            const data = {...newNote, email: user.email};
            const docRef = await addDoc(this.#notes, data);
            return {id: docRef.id, ...data};
        } catch (err) {
            console.error("Add note error:", err);
            throw err;
        }
    }

    async updateNote(id, newNote) {
        try {
            const data = doc(db, "notes", id);
            await updateDoc(data, newNote);
            return true;
        } catch (err) {
            console.error("Update note error:", err);
            throw err;
        }
    }

    async deleteNote(id) {
        try {
            const res = doc(this.#notes, id);
            return deleteDoc(res);
        } catch (err) {
            console.error("Delete note error:", err);
        }
    }

    /*
     === SCHEDULE ===
    */
    async getAllSchedule() {
        try {
            const user = await this.#getUser(); // ✅ TAMBAH AWAIT
            const q = query(this.#schedule, where("email", "==", user.email));
            const sched = await getDocs(q);
            return sched.docs.map((doc) => ({id: doc.id, ...doc.data()}));
        } catch (err) {
            console.error("Get schedule error:", err);
            throw err;
        }
    }

    async addSchedule(newSchedule) {
        try {
            const user = await this.#getUser(); // ✅ TAMBAH AWAIT
            const data = {...newSchedule, email: user.email};
            const sched = await addDoc(this.#schedule, data);
            return {id: sched.id, ...data};
        } catch (e) {
            console.error("Add schedule error:", e);
            throw e;
        }
    }

    async updateSchedule(id, schedule) {
        try {
            const sched = doc(db, "schedule", id);
            await updateDoc(sched, schedule);
            return true;
        } catch (err) {
            console.error("Update schedule error:", err);
            throw err;
        }
    }

    async deleteSchedule(id) {
        try {
            const sched = doc(db, "schedule", id);
            await deleteDoc(sched);
        } catch (err) {
            console.error("Delete schedule error:", err);
            throw err;
        }
    }
}